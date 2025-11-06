const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "facultyf",
  database: "godent-strore",
  port: 5432,
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.category_name, b.brand_name, ARRAY_AGG(images.url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category = c.category_id
      LEFT JOIN brand b ON p.brand = b.brand_id
      LEFT JOIN images ON p.id = images.product_id
      GROUP BY p.id, c.category_name, b.brand_name
      `);
    res.json(result.rows);
  } catch (error) {
    console.log("Error in fetching products", error);
    res.status(500).send("Error in getting products from the server");
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT p.*, c.category_name, b.brand_name, ARRAY_AGG(images.url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category = c.category_id
      LEFT JOIN brand b ON p.brand = b.brand_id
      LEFT JOIN images ON p.id = images.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.category_name, b.brand_name
      `,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.log("Error getting product details", error);
    res.status(500).send("No product found");
  }
});

module.exports = router;
