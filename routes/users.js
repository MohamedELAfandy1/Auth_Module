const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJwt = require("../middleware/verifyJWT");
router.route("/getAll").get(verifyJwt,userController.getAll);

module.exports = router;
