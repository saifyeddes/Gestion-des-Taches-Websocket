// Récupérer toutes les tâches
const Task = require("../models/Task");
const { getIoInstance } = require("../sockets/taskSocket");

// Récupérer toutes les tâches
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une nouvelle tâche
const addTask = async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title, status: "en cours" });
    await newTask.save();

    // 🔥 Émettre l'événement WebSocket
    const io = getIoInstance();
    if (io) {
      io.emit("task:added", newTask);
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour une tâche
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // 🔥 Émettre l'événement WebSocket
    const io = getIoInstance();
    if (io) {
      io.emit("task:updated", updatedTask);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une tâche
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // 🔥 Émettre l'événement WebSocket
    const io = getIoInstance();
    if (io) {
      io.emit("task:deleted", id);
    }

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };