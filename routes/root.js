const express = require("express");
const router = express();
const path = require("path");

router.get("/", (req, res, next) => {
  let data = req.body.data;

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  } else if (req.accepts("json")) {
    res.json(data);
  } else {
    res.type("text").send("Hello");
  }
});

module.exports = router;
