const mongoose = require('mongoose');
const config = require('config');
var MongoClient = require('mongodb').MongoClient;
const db = config.get('mongoURL');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("MONGODB CONNECTED : ")
    } catch (err) {
        console.log('Mongo ERROR : ', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;