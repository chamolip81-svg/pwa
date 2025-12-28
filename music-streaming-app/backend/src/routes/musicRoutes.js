import express from "express";
import { searchSongs } from "../controllers/musicController.js";

const router = express.Router();

router.get("/search", searchSongs);

export default router;