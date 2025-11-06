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
    const { q } = req.query;
    if (!q) {
      return res.json({
        products: [],
      });
    }
    const response = await pool.query(`
      SELECT p.*, c.category_name, b.brand_name, ARRAY_AGG(images.url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category = c.category_id
      LEFT JOIN brand b ON p.brand = b.brand_id
      LEFT JOIN images ON p.id = images.product_id
      GROUP BY p.id, c.category_name, b.brand_name
      `);

    const searchTerm = q.toLowerCase();
    const filteredProducts = response.rows.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.category_name?.toLowerCase().includes(searchTerm) ||
        product.brand_name?.toLowerCase().includes(searchTerm)
    );

    res.json({
      message: "Success",
      count: filteredProducts.length,
      products: filteredProducts,
    });
  } catch (error) {
    console.error("Error querying products", error);
    res.status(500).json({ message: "Error querying products" });
  }
});

module.exports = router;
