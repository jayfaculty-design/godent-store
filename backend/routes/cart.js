const express = require("express");
const { Pool } = require("pg");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "facultyf",
  database: "godent-strore",
  port: 5432,
});

//adding products to cart
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const { productId, quantity } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * from users WHERE user_id = $1`,
      [userId]
    );
    if (existingUser.rows.length === 0)
      return res.status(400).json({
        message: "No user found",
      });

    const productCheck = await pool.query(
      `SELECT * from products WHERE id = $1`,
      [productId]
    );
    if (productCheck.rows.length === 0)
      return res.status(403).json({
        message: "Product does not exist",
      });

    const existing = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3`,
        [quantity, userId, productId]
      );
    } else {
      await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [userId, productId, quantity]
      );
    }

    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// get the cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT p.*,cat.category_name, cart.quantity, b.brand_name, ARRAY_AGG(i.url) AS images
        FROM cart cart
        JOIN products p ON cart.product_id = p.id
        JOIN categories cat ON p.category = cat.category_id
        JOIN brand b ON p.brand = b.brand_id
        LEFT JOIN images i ON p.id = i.product_id
        WHERE cart.user_id = $1
        GROUP BY p.id, cat.category_name, b.brand_name, cart.quantity`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.log("Error in fetching products", error);
    res.status(500).send("Error in getting products from the server");
  }
});

// delete cart item
router.delete("/", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const { productId } = req.body;
  try {
    const result = await pool.query(
      `DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *`,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    res.json({
      message: "Product removed from cart",
      deletedItem: result.rows[0],
    });
  } catch (error) {
    console.log("Error in fetching products", error);
    res.status(500).send("Error in getting products from the server");
  }
});

// update quantity
router.put("/", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const { productId, quantity } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
      [quantity, userId, productId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({
      message: "Cart updated",
      updatedItem: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error updating cart",
    });
  }
});

module.exports = router;
