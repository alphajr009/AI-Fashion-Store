const express = require("express");
const router = express.Router();
const Product = require("../models/product");
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

router.post("/addproduct", upload.array("images", 4), async (req, res) => {
  const newproduct = new Product({
    name: req.body.name,
    price: req.body.price,
    color: req.body.color,
    type: req.body.type,
    age: req.body.age,
    occasion: req.body.occasion,
    description: req.body.description,
  });

  try {
    const savedProduct = await newproduct.save();

    const updatedFiles = req.files.map((file, index) => {
      const oldPath = file.path;
      const newFilename = `${savedProduct._id}-${index}.jpg`;
      const newPath = `uploads/${newFilename}`;
      fs.renameSync(oldPath, newPath);
      return newPath;
    });

    const imageUrls = updatedFiles.map(
      (path) => "/uploads/" + path.split("/").pop()
    );
    savedProduct.images = imageUrls;
    await savedProduct.save();

    return res.send("Product Created Successfully");
  } catch (error) {
    console.log("error in route");
    return res.status(400).json({ error });
  }
});

router.post("/uploadskin", upload.array("images", 1), async (req, res) => {
  try {
    const uploadedFiles = req.files.map((file) => {
      const oldPath = file.path;
      const newPath = `tokens/${file.filename}`;
      fs.renameSync(oldPath, newPath);
      return newPath;
    });
    return res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ error: "Failed to upload images" });
  }
});

router.get("/getallproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ products });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.patch("/deleteproduct", async (req, res) => {
  const { _id } = req.body;

  try {
    const product = await Product.findByIdAndDelete(_id);

    if (!product) return res.status(404).send("Product not found");

    for (let index = 0; index < 4; index++) {
      const imagePath = `uploads/${product._id}-${index}.jpg`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.send("Product deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error deleting Product");
  }
});

module.exports = router;
