const Influx = require('influx');


const InfluxDb = new Influx.InfluxDB({
    host: 'localhost',
    database: 'sensors',
    port: 8086,
    schema: [
        {
            measurement: 'sensors',
            fields: {
                id: Influx.FieldType.STRING,
                cp: Influx.FieldType.INTEGER,
                trestbps: Influx.FieldType.INTEGER,
                chol: Influx.FieldType.INTEGER,
                fbs: Influx.FieldType.INTEGER,
                restecg: Influx.FieldType.INTEGER,
                thalach: Influx.FieldType.INTEGER,
                exang: Influx.FieldType.INTEGER,
                oldpeak: Influx.FieldType.INTEGER,
                slope: Influx.FieldType.INTEGER,
                ca: Influx.FieldType.INTEGER,
                thal: Influx.FieldType.INTEGER,
                graph: Influx.FieldType.STRING
            },
            tags: [
                'hostname'
            ] 
        }
    ]
});

module.exports = {
    InfluxDb
};