"use strict";
const mongoose_1 = require("mongoose");
const personSchema = new mongoose_1.Schema({
    name: String,
    age: Number,
    gender: String
});
const Person = mongoose_1.model('person', personSchema);
module.exports = Person;
