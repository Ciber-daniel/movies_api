const express = require("express");
const router = require("./routes/movies");
const cors = require("cors");
const { swaggerDocs } = require("../swagger");

const app = express();
swaggerDocs(app, process.env.PORT);

app.use(cors());
app.use("/movies", router);

module.exports = app;
