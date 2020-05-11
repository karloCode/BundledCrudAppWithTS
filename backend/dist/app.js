"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
mongoose_1.default.connect(MONGO_ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .catch(err => {
    if (err)
        throw err;
});
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log(`Connected To MongoDB`);
});
const router_1 = __importDefault(require("./router"));
app.use('/', router_1.default);
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
