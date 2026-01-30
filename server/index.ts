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

    // Validation when creating a bookmark if the fields are not filled
    if (!title || !url || !category) {
      res.status(400).json({
        error: "Missing required fields: title, url, category",
      });
      return;
    }

    // Create bookmark in database if all the fields are present
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


// Read url bookmark by ID
app.get("/api/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookmark = await prisma.urlBookmarker.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.status(200).json({
      data: bookmark,
    });
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    res.status(500).json({
      error: "Failed to fetch bookmark",
    });
  }
});

// Update url bookmark by ID
app.put("/api/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, category } = req.body;

    const bookmark = await prisma.urlBookmarker.update({
      where: { id: parseInt(id) },
      data: {
        //... is for the case when only some fields are updated so we don't overwrite existing data with undefined
        ...(title && { title }),
        ...(url && { url }),
        ...(category && { category }),
      },
    });

    res.status(200).json({
      message: "Bookmark updated successfully",
      data: bookmark,
    });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    res.status(500).json({
      error: "Failed to update bookmark",
    });
  }
});

// Delete url bookmark by ID
app.delete("/api/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.urlBookmarker.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Bookmark deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({
      error: "Failed to delete bookmark",
    });
  }
});

// Get all url bookmarks
app.get("/api/bookmarks", async (req, res) => {
  try {
    const bookmarks = await prisma.urlBookmarker.findMany();
    res.status(200).json({
      data: bookmarks,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({
      error: "Failed to fetch bookmarks",
    });
  }
});


// Increment click count by clicking url bookmark
//Used post method as clicks are considered an action instead of put which is more for updating resources
app.post("/api/bookmarks/:id/click", async (req, res) => {
  try {
    const { id } = req.params;

    const bookmark = await prisma.urlBookmarker.update({
      where: { id: parseInt(id) },
      data: {
        clicks: {
          //increment is a Prisma operation to increase a field integer value in the database
          increment: 1,
        },
      },
    });

    res.status(200).json({
      message: "Click counted",
      data: bookmark,
    });
  } catch (error) {
    console.error("Error incrementing clicks:", error);
    res.status(500).json({
      error: "Failed to increment clicks",
    });
  }
});



// Log if the server successfully started
app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});