var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var mapUser = require('./../helpers/mapUser');
var jwt = require('jsonwebtoken');

var UserModel = require('./../models/userModel');

//var mongodb = require('mongodb');
//var mongoClient = mongodb.MongoClient;

function createToken(user,config){
	var token = jwt.sign({
		id:user._id,
		username: user.username
	}, config.jwtSecret,{ expiresIn: '6h' });
	return token;
}

module.exports = function(config){

	/*
		Register  a user
		POST request
		url: localhost:4040/auth/register
		Headers:
			-Content-Type: application/x-www-form-urlencoded
		Req.body: [x-www-form-urlencoded]
			-username --> string
			-password --> string
			-email --> string
			-colour --> string
			-//role//- (optional) :1 ->> number
		Username,email,colour must all be unique in the database and cannot be empty
		Returns JSON data of registered user
	*/

	router.post('/register',function(req,res,next){
		req.assert('username','Username is required').notEmpty();
		req.assert('password','Password is required').notEmpty();
		req.assert('email','Email is required').notEmpty();
		// req.assert('colour','Color is required').notEmpty();
		var errors = req.validationErrors();
		var newUser = new UserModel();
		var mappedUser = mapUser(newUser,req.body);
		mappedUser.password = passwordHash.generate(req.body.password);
		mappedUser.save(function(err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        });
	});

	/*
		Login user
		POST request
		url: localhost:4040/auth/login
		Headers:
			-Content-Type: application/x-www-form-urlencoded
		Req.body: [x-www-form-urlencoded]
			-username
			-password
		Username and password should correspond to registered user in database
		Username and password cannot be empty
		Returns JSON data of user object and user token
	*/

	router.post('/login',function(req,res,next){
		req.assert('username','Username is required').notEmpty();
		req.assert('password','Password is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			return next({
				status:400,
				message:errors
			});
		}
		UserModel.findOne({
			username:req.body.username
		},function(err,user){
			if(err){
				return next(err);
			}
			if(user){
				var matched = passwordHash.verify(req.body.password,user.password);
				if(matched){
					var token = createToken(user,config);
					res.json({
						user:user,
						token:token
					});
				}else{
					next({
						status:401,
						message:"Invalid login credentials"
					});
				}
			}else{
				next({
					status:401,
					message:"Invalid login credentials"
				});
			}
		});
	});

	return router;
} 