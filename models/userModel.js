var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username:{
		type:String,
		unique:true,
		required:true
	},
	password:String,
	email:{
		type:String,
		unique:true,
		required:true
	},
	colour:{
		type:String,
		unique:false,
		required:false
	},
	role:Number
},{
	timestamps:true
});

var userModel = mongoose.model('user',userSchema);
module.exports = userModel;
