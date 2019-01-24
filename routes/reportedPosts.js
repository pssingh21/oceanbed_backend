var express = require('express');
var router = express.Router();
var QuotesModel = require('./../models/quotesModel');

module.exports=function(){

	//show all reported quotes
	router.get('/',function(req,res,next){
		QuotesModel.find({report:true},function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		})
	});

	//delete particular quote
	router.delete('/delete/:id',function(req,res,next){
		QuotesModel.findByIdAndRemove(req.params.id,function(err,quotes){
			if(err){
				return next(err);
			}
			res.json(quotes);
		});
	});

	return router;
}