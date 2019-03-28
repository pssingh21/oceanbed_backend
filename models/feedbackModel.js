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

var feedbackModel = mongoose.model('feedback',feedbackSchema);
module.exports = feedbackModel;
