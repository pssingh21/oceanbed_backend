var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = require('./userModel');

var quotesSchema = new Schema({
	AllQuotes:{
		type:String,
	},
	likes:Number,
	report:Boolean,
	username:{
		type:Schema.Types.ObjectId,
		ref:'userModel'
	}
},{
	timestamps:true
});

var quotesModel = mongoose.model('quotes',quotesSchema);
module.exports = quotesModel;
