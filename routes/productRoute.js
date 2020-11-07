const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
             
// Get products
router.get('/',[
    productService.verifyJWTToken,
    productService.getProducts
]);

// Create products
router.post('/',[
    productService.verifyJWTToken,
    productService.checkUserRole,
    productService.validateProductData,
    productService.createProduct    
]);

// Update products
router.put('/',[
    productService.verifyJWTToken,
    productService.checkUserRole,
    productService.validateProductId,
    productService.validateUpdateProductData,
    productService.getProductById,
    productService.updateProduct      
]);

// Delete products
router.delete('/',[
    productService.verifyJWTToken,
    productService.checkUserRole,
    productService.validateProductId,
    productService.getProductById,
    productService.deleteProduct  
]);

// Get specific product by id
router.get('/id',[
    productService.verifyJWTToken,
    productService.validateProductId,
    productService.getProductById,
    productService.showProduct 
]);

module.exports = router;