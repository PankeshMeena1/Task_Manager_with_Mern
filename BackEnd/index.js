require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB:", process.env.DATABASE_URL);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);
const tasksRouter = require("./routes/tasks");
app.use("/api", tasksRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server listening the port " + port);
});
