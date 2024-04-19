const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/addblog", upload.array("images", 4), async (req, res) => {
  const newblog = new Blog({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
  });

  try {
    const savedBlog = await newblog.save();

    const updatedFiles = req.files.map((file, index) => {
      const oldPath = file.path;
      const newFilename = `${savedBlog._id}-${index}.jpg`;
      const newPath = `uploads/${newFilename}`;
      fs.renameSync(oldPath, newPath);
      return newPath;
    });

    const imageUrls = updatedFiles.map(
      (path) => "/uploads/" + path.split("/").pop()
    );
    savedBlog.images = imageUrls;
    await savedBlog.save();

    return res.send("Blog Created Successfully");
  } catch (error) {
    console.log("error in route");
    return res.status(400).json({ error });
  }
});

router.get("/getallblogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.json({ blogs });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getblogbyid", async (req, res) => {
  const blogid = req.body.blogid;

  try {
    const blog = await Blog.find({ _id: blogid });
    return res.json({ blog });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/getallblogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.json({ blogs });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.patch("/deleteblog", async (req, res) => {
  const { _id } = req.body;

  try {
    const blog = await Blog.findByIdAndDelete(_id);

    if (!blog) return res.status(404).send("Blog not found");

    for (let index = 0; index < 4; index++) {
      const imagePath = `uploads/${blog._id}-${index}.jpg`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.send("Blog deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error deleting Blog");
  }
});

module.exports = router;
