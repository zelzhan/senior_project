const { User, Symptoms } = require("../schemas/user");
const ObjectId = require("mongodb").ObjectId;


const getUser = async (id) => {
  const doc = await User.findById(ObjectId(id));
  
  return doc;
};

const getSymptoms = async (id) => {
  const doc = await Symptoms.findById(ObjectId(id));
  
  return doc;
};


const updateSymptoms = async (id, sensors_data) => {
  const doc = await Symptoms.findOneAndUpdate({ _id: id }, sensors_data);
  const updated = await doc.save();
  console.log({ updated });
  return updated;
};



const updateLocation = async ({ id, lon, lat }) => {
  try {
    return await User.updateOne(id, { $set: { location: [lon, lat] } });
  } catch (error) {
    return error;
  }
};

const findClosePeople = async ({ lon, lat }) => {
  try {
    return await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lon, lat] },
          $maxDistance: 15,
        },
      },
    });
  } catch (error) {
    return error;
  }
};

module.exports.getUser = getUser;
module.exports.getSymptoms = getSymptoms;
module.exports.updateLocation = updateLocation;
module.exports.findClosePeople = findClosePeople;
module.exports.updateSymptoms = updateSymptoms;

