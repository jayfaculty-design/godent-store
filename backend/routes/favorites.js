const { Pool } = require("pg");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "facultyf",
  database: "godent-strore",
  port: 5432,
});

const router = express.Router();

// get favorites
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT p.*,cat.category_name, b.brand_name, ARRAY_AGG(i.url) AS images
        FROM favorites f
        JOIN products p ON f.product_id = p.id
        JOIN categories cat ON p.category = cat.category_id
        JOIN brand b ON p.brand = b.brand_id
        LEFT JOIN images i ON p.id = i.product_id
        WHERE f.user_id = $1
        GROUP BY p.id, cat.category_name, b.brand_name`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.json({
      message: "Error getting favorites",
    });
  }
});

// adding to favorites
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const { productId } = req.body;

  try {
    const existing = await pool.query(
      `SELECT * from favorites WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );
    if (existing.rows.length > 0) return;
    else {
      await pool.query(
        `INSERT into favorites (user_id, product_id) VALUES ($1, $2)`,
        [userId, productId]
      );
    }
    res.json({ message: "Added to favorites successfully" });
  } catch (error) {
    console.error(error);
    res.status(505).json({
      message: "Error getting products from the server",
    });
  }
});

// removing from favorites
router.delete("/", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const { productId } = req.body;

  try {
    const result = await pool.query(
      `DELETE from favorites WHERE user_id = $1 AND product_id = $2 RETURNING *`,
      [userId, productId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Product not found in favorites",
      });
    res.json({
      message: "Product deleted from favorites",
    });
  } catch (error) {
    console.error(error);
    res.status(505).json({
      message: "Error getting products from the server",
    });
  }
});

module.exports = router;
