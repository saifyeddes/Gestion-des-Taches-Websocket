const express = require("express");
const { getTasks, addTask, updateTask, deleteTask } = require("../../controllers/taskController");
const router = express.Router();

// Route pour récupérer toutes les tâches
router.get("/", getTasks);

// Route pour ajouter une nouvelle tâche
router.post("/", addTask);

// Route pour mettre à jour une tâche
router.put("/:id", updateTask);

// Route pour supprimer une tâche
router.delete("/:id", deleteTask);

module.exports = router;
