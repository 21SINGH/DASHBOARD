import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = 'Souravisagoodb$boy';

// Sign-up route
router.post("/s", async (req, res) => {
  const { name, email, password, city, state, country, occupation, phoneNumber } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
      state,
      country,
      occupation,
      phoneNumber,
    });

    // Generate a JSON Web Token (JWT) for the new user
    const token = jwt.sign({ userId: newUser._id },JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token back to the frontend as a response
    res.json({ token });

  } catch (err) {
    console.error("Sign-up error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
