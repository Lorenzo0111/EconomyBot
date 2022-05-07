const mongoose = require('mongoose');

const model = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    balance: {
        type: Number,
        default: 0
    },
    lastWork: Number,
    workMessage: String
});

module.exports = mongoose.model("User", model);