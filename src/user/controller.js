const User = require("../user/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Register
const addUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).json({ message: "User created", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

// LogIn
const logIn = async (req, res) => {
  try {
    if (req.authCheck) {
      const user = {
        id: req.authCheck.id,
        username: req.authCheck.username,
        email: req.authCheck.email,
      };
      return res
        .status(200)
        .json({ message: "Succesfull persistant Log In", user: user });
    }

    const token = await jwt.sign(
      { id: req.user._id.toString() },
      process.env.SECRET
    );

    const user = {
      username: req.user.username,
      id: req.user.id,
      email: req.user.email,
      token: token,
    };

    res.status(200).json({ message: "Succesfull log in", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Users
const getAllUsers = async (req, res) => {
  try {
    if (!req.authCheck) {
      res.status(200).json({ message: "You are nit authorized" });
    }
    const users = await User.find();

    res.status(200).json({ message: "Success", users: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updateUser

const updateUser = async (req, res) => {
  try {
    if (!req.authCheck) {
      res.status(200).json({ message: "You are nit authorized" });
    }

    const user = await User.findById(req.authCheck.id);

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    if (req.body.choice === "username") {
      user.username = req.body.update;
      await user.save();
      res.status(200).json({ message: "Success", user: user });
    } else if (req.body.choice === "email") {
      user.email = req.body.update;
      await user.save();
      res.status(200).json({ message: "Success", user: user });
    } else if (req.body.choice === "password") {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      user.password = await bcrypt.hash(req.body.update, saltRounds);
      await user.save();
      res.status(200).json({ message: "Success", user: user });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: error.message });
  }
};

const sendResetLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 3600000; // 1 hour expiration

    // Save the token and expiration in the user's document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // Send email with the token link
    const resetUrl = `https://organiserbe-production.up.railway.ap/resetPassordRequest/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click the following link to reset your password: ${resetUrl}`,
    });

    res
      .status(200)
      .json({ message: "Password reset link sent to email.", user: user });
  } catch (error) {
    res.status(500).json({ error: error, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    user.password = await bcrypt.hash(req.body.password, saltRounds);
    await user.save();

    res.status(200).json({ message: "Password has been changed" });
  } catch (error) {
    res.status(500).json({ error: error, message: error.message });
  }
};

module.exports = {
  addUser: addUser,
  getAllUsers: getAllUsers,
  logIn: logIn,
  updateUser: updateUser,
  sendResetLink: sendResetLink,
  resetPassword: resetPassword,
};
