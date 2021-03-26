const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt=require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:false
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    sputum: {
        type: Number,
        default: 0
    },
    muscle_pain: {
        type: Number,
        default: 0
    },
    sore_throat: {
        type: Number,
        default: 0
    },
    pneumonia: {
        type: Number,
        default: 0
    },
    cold: {
        type: Number,
        default: 0
    },
    fever: {
        type: Number,
        default: 0
    },
    sneeze: {
        type: Number,
        default: 0
    },
    reflux: {
        type: Number,
        default: 0
    },
    diarrhea: {
        type: Number,
        default: 0
    },
    runny_nose: {
        type: Number,
        default: 0
    },
    difficult_breathing: {
        type: Number,
        default: 0
    },
    chest_pain: {
        type: Number,
        default: 0
    },
    cough: {
        type: Number,
        default: 0
    },
    joint_pain: {
        type: Number,
        default: 0
    },
    fatigue: {
        type: Number,
        default: 0
    },
    flu: {
        type: Number,
        default: 0
    },
    headache: {
        type: Number,
        default: 0
    },
    vomiting: {
        type: Number,
        default: 0
    },
    loss_appetite: {
        type: Number,
        default: 0
    },
    chills: {
        type: Number,
        default: 0
    },
    nausea: {
        type: Number,
        default: 0
    },
    physical_discomfort: {
        type: Number,
        default: 0
    },
    abdominal_pain: {
        type: Number,
        default: 0
    }
});

userSchema.methods.comparePasswords=function(password, cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}


const db = mongoose.connection;
const User = db.model('User', userSchema);
module.exports.User = User;