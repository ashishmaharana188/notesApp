// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("vite-express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI; // Use your MongoDB connection string
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a simple schema and model for your form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});
