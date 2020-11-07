const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    lastname: String,
    age: Number,
    role: String
}, {
    timestamps: true,
});
//mongoose.model(modelName, Schema, tableNameinDatabase)                
module.exports = mongoose.model('User', userSchema, 'User');