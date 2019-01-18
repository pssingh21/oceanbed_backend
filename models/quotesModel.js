var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	AllQuotes:[{
		type:String,
	}],
	username:{
		type:Schema.Types.ObjectId,
		ref:'userModel'
	}
},{
	timestamps:true
});

var quotesModel = mongoose.model('user',userSchema);
module.exports = quotesModel;
