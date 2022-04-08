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

const recusivelyScrapChaptersAscendanceOfABookworm = async (
  previousData = [],
  nextUrl = ""
) => {
  let chapters = [];

  if (nextUrl) {
    const { data } = await axios.get(nextUrl);
    const $ = cheerio.load(data);

    // Next Button body > div.main > div > div > div.col-content > div.m-newest2 > div.page > a:nth-child(4)
    const chapterList = $(
      "body > div.main > div > div > div.col-content > div.m-newest2 > ul li"
    );

    const nextLink = $(
      "body > div.main > div > div > div.col-content > div.m-newest2 > div.page > a:nth-child(4)"
    );

    let nextPageUrl = null;
    if (nextLink.html() !== "None") {
      nextPageUrl = "https://freewebnovel.com" + nextLink.attr("href");
    }

    chapterList.each((index, el) => {
      const title = $(el).children("a").text();
      const slug = slugify(title, { lower: true });
      const url = "https://freewebnovel.com" + $(el).children("a").attr("href");

      chapters.push({
        title,
        slug,
        index,
        url,
      });
    });

    return recusivelyScrapChaptersAscendanceOfABookworm(
      [...previousData, ...chapters],
      nextPageUrl
    );
  } else {
    return [...previousData, ...chapters];
  }
};

async function loadAscendanceOfABookworm() {
  const startTime = startTimer();
  const chapters = await recusivelyScrapChaptersAscendanceOfABookworm(
    [],
    "https://freewebnovel.com/ascendance-of-a-bookworm.html"
  );

  const contents = [];
  for (let index = 0; index < chapters.length; index++) {
    const chapter = { ...chapters[index] };
    const content = await loadChapterAscendanceOfTheBookworm(chapter.url);

    console.log("Completed Chapter => ", index);
    contents.push({ ...chapter, content });
  }

  fs.writeFile(
    `${appDir}/novels/ascendance-of-a-bookworm.json`,
    JSON.stringify(contents, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    }
  );

  const endTime = endTimer(startTime);
  console.log("Scrapped with ", endTime, " seconds");
  // const content = await loadChapterAscendanceOfTheBookworm(
  //   "https://freewebnovel.com/ascendance-of-a-bookworm/chapter-202.html"
  // );

  // console.log(content);
}

const loadChapterAscendanceOfTheBookworm = async (url) => {
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const content = $("#main1 > div > div > div.txt p");

  const contents = content.toArray().map((el) => {
    return $(el).text();
  });

  return contents.join("\n\n");
};

module.exports = loadAscendanceOfABookworm;
