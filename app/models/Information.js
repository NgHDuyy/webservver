const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Information = new Schema({
    soil_moisture: {type: String},
    air_humidity: {type: String},
    soil_temperature: {type: String},
    air_temperature: {type: String},
});
module.exports = mongoose.model('Information', Information);