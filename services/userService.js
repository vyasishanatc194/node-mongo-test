const express = require('express');
const Boom = require('boom');
const userModel = require('../models/userModel');
const constants = require('../Common/Constants');

// Validate Login Data
exports.validateLoginData = (req,res,next) => {
    let params =  req.body;
    let username = params.username;
    let password = params.password;
         
    if(username === '' || username === undefined){
        return res.send(Boom.notFound('Username Required').output.payload);
    } else if(password === '' || password === undefined){
        return res.send(Boom.notFound('Password Required').output.payload);
    }
    return next();
};

// Login User 
exports.login = (req, res,next) => {
    let params =  req.body;
    let username = params.username;
    let password = params.password;
    userModel.findOne({username: username})
        .then(user => {
            if(!user) {
                return res.send(Boom.notFound('User not exists').output.payload);
            } else if(user.password !== password) {
                return res.send(Boom.notFound('Invalid Username or Pasword').output.payload);
            }
            const token = constants.generateJWTToken(user);
            return res.json({
                status: true,
                message: 'User Loggedin Successfully',
                token: token,
                data: user
            });
        }).catch(err => {
            console.log('error',err);
            return res.send(Boom.notImplemented('Login Failed').output.payload);
    });
};

// Validate Register Data
exports.validateRegisterData = (req,res,next) => {
    let params =  req.body;
    let username = params.username;
    let password = params.password;
    let name = params.name;
    let lastname = params.lastname;
    let age = params.age;
    let role = params.role;
         
    if(name === '' || name === undefined){
        return res.send(Boom.notFound('Name Required').output.payload);
    } else if(lastname === '' || lastname === undefined){
        return res.send(Boom.notFound('Lastname Required').output.payload);
    } else if(username === '' || username === undefined){
        return res.send(Boom.notFound('Username Required').output.payload);
    } else if(password === '' || password === undefined){
        return res.send(Boom.notFound('Password Required').output.payload);
    } else if(age === undefined){
        return res.send(Boom.notFound('Age Required').output.payload);
    } else if (isNaN(age)){
        return res.send(Boom.notFound('Age must be Number').output.payload);
    } else if(role === '' || role === undefined){
        return res.send(Boom.notFound('Role Required').output.payload);
    } else if(role !== constants.roles.ADMIN && role !== constants.roles.CLIENT){
        return res.send(Boom.notFound('Invalid Role').output.payload);
    }
    return next();
};

// GET User By Username
exports.getUserByUsername = (req, res,next) => {
    let username = req.body.username;
    userModel.findOne({username: username})
        .then(user => {
            if(user) {
                return res.send(Boom.notFound('Username Taken').output.payload);
            }
            return next();
        }).catch(err => {
            console.log('error',err);
            return res.send(Boom.notImplemented('Get User Failed').output.payload);
    });
};

// Register User
exports.register = (req, res,next) => {
    let params = req.body;                
    // Create a User
    const user = new userModel({
        name: params.name,
        lastname: params.lastname,
        username: params.username,
        password: params.password,
        age: params.age,
        role: params.role,
    });
                
    // Save Product in the database
    user.save()
    .then(data => {
        return res.json({
            status: true,
            message: 'User Registration Completed',
            user: data
        });
    }).catch(err => {
        console.log('error', err);
        return res.send(Boom.notImplemented('User Registration Failed').output.payload);
    });
};

// Logout User
exports.logout = (req, res,next) => {
    let authHeader = req.header('Authorization');
    if(!authHeader) {
        return res.send(Boom.unauthorized('Token Required').output.payload);
    }
    let token = authHeader.split(' ')[1];
    if(token) {
        const verify = constants.verifyToken(token);
        if(!verify){
            return res.send(Boom.unauthorized('Token Invalid').output.payload);
        }
    }
    return res.send({
        status: true,
        message: 'Logout Successfully'
    });
};