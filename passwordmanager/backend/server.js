import express from 'express';
// import bodyparser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors'
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = "saadPasswordManager";

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const main = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    // to get all passwords from db
    app.get('/', async (req, res) => {
      try {
        const db = client.db(dbName);
        const collection = db.collection('WebsitePasswords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
      } catch (err) {
        console.log("DB connection error", err);
        res.status(500).send('Internal Server Error');
      }
    });

    // to save password to db
    app.post('/', async (req, res) => {
      try {
        const password = req.body;
        console.log('Received data:', password); // Debugging log

        const db = client.db(dbName);
        const collection = db.collection('WebsitePasswords');
        const insertResult = await collection.insertOne(password);
        console.log('Insert result:', insertResult);
        res.send({ success: true, result: insertResult });
      } catch (err) {
        console.log("DB connection error", err);
        res.status(500).send('Create password failed');
      }
    });

    // delete a password from db
    app.delete('/', async (req, res) => {
      try {
        const password = req.body;
        console.log('Received data for deletion:', password); // Debugging log

        const db = client.db(dbName);
        const collection = db.collection('WebsitePasswords');
        const deleteResult = await collection.deleteOne(password);
        console.log('Delete result:', deleteResult); // Debugging log
        res.send({ success: true, result: deleteResult });
      } catch (err) {
        console.log("DB connection error", err);
        res.status(500).send('Delete password failed');
      }
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

main().catch(err => console.log(err));
