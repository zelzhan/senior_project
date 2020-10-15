const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    _id: String,
    name: String,
    age: Number,
    sex: String
});

const db = mongoose.connection;
const User = db.model('User', userSchema);
module.exports.User = User;