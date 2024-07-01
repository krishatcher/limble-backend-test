import express from "express";
import * as mariadb from "mariadb";
import reportController from "./controllers/reports.js";

const app = express();
const port = 3000;
let db;

async function connect() {
  console.info("Connecting to DB...");
  db = mariadb.createPool({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE_NAME"]
  });

  const conn = await db.getConnection();
  try {
    await conn.query("SELECT 1");
  } finally {
    await conn.end();
  }
}

async function main() {
  await connect();

  app.get("/", (req, res) => {
    console.info("Hello!");
    res.send("Hello!");
  });

  app.get('/reports/laborCostComparison', async (req, res) =>  {
    await reportController.laborCostComparison(req, res, db).then((results) => {

      if (results.success) {
        res.status(200).send(results.body);
      } else {
        // the only error we're handling right now is a missing required param
        res.status(400).send(results.body);
      }
    });
  });

  app.listen(port, "0.0.0.0", () => {
    console.info(`App listening on ${port}.`);
  });
}

await main();
