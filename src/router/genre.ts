import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken";
import Genre from "../model/Genre";

const router = express.Router();

//get all genre
router.get("/all-genre", async (req, res) => {
  try {
    const genre = await Genre.find();
    return res.json(genre);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//create genre
router.post("/create-genre", verifyTokenAdmin, async (req, res) => {
  try {
    const newGenre = new Genre(req.body);
    const saveGenre = await newGenre.save();

    return res.json(saveGenre);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//update genre
router.put("/update-genre/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    //response update genre info
    return res.json(updateGenre);
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

//delete genre
router.delete("/delete-genre/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deleteGenre = await Genre.findByIdAndRemove(req.params.id);
    //response delete genre
    return res.json({ deleteGenre, message: "genre has been delete." });
  } catch (error: any) {
    //response error from server
    return res.status(500).send(error.message);
  }
});

export default router;
