const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    created_by: String
}, {
    timestamps: true,
});
//mongoose.model(modelName, Schema, tableNameinDatabase)                
module.exports = mongoose.model('Product', productSchema, 'Product');