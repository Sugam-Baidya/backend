// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());
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

const Registration = mongoose.model("Registration", {
  firstName: String,
  lastName: String,
  phoneNo: String,
});

app.use(bodyParser.json());

// Login as Customer
app.post("/api/login/customer", async (req, res) => {
  const { username, password } = req.body;
  // Validate the request
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
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
  // Validate the request
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
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

  // Validate the request
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
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

  // Validate the request
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
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

// Handle registration post request
app.post("/api/register/customer/details", async (req, res) => {
  const { firstName, lastName, phoneNo } = req.body;

  // Validate the request
  if (!firstName || !lastName || !phoneNo) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await Registration.findOne({ phoneNo });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create a new registration document
    const registration = new Registration({ firstName, lastName, phoneNo });

    // Save the registration to the database
    await registration.save();

    return res.json({
      success: true,
      message: "Registered successfully",
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
