const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const slugify = require("slugify");
const { dirname } = require("path");
const appDir = dirname(require.main.filename);

function startTimer() {
  const startTime = new Date();
  return startTime;
}

function endTimer(startTime = new Date()) {
  const endTime = new Date();
  const timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  const seconds = Math.round(timeDiff);

  return seconds;
}

async function loadTheBeginningAfterTheEnd() {
  const startTime = startTimer();
  const { data } = await axios.get(
    "https://m.lightnovel.world/book/1635/2.html"
  );
  const $ = cheerio.load(data);

  const chapterElements = $("#chapter_content > ul > li");

  let chapters = [];
  chapterElements.each((idx, el) => {
    const url = `https://m.lightnovel.world${$(el).children("a").attr("href")}`;
    const title = $(el).children("a").text();
    const slug = slugify(title, { lower: true });

    chapters.push({ title, url, index: idx, slug });
  });

  const contents = [];
  for (let index = 0; index < chapters.length; index++) {
    const chapter = { ...chapters[index] };
    const content = await loadChapter(chapter.url);

    console.log("Completed Chapter => ", index);
    contents.push({ ...chapter, content });
  }

  fs.writeFile(
    `${appDir}/novels/the-beginning-after-the-end.json`,
    JSON.stringify(contents, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      const endTime = endTimer(startTime);
      console.log(
        "Successfully written data to file. Process ended on ",
        endTime,
        " seconds!"
      );
    }
  );
}

// https://m.lightnovel.world/content/1635/468383.html
const loadChapter = async (url) => {
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const content = $("#content_detail");

  var regex = /<br\s*[\/]?>/gi;
  const formatted = content
    .html()
    .replace(regex, "\n")
    .split("\n")
    .filter((content) => content)
    .join("\n\n");

  return formatted;
};

module.exports = loadTheBeginningAfterTheEnd;
