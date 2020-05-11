"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const models_1 = __importDefault(require("./models"));
const router = express_1.Router();
router.get('/', async (req, res) => {
    try {
        const getPersons = await models_1.default.find({});
        res.status(200).json(getPersons);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/getPerson/:id', async (req, res) => {
    let errors = [];
    models_1.default.find({ _id: req.params.id }, (err, doc) => {
        if (err) {
            errors.push('Cannot find and query the requested id, its either null or already deleted');
            res.status(404).json({ error: err, errors });
        }
        else {
            res.status(200).json(doc);
        }
    });
});
router.post('/addPerson', async (req, res) => {
    let errors = [];
    try {
        const requestBody = req.body;
        const { name, age, gender } = requestBody;
        if (!requestBody)
            errors.push('Request Body is empty');
        let bodyProps = [];
        let propName = ['name', 'age', 'gender'];
        bodyProps.push(name, age, gender);
        for (let props = 0; props < bodyProps.length; props++) {
            if (!bodyProps[props]) {
                errors.push(`'${propName[props]}' is undefined, Please complete the form`);
            }
        }
        if (errors.length)
            throw new Error('Error in Validation');
        else {
            const addPerson = new models_1.default({ name, age, gender });
            const newPerson = await addPerson.save();
            res.status(200).json({ newPerson, ok: true });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message, errors });
    }
});
router.put('/updatePerson/:id', async (req, res) => {
    try {
        const bodyKeys = Object.keys(req.body);
        console.log(bodyKeys);
        if (bodyKeys.length) {
            let tempBodyStore = {};
            const newlyUpdatedProps = bodyKeys.map(key => {
                if (req.body[key]) {
                    tempBodyStore = Object.assign(tempBodyStore, { [key]: req.body[key] });
                }
                else
                    '';
                return tempBodyStore;
            });
            const newBody = newlyUpdatedProps[newlyUpdatedProps.length - 1];
            await models_1.default.findByIdAndUpdate({ _id: req.params.id }, { $set: newBody });
            const newlyUpdatedPerson = await models_1.default.find({ _id: req.params.id });
            res.status(200).json({ newlyUpdatedPerson });
        }
        else {
            const newlyUpdatedPerson = await models_1.default.find({ _id: req.params.id });
            res.status(200).json(newlyUpdatedPerson);
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message, body: req.body });
    }
});
router.delete('/deletePerson/:id', async (req, res) => {
    try {
        const checkPersonId = await models_1.default.find({ _id: req.params.id });
        if (checkPersonId) {
            const deletedPerson = await models_1.default.findByIdAndDelete({ _id: req.params.id });
            res.status(200).json({ deletedPerson, deleted: true });
        }
        else {
            throw new Error('Cannot find and query the requested id, its either null or already deleted');
        }
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
module.exports = router;
