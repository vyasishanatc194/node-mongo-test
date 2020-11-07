const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
      
// Login User
router.post('/login', [
    userService.validateLoginData,
    userService.login
]);

// Register User
router.post('/register', [
    userService.validateRegisterData,
    userService.getUserByUsername,
    userService.register
]);

// Logout User
router.post('/logout', [
    userService.logout
]);

module.exports = router;