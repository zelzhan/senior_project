const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: Number,
        required: true
    }
});

const db = mongoose.connection;
const User = db.model('User', userSchema);
module.exports.User = User;