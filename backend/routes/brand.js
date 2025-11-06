const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "facultyf",
  database: "godent-strore",
  port: 5432,
});

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT * from brand
        `);
    res.json(result.rows);
  } catch (err) {
    console.log("Error getting brands", err);
    res.send("Error getting brands");
  }
});

module.exports = router;
