var mongoose = require('mongoose');

var UserPlaylist = new mongoose.Schema({
	user_id: mongoose.Schema.ObjectId,
	playlist_id: mongoose.Schema.ObjectId
});

UserPlaylist.methods.getPlaylists = function(){

};

UserPlaylist.methods.getUsers = function(){

};


module.exports = mongoose.model("UserPlaylist", UserPlaylist);