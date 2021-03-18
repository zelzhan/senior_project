const { User } = require('../schemas/user')
const mongoose = require('mongoose');



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

module.exports.getUser = getUser;
module.exports.updateSymptoms = updateSymptoms;