var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = require('./userModel');

var feedbackSchema = new Schema({
	msg:String,
	username:{
		type:Schema.Types.ObjectId,
		ref:'userModel'
	}
},{
	timestamps:true
});

var feedbackModel = mongoose.model('quotes',quotesSchema);
module.exports = feedbackModel;
