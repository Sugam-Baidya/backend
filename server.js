// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());
// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect(
  "mongodb+srv://sugambd:sugambd@minorcluster.xlmrfo4.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = mongoose.model("User", {
  username: String,
  password: String,
  userType: String, // 'customer' or 'seller'
});

app.use(bodyParser.json());

// Login as Customer
app.post("/api/login/customer", async (req, res) => {
  const { username, password } = req.body;

  try {
    const customer = await User.findOne({
      username,
      password,
      userType: "customer",
    });

    if (customer) {
      return res.json({ success: true, message: "Customer login successful" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Login as Seller
app.post("/api/login/seller", async (req, res) => {
  const { username, password } = req.body;

  try {
    const seller = await User.findOne({
      username,
      password,
      userType: "seller",
    });

    if (seller) {
      return res.json({ success: true, message: "Seller login successful" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Register as Customer
app.post("/api/register/customer", async (req, res) => {
  console.log("api running");
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const customer = new User({
      username,
      password,
      userType: "customer",
    });

    await customer.save();

    return res.json({
      success: true,
      message: "Customer registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Register as Seller
app.post("/api/register/seller", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const seller = new User({
      username,
      password,
      userType: "seller",
    });

    await seller.save();

    return res.json({
      success: true,
      message: "Seller registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
