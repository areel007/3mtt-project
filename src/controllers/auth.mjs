import User from "../models/user.mjs";
import { body, validationResult } from "express-validator";
import mongoSanitize from "mongo-sanitize";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { comparePassword, hashPassword } from "../utils/bcrypt.mjs";

// .env varibales
dotenv.config();

// salt from .env
const salt = Number(process.env.SALT) || 10;

export const register = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .customSanitizer((value) => {
      return mongoSanitize(value);
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .customSanitizer((value) => {
      return mongoSanitize(value);
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const userExist = await User.findOne({ username });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password, salt);

      const newUser = new User({
        username,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

export const login = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .customSanitizer((value) => {
      return mongoSanitize(value);
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .customSanitizer((value) => {
      return mongoSanitize(value);
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const userExist = await User.findOne({ username });
      if (!userExist) {
        return res.status(400).json({ message: "invalid credentials" });
      }

      const isMatch = await comparePassword(password, userExist.password);
      if (!isMatch) {
        return res.status(400).json({ message: "invalid credentials" });
      }

      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const user = {
        id: userExist._id,
        token,
      };

      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
];
