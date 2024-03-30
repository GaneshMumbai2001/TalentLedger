const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const gigRoutes = require("./routes/gig");

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*", "http://localhost:3000");
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
