const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const gigRoutes = require("./routes/gig");

const app = express();
app.use(cors()); // This line enables CORS for all routes and methods, with default settings

// Custom middleware to dynamically set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://talentledger.vercel.app",
    "http://localhost:3000",
  ]; // List of allowed origins
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // Set the received origin in the allowed list
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const dbURI =
  "mongodb+srv://vairamuthu:vairamuthu@vanamvanguard.j4oiqco.mongodb.net/Gig";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

app.use("/api", authRoutes);
app.use("/api", resumeRoutes);
app.use("/api", gigRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
