const express = require("express");
const dotenv = require("dotenv");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const checkPass = require("./middleware/checkPass");
dotenv.config();

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|png|jpeg/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images are allowed"), false);
    }
  },
});

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.post("/", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.PASSWORD;

  if (password === adminPassword) {
    upload.single("myImg");

    fs.readdir(path.join(__dirname, "public/img"), (err, files) => {
      if (err) {
        return res.status(500).send("Unable to scan directory");
      }
      // Filter only image files
      const images = files;
      res.render("index.ejs", {
        images: images,
        adminPassword: process.env.PASSWORD,
        errorMessage: null,
        success: true,
      });
    });
  } else {
    res.render("index.ejs", { success: false });
  }
});

// Render the home page with the gallery
app.get("/", (req, res) => {
  fs.readdir(path.join(__dirname, "public/img"), (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    // Filter only image files
    const images = files;
    res.render("index.ejs", {
      images: images,
      adminPassword: process.env.PASSWORD,
      errorMessage: null,
      success: true,
    });
  });
});

app.listen(process.env.PORT, () =>
  console.log(`The app is running on PORT: ${process.env.PORT}`)
);
