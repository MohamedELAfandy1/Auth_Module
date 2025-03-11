const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = require("../utils/tokens");
const register = async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(401).json({ message: "User Already Registered" });
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  let newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  let at = accessToken(newUser);
  let rt = refreshToken(newUser);

  res.cookie("jwt", rt, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    at,
    email: newUser.email,
    name: newUser.firstName + newUser.lastName,
  });
};

const login = async (req, res, next) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  let isMatched = await bcrypt.compare(password, user.password);
  if (user && isMatched) {
    let at = accessToken(user);
    let rt = refreshToken(user);

    res.cookie("jwt", rt, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ at });
  } else {
    throw new Error("Invalid Email Or Password");
  }
};

const refresh = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unathorized" });
  }
  const rt = cookies.jwt;
  try {
    const decoded = jwt.verify(rt, process.env.REFRESH_TOKEN_SECRET);
    const at = accessToken(decoded);
    res.json({ message: at });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: err.module });
  }
};

const logout = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No Content
  } else {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie Cleared" });
  }
};
module.exports = { register, login, refresh, logout };
