const express = require('express');
const Boom = require('boom');
const _ = require('lodash');
const productModel = require('../models/productModel');
const constants = require('../Common/Constants');

// Verify JWT token
exports.verifyJWTToken = (req, res,next) => {
    let authHeader = req.header('Authorization');
    if(!authHeader) {
        return res.send(Boom.unauthorized('Token Required').output.payload);
    }
    let token = authHeader.split(' ')[1];
    if(token) {
        const verifyToken = constants.verifyToken(token);
        if(!verifyToken){
            return res.send(Boom.unauthorized('Token Invalid').output.payload);
        }
        req.userData = verifyToken;
    }
    return next();
};

// Check User Roles
exports.checkUserRole = (req, res,next) => {
    if(req.userData.role !== constants.roles.ADMIN) {
        return res.send(Boom.unauthorized('Only admins can create,update or delete products').output.payload);
    }
    return next();
};

// Get all Products
exports.getProducts = (req, res,next) => {
    let fields = 'name price description '
    if(req.userData.role === constants.roles.ADMIN) {
        fields += 'created_by'
    }
    productModel.find({},fields)
        .then(products => {
            return res.json({
                status: true,
                message: 'Products Fetched Successfully',
                products: products
            });
        }).catch(err => {
            console.log('error',err);
            return res.send(Boom.notImplemented('Get Product Failed').output.payload);
    });
};

// Validate product data
exports.validateProductData = (req, res,next) => {
    let params =  req.body;
    let name = params.name;
    let price = params.price;
    let description = params.description;
         
    if(name === '' || name === undefined){
        return res.send(Boom.notFound('Product Name Required').output.payload);
    } else if (price === '' || price === undefined){
        return res.send(Boom.notFound('Product Price Required').output.payload);
    } else if (isNaN(price)){
        return res.send(Boom.notFound('Product Price must be Number').output.payload);
    } else if (description === '' || description === undefined){
        return res.send(Boom.notFound('Product Description Required').output.payload);
    }
    return next();
};

// Create product
exports.createProduct = (req, res,next) => {
    let params = req.body;
                
    // Create a Product
    const product = new productModel({
        name: params.name,
        price: params.price,
        description: params.description,
        created_by: req.userData._id
    });
                
    // Save Product in the database
    product.save()
    .then(data => {
        return res.json({
            status: true,
            message: 'Product Created Successfully',
            product: data
        });
    }).catch(err => {
        console.log('error', err);
        return res.send(Boom.notImplemented('Create Product Failed').output.payload);
    });
};

// Validate product by Id
exports.validateProductId = (req,res,next) => {
    let params =  _.merge(req.body, req.query)
    let productId = params.id;
                
    if(productId === '' || productId === undefined){
        return res.send(Boom.notFound('Product Id Required').output.payload);
    }    
    return next();
};

// Get product by id
exports.getProductById = (req, res,next) => {
    let params =  _.merge(req.body, req.query)
    let productId = params.id;
    let fields = 'name price description '
    if(req.userData.role === constants.roles.ADMIN) {
        fields += 'created_by'
    }
    productModel.findOne({_id:productId}, fields)
        .then(product => {
            req.productData = product;
            return next();
        }).catch(err => {
            return res.send(Boom.notFound('Product Not Exists with this id').output.payload);
    });
};

// Validate product data
exports.validateUpdateProductData = (req, res,next) => {
    let params =  req.body;
    let name = params.name;
    let price = params.price;
    let description = params.description;
    let err;
     
    if(!name && !price && !description){
        return res.send(Boom.notFound('Add name, price or description to update').output.payload);
    } else if(name && (name === '' || name === undefined)){
        return res.send(Boom.notFound('Product Name Required').output.payload);
    } else if (price && (price === '' || price === undefined)){
        return res.send(Boom.notFound('Product Price Required').output.payload);
    } else if (description && (description === '' || description === undefined)){
        return res.send(Boom.notFound('Product Description Required').output.payload);
    }
    return next();
};

// Update product
exports.updateProduct = (req, res,next) => {
    let params = req.body;
    let productId = params.id;
    let name = params.name;
    let price = params.price;
    let description = params.description;
    let updateData = {}
    if(name) {
        updateData.name = name
    }
    if(price) {
        updateData.price = price
    }
    if(description) {
        updateData.description = description
    }
                
    if(_.isEmpty(req.productData)){
        return res.send(Boom.notFound('Product Not Exists with this id').output.payload);
    }
                
    // Update Product detail in the database
    productModel.updateOne({_id : productId}, updateData)
        .then(data => {
            res.json({OK : 'Product Updated Successfully'});
        }).catch(err => {
            return res.send(Boom.notImplemented('Update Product Failed').output.payload);
    });
};

// Delete product
exports.deleteProduct = (req, res,next) => {
    let productId = req.query.id;

    if(_.isEmpty(req.productData)){
        return res.send(Boom.notFound('Product Not Exists with this id').output.payload);
    }
                
    // Delete Product from the database
    productModel.deleteOne({_id : productId})
        .then(data => {
            res.json({OK : 'Product Deleted Successfully'});
        }).catch(err => {
            return res.send(Boom.notImplemented('Delete Product Failed').output.payload);
    });
};

// Show product by id
exports.showProduct = (req, res,next) => {
    if(_.isEmpty(req.productData)){
        return res.send(Boom.notFound('Product Not Exists with this id').output.payload);
    }
    return res.json({
        status: true,
        message: 'Product Fetched Successfully',
        product: req.productData
    });   
};