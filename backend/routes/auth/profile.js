const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const User = require('../../models/User');

// Route pour récupérer le profil utilisateur
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
