// taskSocket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Un utilisateur s'est connecté au WebSocket");

    socket.on("task:add", (task) => {
      io.emit("task:added", task);
    });

    socket.on("task:update", (task) => {
      io.emit("task:updated", task);
    });

    socket.on("task:delete", (taskId) => {
      io.emit("task:deleted", taskId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Un utilisateur s'est déconnecté");
    });
  });
};
