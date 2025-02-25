const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app); // Créer un serveur HTTP avec Express
const io = socketIo(server); // Lier Socket.IO au serveur

// Middleware
app.use(express.json()); // Parser les requêtes JSON
app.use(cors()); // Configurer CORS

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch((err) => console.log(err));

// Routes Authentification
app.use("/api/auth/signup", require("./routes/auth/signup"));
app.use("/api/auth/login", require("./routes/auth/login"));
app.use("/api/tasks", require("./routes/tasks/taskRoutes"));


require("./sockets/taskSocket")(io);


// WebSocket
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté au WebSocket');

  socket.on('task:add', (task) => {
    console.log('Tâche ajoutée:', task); // Log de la tâche ajoutée
    io.emit('task:added', task); // Émission de l'événement task:added
  });

  socket.on('task:update', (task) => {
    console.log('Tâche mise à jour:', task); // Log de la tâche mise à jour
    io.emit('task:updated', task); // Émission de l'événement task:updated
  });

  socket.on('task:delete', (taskId) => {
    console.log('Tâche supprimée:', taskId); // Log de la tâche supprimée
    io.emit('task:deleted', taskId); // Émission de l'événement task:deleted
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur a été déconnecté du WebSocket');
  });
});


// Démarrage du serveur
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
