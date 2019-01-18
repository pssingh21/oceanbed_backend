var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var UserModel = require('./../models/userModel');

module.exports = function(req,res,next){
	var token;
	if(req.headers['x-access-token']){
		token = req.headers['x-access-token'];
	}
	if(req.headers['authorization']){
		token = req.headers['authorization'];
	}
	if(req.query.token){
		token = req.query.token;
	}

	if(token){
		var verified = jwt.verify(token,config.jwtSecret,function(err,decoded){
			if(err){
				return next(err);
			}
			if(decoded){
				UserModel.findById(decoded.id,function(err,user){
					if(err){
						return next(err);
					}
					if(user){	
						req.user = user
						return next();
					}else{
						return next({
							status:204,
							messsage:'User not found'
						})
					}
				})
			}else{
				return next({
					status:403,
					message:'Jwt validation failed'
				});
			}
		});
	}else{
		return next({
			status:403,
			message:"Token not provided"
		});
	}
}