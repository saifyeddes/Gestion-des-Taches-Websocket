const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

connectDB();

app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send(
    "API de gestion des tâches avec WebSockets est en cours d'exécution"
  );
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
