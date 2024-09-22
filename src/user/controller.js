const User = require("../user/model");

const addUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).json({ message: "User created", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addUser: addUser };
