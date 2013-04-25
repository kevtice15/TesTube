var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	google_id: String,
	name: String,
	room_id: mongoose.Schema.ObjectId
}, {autoIndex: false});

module.exports = mongoose.model("UserSchema", UserSchema);

/*
User.ensureIndexes(function(err){
	if(err){
		return handleError(err);
	}
});

User.on('index', function(err){
	if(err){
		console.log(err);
	}
});
*/

UserSchema.methods.isDJ = function(userId){
	var user = mongoose.model("UserSchema");
};