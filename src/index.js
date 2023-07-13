const express = require("express");
const router = require("./routes/movies");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use("/movies", router);

module.exports = app;
