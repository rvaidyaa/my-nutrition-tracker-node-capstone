"use strict";

const mongoose = require('mongoose');

const onlineSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    unixtime: {
        type: String,
        required: false
    }
});



const online = mongoose.model('online', onlineSchema);

module.exports = online;
