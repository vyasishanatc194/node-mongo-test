const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
                
// Connect to the db
const database = mongoose.connect("mongodb://mongo:27017/nodeMongoTest",{
        useNewUrlParser: true
    }).then((db) => {
        console.log("Successfully connected to the database");   
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
                
module.exports = database;