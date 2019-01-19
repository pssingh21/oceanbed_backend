//show all
//add
//show my quotes
//delete	
//likes
//report

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var oid = mongodb.ObjectId;
var QuotesModel = require('./../models/quotesModel');
var jwt = require('jsonwebtoken');

module.exports = function(config){

	//fetch all quotes
	router.get('/',function(req,res,next){
		QuotesModel.find({},function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		});
	});

	//my profile quotes
	router.get('/myProfile',function(req,res,next){
		var decoded = jwt.decode(req.headers.authorization,{
			complete:true
		});
		QuotesModel.find({
			username:decoded.payload.id
		},function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		});
	});

	//add new quote
	router.post('/addQuote',function(req,res,next){
		req.assert('newQuote','Quote cannot be blank').notEmpty();
		var errrors = req.validationErrors();
		var thisQuote = new QuotesModel();

	})

	return router;
}