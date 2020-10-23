const { getUser } = require("../services/userService");
const { writeSensors, getAllSensors } = require("../services/sensorService");
const axios = require("axios");

const socketService = async (socket) => {
  socket.on("message", async (inp) => {
    const message = JSON.parse(inp);
    try {
      await writeSensors(message);
      const metadata = await getUser(message.id);
      const totaldata = Object.assign({}, metadata._doc, message);
      const result = await axios.post("http://localhost:5000", totaldata);
      socket.send(String(result.data));
    } catch (error) {
      console.log(error.stack);
      socket.send(error.stack);
    }
  });
};

module.exports = {
  socketService,
};
