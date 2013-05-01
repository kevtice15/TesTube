var mongoose = require('mongoose');
 
var Video = new mongoose.Schema({
	youtube_id: String,
	name: String,
	thumbnail: String,
	votes: Number
});

var Playlist = new mongoose.Schema({
	videos: [Video],
	creator: mongoose.Schema.ObjectId,
	shared: Boolean,
	name: String,
	dj: mongoose.Schema.ObjectId
});


Playlist.methods.addVideo = function(playlistId, yt_id, yt_name, yt_thumbnail, callback){
	var Playlist = mongoose.model('Playlist');
	var Video = mongoose.model('Video');
	var newVideo = new Video({youtube_id: yt_id, name: yt_name, thumbnail: yt_thumbnail, votes: 0});
	Playlist.findOne({_id: playlistId}, function(err, playlist){
		if(err){
			console.error(err);
		}
		else{
			playlist.videos.push(newVideo);
			playlist.save(function(err){
				if(err){
					return console.error(err);
				}
			});
			return callback(playlist);
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

Playlist.statics.deleteVideo = function(playlistId, videoId, callback){
	var Video = mongoose.model('Video');
	this.findById(playlistId, function(err, playlist){
		if(err){
			return console.error(err);
		}
		else{
			playlist.videos.pull(videoId);
			// Video.findById(videoId, function(err, video){
			// 	playlist.videos.pull(video);
			playlist.save(function(err){
				if(err){
			 		return console.error(err);
			 	}
			});
			// });
		}
	});

};

Playlist.statics.addVote = function(playlistId, videoId, callback){
	this.findById(playlistId, function(err, playlist){
		if(err){
			console.error(err);
		}
		else{
			for(var i = 0; i < playlist.videos.length; i++){
				if(playlist.videos[i]._id.equals(videoId)){
					playlist.videos[i].update({votes: votes + 1}, {multi: false}, function(err){
						if(err){
							return console.error(err);
						}
					});
					playlist.videos[i].save(function(err){
						if(err){
							return console.error(err);
						}
					});
				}
			}
		}
	});

};

Playlist.statics.subtractVote = function(playlistId, videoId,callback){
this.findById(playlistId, function(err, playlist){
		if(err){
			console.error(err);
		}
		else{
			for(var i = 0; i < playlist.videos.length; i++){
				if(playlist.videos[i]._id.equals(videoId)){
					playlist.videos[i].update({votes: votes - 1}, {multi: false}, function(err){
						if(err){
							return console.error(err);
						}
					});
					playlist.videos[i].save(function(err){
						if(err){
							return console.error(err);
						}
					});
				}
			}
		}
	});

};

Playlist.methods.getVideos = function(playlistId){

};

Playlist.methods.getUsers = function(){

}

/*
//Fills DJ and Creator fields in the playlist document after it is created
Playlist.methods.addCreatorandDJ = function(user){
	var Plist = mongoose.model("Playlist");
	var fields = {
		creator: user.id,
		dj: user.id
	};
	console.log(this._id);
	Plist.findByIdAndUpdate(this._id, {$set: fields}, function(err, callback){
		if(err){
			console.log(err);
		}
		else{
			console.log("Updated playlist", callback);
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

module.exports = mongoose.model("Video", Video);
module.exports = mongoose.model("Playlist", Playlist);