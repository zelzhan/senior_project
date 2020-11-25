const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: "String",
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const db = mongoose.connection;
userSchema.index({ location: "2dsphere" });
const User = db.model("User", userSchema);
module.exports.User = User;
