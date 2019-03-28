//show all
//add
//show my quotes
//delete	
//likes
//report

var express = require('express');
var router = express.Router();
//var mongodb = require('mongodb');
//var mongoClient = mongodb.MongoClient;
//var oid = mongodb.ObjectId;
var QuotesModel = require('./../models/quotesModel');
var jwt = require('jsonwebtoken');

module.exports = function() {

    /*
    	Fetch all quotes; from all users
    	GET request
    	url: localhost:4040/dashboard
    	Headers:
    		-Content-Type: application/x-www-form-urlencoded
    		-authorization: {{user token here}}
    	Returns all quotes in JSON format
    */

    router.get('/', function(req, res, next) {
        QuotesModel.find({}).sort({
            createdAt: -1
        }).exec(function(err, quotes) {
            if (err) {
                return next(err);
            }
            res.json(quotes);
        });
    });


    /*
    	Fetch quotes posted by logged in user
    	GET request
    	url: localhost:4040/dashboard/myProfile
    	Headers:
    		-Content-Type: application/x-www-form-urlencoded
    		-authorization: {{user token here}}
    	Returns quotes posted by this user in JSON format
    */

    //my profile quotes
    router.get('/myProfile', function(req, res, next) {
        var decoded = jwt.decode(req.headers.authorization, {
            complete: true
        });
        QuotesModel.find({
            username: decoded.payload.id
        }).sort({
            createdAt: -1
        }).exec(function(err, quotes) {
            if (err) {
                return next(err);
            }
            res.json(quotes);
        });
    });


    /*
    	Post new quote
    	POST request
    	url: localhost:4040/dashboard/addQuote
    	Headers:
    		-Content-Type: application/x-www-form-urlencoded
    		-authorization: {{user token here}}
    	Req.body: [x-www-form-urlencoded]
    		-newQuote: {{Quote to post}} --> String
    	Returns new added quote as JSON object
    */

    //add new quote
    router.post('/addQuote', function(req, res, next) {
        req.assert('newQuote', 'Quote cannot be blank').notEmpty();
        var errrors = req.validationErrors();
        var thisQuote = new QuotesModel();
        thisQuote.AllQuotes = req.body.newQuote;
        thisQuote.likes = 0;
        thisQuote.report = false;
        var decoded = jwt.decode(req.headers.authorization, {
            complete: true
        });
        thisQuote.username = decoded.payload.id;
        thisQuote.save(function(err, quote) {
            if (err) {
                return next(err);
            }
            res.json(quote);
        });
    });


    /*
    	Delete quote added by logged in user
    	DELETE request
    	url: localhost:4040/dashboard/deleteQuote/{{object id of post}}
    		eg. --> localhost:4040/dashboard/deleteQuote/5c4dc8f8ff3b9a09e8cb0111
    	Headers:
    		-Content-Type: application/x-www-form-urlencoded
    		-authorization: {{user token here}}
    	Returns JSON object of deleted post or denies request if user is not authorized
    */

    //delete quote
    router.delete('/deleteQuote/:id', function(req, res, next) {
        var decoded = jwt.decode(req.headers.authorization, {
            complete: true
        });
        var thisQuoteId = req.params.id;
        QuotesModel.findById(thisQuoteId, function(err, quotes) {
            if (err) {
                return next(err);
            }
            if (decoded.payload.id == quotes.username) {
                QuotesModel.findByIdAndRemove(thisQuoteId, function(err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json({
                        status: 200,
                        message: "Post deleted"
                    });
                });
            } else {
                res.json({
                    status: 403,
                    message: "Request denied"
                });
            }
        });

    });


    /*
    	Add number of specified likes
    	PUT request
    	url: localhost:4040/dashboard/like/{{object id of post}}
    		eg. --> localhost:4040/dashboard/like/5c4dc8f8ff3b9a09e8cb0111?likeNumber=49
    	Headers:
    		-Content-Type: application/x-www-form-urlencoded
    		-authorization: {{user token here}}
    	Req.body:
    		-likeNumber: {{number of new likes}} --> Number
    	Returns updated JSON object with desired number of likes
    */

    //add likes
    router.put('/like/:id', function(req, res, next) {
        var thisQuoteId = req.params.id;
        var newLikes = req.body.likeNumber;
        QuotesModel.findByIdAndUpdate(thisQuoteId, {
            $set: {
                likes: newLikes
            }
        }, {
            new: true
        }, function(err, quotes) {
            if (err) {
                return next(err);
            }
            res.json(quotes);
        });
    });


    /*
    	Set report to true
    	PUT request
    	url: localhost:4040/dashboard/report/{{object id of post}}
    		eg. --> localhost:4040/dashboard/report/5c4dc8f8ff3b9a09e8cb0111
    	Headers:
    		-Content-Type: application/x-www-form-urlencoded
    		-authorization: {{user token here}}
    	Returns updated JSON object with report set to true
    */

    //report post
    router.put('/report/:id', function(req, res, next) {
        var thisQuoteId = req.params.id;
        QuotesModel.findByIdAndUpdate(thisQuoteId, {
            $set: {
                report: true
            }
        }, {
            new: true
        }, function(err, quotes) {
            if (err) {
                return next(err);
            }
            res.json(quotes);
        });
    });

    router.post('/feedback', function(req, res, next) {
        req.assert('msg', 'Feedback cannot be blank').notEmpty();
        var thisFeedback = new QuotesModel();
        thisFeedback.msg = req.body.msg;
        var decoded = jwt.decode(req.headers.authorization, {
            complete: true
        });
        thisFeedback.username = decoded.payload.id;
        thisFeedback.save(function(err, feedback) {
            if (err) {
                return next(err);
            }
            res.json(feedback);
        });
    });

    return router;
}