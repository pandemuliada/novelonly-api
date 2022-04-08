const app = require("./app");
const cron = require("node-cron");
const loadTheBeginningAfterTheEnd = require("./scrapper/the-beginning-after-the-end");
const loadAscendanceOfABookworm = require("./scrapper/ascendance-of-a-bookworm");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);

  /* eslint-enable no-console */
});

cron.schedule("0 */6 * * *", () => {
  console.log("running a task every 6 hours");

  console.log("Fetching TBATE");
  loadTheBeginningAfterTheEnd();
  console.log("Fetching TBATE finish");

  console.log("Fetching TBATE");
  loadAscendanceOfABookworm();
  console.log("Fetching TBATE finish");
});
