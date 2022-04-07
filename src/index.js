const app = require("./app");
const cron = require("node-cron");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

cron.schedule("*/1 * * * *", () => {
  console.log("running a task every two minutes");
});
