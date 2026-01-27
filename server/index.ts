import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const app = express();
const prisma = new PrismaClient({ adapter });

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Create a new URL Bookmark
app.post("/api/bookmarks", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, url, category } = req.body;

    // Validation
    if (!title || !url || !category) {
      res.status(400).json({
        error: "Missing required fields: title, url, category",
      });
      return;
    }

    // Create bookmark in database
    const bookmark = await prisma.urlBookmarker.create({
      data: {
        title,
        url,
        category,
      },
    });

    res.status(201).json({
      message: "Bookmark created successfully",
      data: bookmark,
    });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({
      error: "Failed to create bookmark",
    });
  }
});

// Health check
app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});