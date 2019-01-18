module.exports = function(config){
	var mongoose = require("mongoose");
	mongoose.connect(config.dbUrl)

	mongoose.connection.once('open', function(){
		console.log('connected to database');
	});
	mongoose.connection.on('err', function(err){
		console.log('error connecting to ddatabase');
	})
}