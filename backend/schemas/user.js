const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  sputum: {
    type: Number,
    default: 0,
  },
  muscle_pain: {
    type: Number,
    default: 0,
  },
  sore_throat: {
    type: Number,
    default: 0,
  },
  pneumonia: {
    type: Number,
    default: 0,
  },
  cold: {
    type: Number,
    default: 0,
  },
  fever: {
    type: Number,
    default: 0,
  },
  sneeze: {
    type: Number,
    default: 0,
  },
  reflux: {
    type: Number,
    default: 0,
  },
  diarrhea: {
    type: Number,
    default: 0,
  },
  runny_nose: {
    type: Number,
    default: 0,
  },
  difficult_breathing: {
    type: Number,
    default: 0,
  },
  chest_pain: {
    type: Number,
    default: 0,
  },
  cough: {
    type: Number,
    default: 0,
  },
  joint_pain: {
    type: Number,
    default: 0,
  },
  fatigue: {
    type: Number,
    default: 0,
  },
  flu: {
    type: Number,
    default: 0,
  },
  headache: {
    type: Number,
    default: 0,
  },
  vomiting: {
    type: Number,
    default: 0,
  },
  loss_appetite: {
    type: Number,
    default: 0,
  },
  chills: {
    type: Number,
    default: 0,
  },
  nausea: {
    type: Number,
    default: 0,
  },
  physical_discomfort: {
    type: Number,
    default: 0,
  },
  abdominal_pain: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.comparePasswords = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(next);
    cb(null, isMatch);
  });
};

const db = mongoose.connection;
userSchema.index({ location: "2dsphere" });
const User = db.model("User", userSchema);
module.exports.User = User;

/*


    va sputum: Int = 0,
    va muscle_pain: Int = 0,
    va sore_throat: Int = 0,
    va pneumonia: Int = 0,
    va cold: Int = 0,
    va fever: Int = 0,
    va sneeze: Int = 0,
    va reflux: Int = 0,
    va diarrhea: Int = 0,
    va runny_nose: Int = 0,
    va difficult_breathing: Int = 0,
    va chest_pain: Int = 0,
    va cough: Int = 0,
    va joint_pain: Int = 0,
    va fatigue: Int = 0,
    va flu: Int = 0,
    va headache: Int = 0,
    va vomiting: Int = 0,
    va loss_appetite: Int = 0,
    va chills: Int = 0,
    va nausea: Int = 0,
    va physical_discomfort: Int = 0,
    va abdominal_pain: Int = 0,



(
"sputum" to 0,
"muscle_pain" to 0,
"sore_throat" to 0,
"pneumonia" to 0,
"cold" to 0,
"fever" to 0,
"sneeze" to 0,
"reflux" to 0,
"diarrhea" to 0,
"runny_nose" to 0,
"difficult_breathing" to 0,
"chest_pain" to 0,
"cough" to 0,
"joint_pain" to 0,
"fatigue" to 0,
"flu" to 0,
"headache" to 0,
"vomiting" to 0,
"loss_appetite" to 0,
"chills" to 0,
"nausea" to 0,
"physical_discomfort" to 0,
"abdominal_pain" to 0,

    )


listOf("sputum", "sputum"),
listOf("muscle_pain", "muscle_pain"),
listOf("sore_throat", "sore_throat"),
listOf("pneumonia", "pneumonia"),
listOf("cold", "cold"),
listOf("fever", "fever"),
listOf("sneeze", "sneeze"),
listOf("reflux", "reflux"),
listOf("diarrhea", "diarrhea"),
listOf("runny_nose", "runny_nose"),
listOf("difficult_breathing", "difficult_breathing"),
listOf("chest_pain", "chest_pain"),
listOf("cough", "cough"),
listOf("joint_pain", "joint_pain"),
listOf("fatigue", "fatigue"),
listOf("flu", "flu"),
listOf("headache", "headache"),
listOf("vomiting", "vomiting"),
listOf("loss_appetite", "loss_appetite"),
listOf("chills", "chills"),
listOf("nausea", "nausea"),
listOf("physical_discomfort", "physical_discomfort"),
listOf("abdominal_pain", "abdominal_pain"),


*/
