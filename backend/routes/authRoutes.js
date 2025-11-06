const { Pool } = require("pg");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "facultyf",
  database: "godent-strore",
  port: 5432,
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);

  try {
    // check if email already exists
    const existingEmail = await pool.query(
      `
            SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingEmail.rows.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    // check if username already exists
    const existingUsername = await pool.query(
      `
            SELECT * FROM users WHERE username = $1`,
      [username]
    );
    if (existingUsername.rows.length > 0)
      return res.status(400).json({ message: "Username already exists" });

    // hash password
    const hashPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (username, email, hash_password) VALUES ($1, $2, $3) RETURNING user_id, email`,
      [username, email, hashPassword]
    );
    if (username === "" || email === "" || password === "")
      return res.status(400).json({ message: "Please fill all the fields" });

    res.json({ message: "User created", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign Up Failed" });
  }
});

// sign in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];
    if (!user)
      return res.status(403).json({
        message: "User not found",
      });
    const isValid = await bcrypt.compare(password, user.hash_password);
    if (!isValid)
      return res.status(400).json({
        message: "Password does not match",
      });

    // creating access token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
      },
      SECRET,
      { expiresIn: "10m" }
    );

    // creating refresh token
    const refreshToken = jwt.sign(
      {
        user_id: user.user_id,
      },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // setting refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // sending response to the client
    res.json({
      message: "Login Successful",
      token,
      refreshToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ message: "Unauthorized user" });
  }

  try {
    // verify refresh token
    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Unauthorized user" });

      const result = await pool.query(
        `SELECT * FROM users WHERE user_id = $1`,
        [decoded.user_id]
      );
      const user = result.rows[0];
      if (!user)
        return res.status(403).json({
          message: "User not found",
        });

      // issue new Access Token
      const newAccessToken = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
        },
        SECRET,
        { expiresIn: "10m" }
      );

      res.json({
        token: newAccessToken,
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get profile
router.get("/me", authMiddleware, async (req, res) => {
  const id = req.user.user_id;
  try {
    const user = await pool.query(`SELECT * from users where user_id = $1`, [
      id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// logout
router.post("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ message: "Logged out" });
});

module.exports = router;
