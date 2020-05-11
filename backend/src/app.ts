import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_ATLAS_URI: string | undefined = process.env.MONGO_ATLAS_URI !;
mongoose.connect(MONGO_ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
   .catch(err => {
      if(err) throw err
   })

const connection = mongoose.connection;
connection.once('open', () => {
   console.log(`Connected To MongoDB`);
});


import router from './router';
app.use('/', router)

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));