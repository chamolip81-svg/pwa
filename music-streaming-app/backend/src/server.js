import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/music", musicRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});