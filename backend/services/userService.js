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
        } else {
            console.log(doc);
        }
    });
    
    return 'OK'
}

module.exports.register = register;