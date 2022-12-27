const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    Messages: {type: String}
});
module.exports = mongoose.model('Messages', Messages);