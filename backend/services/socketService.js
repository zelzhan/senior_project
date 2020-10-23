const socketService = async (socket) => {
  socket.on("message", (message) => console.log(JSON.parse(message)));
};

module.exports = {
  socketService,
};
