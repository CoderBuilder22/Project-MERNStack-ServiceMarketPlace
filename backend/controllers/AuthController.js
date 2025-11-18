import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, skills, city, tel } = req.body;
    const photo = req.file ? req.file.path : null;

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

  
    if (role !== 'customer' && role !== 'provider') {
      return res.status(400).json({ message: "Role must be 'customer' or 'provider'" });
    }

    if (!tel || !/^\d{8}$/.test(tel)) {
      return res.status(400).json({ message: "Phone must be exactly 8 digits" });
    }

    
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }

    
    if (typeof city !== 'string' || city.trim() === '') {
      return res.status(400).json({ message: "City must be a non-empty string" });
    }

    if(password.trim()===''){
      return res.status(400).json({ message: "Password cannot be empty or whitespace" });
    }

    const existingUser = await User.findOne({ email }) || await User.findOne({ tel });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      bio,
      skills,
      photo,
      city,
      tel,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role === "provider" || user.role === "customer") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    }
    else if (user.role === "admin") {
      if (password !== user.password) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const ResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const restLink = `${process.env.FRONTEND_URL}update-password/${user._id}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Service Market Place Password Reset",
      text: `Click the link to reset your password: ${restLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export default { register, login, ResetPassword, updatePassword };
