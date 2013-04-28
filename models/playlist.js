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
/*
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
*/
//Returns the playlists associated with a given user id, passes them back in a callback fn
/*
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
*/

Playlist.methods.addVideo = function(playlistId, yt_id, yt_name, resp){
	var Playlist = mongoose.model('Playlist');
	var Video = mongoose.model('Video');
	var newVideo = new Video({youtube_id: yt_id, name: yt_name, votes: 0});
	Playlist.findOne({_id: playlistId}, function(err, playlist){
		if(err){
			console.error(err);
		}
		else{
			Playlist.videos.push(newVideo);
			Playlist.save(function(err){
				if(err){
					console.error(err);
				}
			});
			resp(Playlist);
		}
	});
	/*
	var Resource = mongoose.model('Playlist');
	var Vid = mongoose.model('Video');
	var playlist_id = request.params.id;
	console.log("Playlists playlist id", playlist_id);
	var fields = request.body;
	var newVideo = new Vid({youtube_id: fields.body.video_id, name: fields.body.video_name, votes: 0});
	console.log("fields", fields);
	Resource.findById(playlist_id, function(err, Resource){
		if(err){
			console.log(err);
		}
		else{
			console.log("This is RESOURCE:", Resource);
			Resource.videos.push(newVideo);
			Resource.save(function(err){
				if(err){
					console.log(err);
				}
			});
			response.send(Resource);
		}
	});
	 */
};

Playlist.methods.deleteVideo = function(playlistId, yt_id){
	var Playlist = mongoose.model('Playlist');
	var Video = mongoose.model('Video');
	var newVideo = new Video({youtube_id: yt_id, name: yt_name, votes: 0});
	Playlist.findOne({_id: playlistId}, function(err, playlist){
		if(err){
			console.error(err);
		}
		else{
			//TODO: find the video and pull it
		}
	});

};

Playlist.methods.getVideos = function(playlistId){

};

Playlist.methods.getUsers = function(){

}


module.exports = mongoose.model("Playlist", Playlist);
module.exports = mongoose.model("Video", Video);