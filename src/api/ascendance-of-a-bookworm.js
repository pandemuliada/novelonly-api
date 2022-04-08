const express = require("express");
const chapters = require("../novels/ascendance-of-a-bookworm.json");
const router = express.Router();

router.get("/", (req, res) => {
  const formatted = chapters.map(({ content, ...chapter }) => chapter);
  res.json(formatted);
});

router.get("/:index", (req, res) => {
  const index = req.params.index;

  res.json(chapters[index]);
});

module.exports = router;