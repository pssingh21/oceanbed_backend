var express = require('express');
var router = express.Router();
var QuotesModel = require('./../models/quotesModel');

module.exports=function(){

	/*
		Show list of all reported quotes
		GET request
		url: localhost:4040/reported
		Headers:
			-Content-Type: application/x-www-form-urlencoded
			-authorization: {{user token here}}
		Returns array of JSON obejcts of all reported quotes
	*/

	//show all reported quotes
	router.get('/',function(req,res,next){
		QuotesModel.find({report:true},function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		})
	});


	/*
		Delete particular quote from repoted list
		DELETE request
		url: localhost:4040/reported/delete/{{object id of reported post}}
			eg. --> localhost:4040/reported/delete/5c4dc8f8ff3b9a09e8cb0111
		Headers:
			-Content-Type: application/x-www-form-urlencoded
			-authorization: {{user token here}}
		Returns JSON object of deleted quote
	*/
	//delete particular quote
	router.delete('/delete/:id',function(req,res,next){
		QuotesModel.findByIdAndRemove(req.params.id,function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		});
	});


	/*
		Unreport reported post
		PUT request
		url: localhost:4040/reported/unreport/{{object id of reported post}}
			eg: --> localhost:4040/reported/unreport/5c4dc8f8ff3b9a09e8cb0111
		Headers:
			-Content-Type: application/x-www-form-urlencoded
			-authorization: {{user token here}}
		Returns JSON object of unreported post 
	*/
	//unreport post
	router.put('/unreport/:id',function(req,res,next){
		QuotesModel.findByIdAndUpdate(req.params.id,{$set: { report: false }},{new: true},function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		})
	});

	return router;
}