const express = require("express");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const brandsRoutes = require("./routes/brand");
const cartRoutes = require("./routes/cart");
const favoriteRoutes = require("./routes/favorites");
const authRoutes = require("./routes/authRoutes");
const searchRoute = require("./routes/search");
const orderRoutes = require("./routes/ordersRoutes");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://godent-store.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to my backend server");
});
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/brands", brandsRoutes);
app.use("/cart", cartRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoute);
app.use("/orders/webhook", orderRoutes);
app.use("/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
