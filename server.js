const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");

dotenv.config();
require("./config/dbConnection")();
const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "25kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root.js"));
app.use("/auth", require("./routes/auth.js"));
app.use("/users", require("./routes/users.js"));

app.all("*", (req, res, next) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Listenning On Port ${process.env.PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  process.exit(1);
});
