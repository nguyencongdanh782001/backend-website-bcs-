import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`,
      (error: any, user: any) => {
        if (error) {
          return res.status(403).send("Token is not valid!");
        } else {
          req.user = user;
          next();
        }
      }
    );
  } else {
    return res.status(401).send("You are not authenticated!");
  }
};

export const verifyTokenAdmin = (req: any, res: any, next: any) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).send("You are not allowed to do that!");
    }
  });
};
