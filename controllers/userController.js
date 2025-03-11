const User = require("../models/userModel");

const getAll = async (req, res, next) => {
  let users = await User.find().select("-password").lean();
  res.json(users);
};

module.exports = { getAll };
