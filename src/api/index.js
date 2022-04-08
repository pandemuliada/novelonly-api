const express = require("express");

const emojis = require("./emojis");
const tbate = require("./the-beginning-after-the-end");
const ascendanceOfABookworm = require("./ascendance-of-a-bookworm");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/the-beginning-after-the-end", tbate);
router.use("/ascendance-of-a-bookworm", ascendanceOfABookworm);

module.exports = router;
