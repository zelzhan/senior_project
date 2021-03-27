const { getUser } = require("../services/userService");
const { writeSensors, getAllSensors } = require("../services/sensorService");
const { sendSmS } = require("../services/smsService");
const axios = require("axios");

const socketService = async (socket) => {
  socket.on("message", async (inp) => {
    const message = JSON.parse(inp);
    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    message.graph = message.restecg.toString();
    message.restecg = message.restecg.map(Math.abs);
    message.restecg = average(message.restecg);

    await writeSensors(message);

    try {
      const metadata = await getUser(message.id);
      const totaldata = Object.assign({}, metadata._doc, message);

      const result = await axios.post("http://localhost:5000", totaldata);

      if (+result.data > 0) {
        const people = await findClosePeople({
          lon: metadata.location[0],
          lat: metadata.location[1],
        });
        console.log("The following people would be notified");
        console.log(people);
      }

      await sendSmS(`00${metadata.phone}`, +result.data);
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
