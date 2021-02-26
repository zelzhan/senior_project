const { User } = require('../schemas/user')


const register = async (metadata) => {
    const doc = new User({
        _id: metadata.id,
        name: metadata.name,
        age: metadata.age,
        sex: metadata.sex
    })

    await doc.save((error, doc) => {
        if (error) {
            console.log(error);
            return error

        } else {
            console.log(doc);
            return doc;
        }
    });

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

const updateSensors = async (id, sensors_data) => {
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
module.exports.updateSensors = updateSensors;