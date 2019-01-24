var express = require('express');
var router = express.Router();
var QuotesModel = require('./../models/quotesModel');

module.exports=function(){

	router.get('/',function(req,res,next){
		QuotesModel.find({report:true},function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		})
	});

	return router;
}