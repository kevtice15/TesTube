var mongoose = require('mongoose');
 
var Video = new mongoose.Schema({
	youtube_id: String,
	name: String,
	votes: Number
});
/*
var Video = function(youtube_id, name, votes){
	this.youtube_id = youtube_id;
	this.name = name;
	this.votes = votes;
	this.setYoutubeId = function(id){
		this.youtube_id = id;
	};
	this.getYoutubeId = function(){
		return this.youtube_id;
	};
	this.setName = function(name){
		this.name = name;
	};
	this.getName = function(){
		return this.name;
	};
	this.setVotes = function(votes){
		this.votes = votes;
	};
	this.getVotes = function(){
		return this.votes;
	};
	this.addVote = function(){
		this.votes++;
	};
	this.subtractVote = function(){
		this.votes--;
	};
};
*/
var Playlist = new mongoose.Schema({
	videos: [Video],
	creator: mongoose.Schema.ObjectId,
	shared: Boolean,
	name: String,
	dj: mongoose.Schema.ObjectId
});

//Fills DJ and Creator fields in the playlist document after it is created
Playlist.methods.addCreatorandDJ = function(user){
	var Plist = mongoose.model("Playlist");
	var fields = {
		creator: user.id,
		dj: user.id
	};
	console.log(this._id);
	Plist.findByIdAndUpdate(this._id, {$set: fields}, function(err, resp){
		if(err){
			console.log(err);
		}
		else{
			console.log("Updated playlist", resp);
		}
	});
	console.log("Added creator and dj: ", user);
};

//Returns the playlists associated with a given user id, passes them back in a callback fn
Playlist.methods.getUserPlaylists = function(id, got){
	var Plist = mongoose.model("Playlist");
	Plist.find({creator: id}, {}, function(err, docs){
		if(err) console.log(err);
		else{
			console.log(docs);
			return got(docs);
		}
	});
};

Playlist.methods.addNewVideo = function(playlist_id, video_id, video_name, pushIt){
	var Plist = mongoose.model("Playlist");
	var Vid = mongoose.model("Video");
	var newVideo = new Vid({youtube_id: video_id, name: video_name, votes: 0});
	newVideo.save(function(err){
		if(err){
			console.log(err);
		}
	});
	console.log("Playlist ID: ", playlist_id);
	console.log("Video ID: ", video_id);
	console.log("Video Name: ", video_name);
	var query = Plist.findById(playlist_id, function(err, docs){
		if(err){
			console.log(err);
		}
		else{
			console.log("This is docs", docs);
			console.log("This is newVideo", newVideo);
			return pushIt(docs, newVideo);
		}
	});
};

module.exports = mongoose.model("Playlist", Playlist);
module.exports = mongoose.model("Video", Video);