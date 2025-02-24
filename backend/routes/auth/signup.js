const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const router = express.Router();

// Route Signup
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "Cet email est déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ msg: "Inscription réussie !" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

module.exports = router;
