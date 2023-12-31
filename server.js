const express = require("express");
require('dotenv').config();

const connectDB = require("./src/config/db");
const cors = require("cors");

const app = express();
app.use(cors());

// connect Database
connectDB();

// Init Middleware
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => { 
  res.json({ msg: "hello" });
});
const PORT = process.env.PORT;

// Define Routes
app.use("/api/auth-user", require("./src/routes/Auth"));
app.use("/api/blogs", require("./src/routes/blogs"));
app.use("/api/jobs", require("./src/routes/jobs"));
app.use("/api/internships", require("./src/routes/internships"));
app.use("/api/users", require("./src/routes/users"));

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`); 
});