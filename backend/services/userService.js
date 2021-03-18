const { User } = require("../schemas/user");
const mongoose = require("mongoose");

var bcrypt = require("bcrypt");

const register = async (metadata) => {
  const user = await User.findOne({ email: metadata.email });

  if (user) {
    console.log("email exists?");
    throw new Error("email already exists");
  } else {
    const doc = new User({
      password: bcrypt.hashSync(metadata.password, 8),
      email: metadata.email,
      name: metadata.name,
      age: metadata.age,
      gender: metadata.gender,
    });
    const results = await doc.save();
    console.log(results);
    return results;
  }
};

const getUser = async (id) => {
  try {
    const doc = await User.findById(id);
    console.log(doc);
    return doc;
  } catch (error) {
    return error;
  }
};

const updateSymptoms = async (id, sensors_data) => {
  try {
    const doc = await User.findOneAndUpdate({ _id: id }, sensors_data);
    doc.save();
    console.log(doc);
    return doc;
  } catch (error) {
    return error;
  }
};

module.exports.register = register;
module.exports.getUser = getUser;
module.exports.updateSymptoms = updateSymptoms;
