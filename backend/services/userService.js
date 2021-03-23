const { User } = require("../schemas/user");
const mongoose = require("mongoose");


const getUser = async (id) => {
  const doc = await User.findById(id);
  console.log(doc);
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
