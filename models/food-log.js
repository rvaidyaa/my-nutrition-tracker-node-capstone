"use strict";

const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    calories: {
        type: String,
        required: false
    },
    fiber: {
        type: String,
        required: false
    },
    potassium: {
        type: String,
        required: false
    },
    totalFat: {
        type: String,
        required: false
    },
    carbs: {
        type: String,
        required: false
    },
    protein: {
        type: String,
        required: false
    },
    sugar: {
        type: String,
        required: false
    },
    sodium: {
        type: String,
        required: false
    },
    satFat: {
        type: String,
        required: false
    }
});



const foodLog = mongoose.model('foodLog', foodLogSchema);

module.exports = foodLog;
