const messagingApi = require("@cmdotcom/text-sdk");

const myMessageApi = new messagingApi.MessageApiClient(
  "9C0625AC-7590-47B0-81EC-C0F95AFFB722"
);

const sendSmS = async (phone, status) => {
  phone = "0077781294658";
  try {
    let message;

    switch (status) {
      case 1:
        message = "There is a little chance that you are infected";
        break;
      case 2:
        message = "There is a 50% chance that you are infected";
        break;

      case 3:
        message = "There is a high chance that you are infected";
        break;

      case 4:
        message = "You are about to die!";
        break;
    }

    const result = await myMessageApi.sendTextMessage(
      [phone],
      "IMPORTANT",
      message
    );
    console.log(result.body);
  } catch (error) {
    console.error(error.stack);
  }
};

module.exports = {
  sendSmS,
};
