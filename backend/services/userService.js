const { User } = require("../schemas/user");

const register = async (metadata) => {
  const doc = new User({
    _id: metadata.id,
    name: metadata.name,
    age: metadata.age,
    sex: metadata.sex,
  });

  await doc.save((error, doc) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log(doc);
      return doc;
    }
  });
};

const getUser = async (id) => {
  try {
    const doc = await User.findById(id);
    return doc;
  } catch (error) {
    return error;
  }
};

const updateLocation = async ({ id, lon, lat }) => {
  try {
    return await User.updateOne(id, { $set: { location: [lon, lat] } });
  } catch (error) {
    return error;
  }
};

const findClosePeople = async ({ lon, lat }) => {
  try {
    return await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lon, lat] },
          $maxDistance: 15,
        },
      },
    });
  } catch (error) {
    return error;
  }
};

module.exports.register = register;
module.exports.getUser = getUser;
module.exports.updateLocation = updateLocation;
module.exports.findClosePeople = findClosePeople;
