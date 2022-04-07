const express = require("express");
const chapters = require("../novels/the-beginning-after-the-end.json");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(chapters);
});

router.get("/:index", (req, res) => {
  const index = req.params.index;

  res.json(chapters[index]);
});

module.exports = router;
