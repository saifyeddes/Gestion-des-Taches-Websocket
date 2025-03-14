const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { Server } = require("socket.io");
const { setIoInstance } = require("./sockets/taskSocket");

dotenv.config();
const app = express();
const server = http.createServer(app); // Créer un serveur HTTP avec Express
const io = new Server(server, { cors: { origin: "*" } }); // Lier Socket.IO au serveur

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


io.on("connection", (socket) => {
  console.log("🟢 Un utilisateur s'est connecté au WebSocket");

  // Définir l'instance de Socket.IO
  setIoInstance(io);

  socket.on("disconnect", () => {
    console.log("🔴 Un utilisateur s'est déconnecté");
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
