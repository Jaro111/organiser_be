const User = require("../user/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

module.exports = {
  addUser: addUser,
  getAllUsers: getAllUsers,
  logIn: logIn,
  updateUser: updateUser,
};
