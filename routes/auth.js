var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var mapUser = require('./../helpers/mapUser');
var jwt = require('jsonwebtoken');

var UserModel = require('./../models/userModel');

var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

function createToken(user,config){
	var token = jwt.sign({
		id:user._id,
		username: user.username
	}, config.jwtSecret);
	return token;
}

module.exports = function(config){


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

	router.post('/register',function(req,res,next){
		req.assert('username','Username is required').notEmpty();
		req.assert('password','Password is required').notEmpty();
		req.assert('email','Email is required').notEmpty();
		req.assert('colour','Color is required').notEmpty();
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
	return router;
} 