const { User } = require("../schemas/user");
const ObjectId = require("mongodb").ObjectId;


const getUser = async (id) => {
  const doc = await User.findById(ObjectId(id));
  
  return doc;
};

const updateSymptoms = async (id, sensors_data) => {
  const doc = await User.findOneAndUpdate({ _id: id }, sensors_data);
  const updated = await doc.save();
  console.log({ updated });
  return updated;
};

module.exports.getUser = getUser;
module.exports.updateSymptoms = updateSymptoms;
