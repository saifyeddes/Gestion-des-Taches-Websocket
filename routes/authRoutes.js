const express = require("express");
const { register, login } = require("../controllers/authController"); // Vérifie bien ce chemin !

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
