import { Schema, model } from 'mongoose';

const personSchema = new Schema({
   name: String,
   age: Number,
   gender: String
});

const Person = model('person', personSchema);
export = Person;