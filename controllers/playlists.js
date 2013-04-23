var mongoose = require('mongoose');

exports.create = function(request, response){
	var Resource = mongoose.model('Playlist');
	var fields = request.body;
	console.log("CREATE PLAYLIST REQUEST", request.user);
	var r = new Resource(fields);
	r.save(function(err, Resource){
		if(err){
			response.send(500, {error: err});
		}

		r.addCreatorandDJ(request.user);
		response.send(Resource);
	});
};

exports.retrieve = function(request, response){
	var Resource = mongoose.model('Playlist');

	if(request.params.id !== undefined){
		Resource.findById(request.params.id, function(err, Resource){
			if(err){
				response.send(500, {error: err});
			}
			else if(Resource){
				response.send(Resource);
			}
			else{
				response.send(404);
			}
		});
	}
	else{
		Resource.find({}, function(err, coll){
			response.send(coll);
		});
	}
};

exports.update = function(request, response){
	var Resource = mongoose.model('Playlist');
	var fields = request.body;

	Resource.findByIdAndUpdate(request.params.id, {$set: fields}, function(err, Resource){
		if(err){
			response.send(500, {error: err});
		}
		else if(Resource){
			response.send(Resource);
		}
		else{
			response.send(404);
		}
	});
};

exports.del = function(request, response){
	var Resource = mongoose.model('Playlist');

	Resource.findByIdAndRemove(request.params.id, function(err, Resource){
		if(err){
			response.send(500, {error: err});
		}
		else if(Resource){
			response.send(200);
		}
		else{
			response.send(404);
		}
	});
};

exports.addVideo = function(request, response){
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
};

function playlistLog(err){
	console.log("[playlist route] - ", err);
}