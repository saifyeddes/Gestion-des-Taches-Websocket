const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Données reçues :", req.body); // Affiche les données reçues
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Tous les champs sont obligatoires" });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log("Utilisateur déjà existant :", email);
      return res.status(400).json({ msg: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    console.log("Utilisateur créé :", user);

    res.status(201).json({ msg: "Inscription réussie !" });
  } catch (error) {
    console.error("Erreur serveur :", error); // Affiche l'erreur
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

module.exports = router;
