const jwt = require("jsonwebtoken");
const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unathorized" });
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.userId; 
      next();
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }
  }
};
module.exports = verifyJwt;
