const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../user/model");
const salrRounds = parseInt(process.env.SALT_ROUNDS);

// HASH PASSWORD
const hashPass = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, salrRounds);
    req.body.password = hashPassword;
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// COMPARE PASSWORD
const comparePass = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    const myPasword = user.password;

    const checkPassword = await bcrypt.compare(req.body.password, myPasword);

    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// TOKEN CHECK
const tokenCheck = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      throw new Error("No token Pass");
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    const decodedToken = await jsonwebtoken.verify(token, process.env.SECRET);

    const user = await User.findOne({ _id: decodedToken.id });

    if (!user) {
      res.status(401).json({ message: "Not authorized" });
    }
    req.authCheck = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
  tokenCheck: tokenCheck,
};
