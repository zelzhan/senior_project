const { InfluxDb } = require('../schemas/sensor')

const writeSensors = async (sensordata) => {
    return InfluxDb.writePoints([
        {
            measurement: 'sensors',
            fields: {
                id: sensordata.id,
                cp: sensordata.cp,
                trestbps: sensordata.trestbps,
                chol: sensordata.chol,
                fbs: sensordata.fbs,
                restecg: sensordata.restecg,
                thalach: sensordata.thalach,
                exang: sensordata.exang,
                oldpeak: sensordata.oldpeak,
                slope: sensordata.slope,
                ca: sensordata.ca,
                thal: sensordata.thal
            }
        }
    ],
        {
            database: 'sensors'
        }).catch(err => {
            console.error(err.stack);
        })
};


const getAllSensors = async () => {
    return InfluxDb.query('select * from sensors');
}

module.exports = {
    writeSensors,
    getAllSensors
};