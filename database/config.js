const mongoose = require('mongoose');
const { createFakeData } = require('../helpers/faker-database');

const conectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // mongoose.connection.db.collection('users').drop();

        // createFakeData();

        console.log("Database successfully connected!")

    } catch (error) {
        console.log(error);
        throw new Error('Error connecting to database. ');
    }
}

module.exports = {
    conectionDB
}