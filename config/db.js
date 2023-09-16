const mongoose = require('mongoose')
require('dotenv').config();

const mongoURI = process.env.mongoURI;

const connect = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('mongoDB successfully connected')
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
module.exports = connect;