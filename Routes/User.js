import express from "express";
import User from "../Model/UserModel.js";
import { authMiddleware } from "../Middleware/Autheticatetoken.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../Model/TokenModel.js";
const UserRouter = express.Router();

UserRouter.post("/register", authMiddleware, async (req, res) => {
  try {
    const { username, email, password, phone_number } = req.body;

    // Validate the recieved data on the body or not
    if (!username || !email || !password || !phone_number) {
      return res.status(500).json({
        error:
          "All Required Fields (username, email, password, phone_number) must be sent.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check existing user
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phone_number }, { username }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or Phone number is already in use" });
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone_number,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password is mandatory for login" });
    }

    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid Username or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or password" });
    }

    const existingToken = await Token.findOne({ where: { user: user.id } });

    // Delete the existing token
    if (existingToken) {
      await Token.destroy({ where: { user: user.id } });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    // Store the token in the tokens table
    await Token.create({
      user: user.id, // Assuming privateKey is a column in User table
      token: token,
    });
    // console.log("New Token -", token);

    // Send response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { UserRouter };
