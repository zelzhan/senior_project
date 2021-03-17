const { User } = require('../schemas/user')
const mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

const register = async (metadata) => {
    let doc;
    User.findOne({ "email": metadata.email }, function (err, user) {
        if (user) {
            console.log("email exists?")
            return err
        } else {
            doc = new User({
                password: bcrypt.hashSync(metadata.password, 8),
                email: metadata.email,
                name: metadata.name,
                age: metadata.age,
                gender: metadata.gender
            })
            doc.save();
            console.log(doc);
            return doc;
        }
    })


}

const getUser = async (id) => {
    try {

        const doc = await User.findById(id);
        console.log(doc);
        return doc;
    } catch (error) {
        return error
    }

}

const updateSymptoms = async (id, sensors_data) => {
    try {
        const doc = await User.findOneAndUpdate({ _id: id }, sensors_data);
        doc.save()
        console.log(doc);
        return doc;
    } catch (error) {
        return error
    }
}

module.exports.register = register;
module.exports.getUser = getUser;
module.exports.updateSymptoms = updateSymptoms;