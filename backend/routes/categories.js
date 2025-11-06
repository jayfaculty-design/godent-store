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
    const result = await pool.query(`SELECT * from categories`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error getting product categories");
  }
});

module.exports = router;
