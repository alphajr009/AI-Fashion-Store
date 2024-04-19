const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cron = require("cron");

const app = express();

const userRoute = require("./routes/usersRoute");
const productRoute = require("./routes/productsRoute");
const emailRoute = require("./routes/emailRoute");
const cartRoute = require("./routes/cartRoute");
const blogRoute = require("./routes/blogsRoute");
const orderRoute = require("./routes/orderRoute");

app.use(helmet());
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5005",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

const dbconfig = require("./db");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/tokens", express.static(path.join(__dirname, "tokens")));

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/email", emailRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/blog", blogRoute);
app.use("/api/order", orderRoute);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

app.listen(port, () => console.log("Node Server Started using Nodemon!"));

// Cron job to delete images older than 1 day
const deleteOldImagesJob = new cron.CronJob("0 */10 * * * *", () => {
  const directoryPath = path.join(__dirname, "tokens");
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isFile() && stats.mtime < oneDayAgo) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
              return;
            }
            console.log(`Deleted ${filePath}`);
          });
        }
      });
    });
  });
});

deleteOldImagesJob.start();
