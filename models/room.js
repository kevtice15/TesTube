var mongoose = require('mongoose');

var Room = new mongoose.Schema({
	name: String,
	DJ: mongoose.Schema.ObjectId,
	playlist: mongoose.Schema.ObjectId,
	state:{
		currentVideoTime: Number,
		currentVideoId: String,
		currentVideoPlaylistIndex: Number
	}
});

Room.methods.getDJ = function(){

};

Room.methods.getPlaylist = function(){

};

Room.methods.updateState = function(){

};

Room.methods.getState = function(){

}

module.exports = mongoose.model("Room", Room);
