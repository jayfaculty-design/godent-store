const express = require("express");
const { Pool } = require("pg");
const authMiddleware = require("../middlewares/authMiddleware");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "facultyf",
  database: "godent-strore",
  port: 5432,
});

const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// creating order and payment intent
router.post("/create-order", authMiddleware, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { customerName, customerEmail, cartItems } = req.body;

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await client.query("BEGIN");

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status) 
         VALUES ($1, $2, 'pending') RETURNING id`,
      [userId || null, total]
    );

    const orderId = orderResult.rows[0].id;

    // insert order items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, image) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          (item.images && item.images[0]) || null,
        ]
      );
    }

    // create stripe paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: {
        orderId: orderId.toString(),
        userId: userId?.toString() || "guest",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    try {
      await client.query(
        `UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2`,
        [paymentIntent.id, orderId]
      );
    } catch (err) {
      console.log("stripe_payment_intent_id column not found, skipping...");
    }

    await client.query("COMMIT");

    res.json({
      orderId,
      clientSecret: paymentIntent.client_secret,
      total,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// get all orders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});

// get order details
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
      orderId,
    ]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
});

// stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      // update order status
      await pool.query(`UPDATE orders SET status = 'completed' WHERE id = $1`, [
        orderId,
      ]);

      console.log(`Order ${orderId} marked as completed`);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await pool.query(`UPDATE orders SET status = 'failed' WHERE id = $1`, [
        orderId,
      ]);

      console.log(`Order ${orderId} marked as failed`);
    }

    res.json({ received: true });
  }
);
module.exports = router;
