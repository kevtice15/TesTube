var mongoose = require('mongoose');

exports.create = function(request, response){
	var Resource = mongoose.model('UserSchema');
	console.log("THIS EVENT FIRES*******************************",request);
	var fields = request.body;

	var r = new Resource(fields);
	r.save(function(err, Resource){
		if(err){
			response.send(500, {error: err});
		}
		response.send(Resource);
	});
};

exports.retrieve = function(request, response){
	var Resource = mongoose.model('UserSchema');

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
	var Resource = mongoose.model('UserSchema');
	var fields = request.body;

	Resource.findByIdAndUpdate(request.data.body.id, {$set: fields}, function(err, Resource){
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
	var Resource = mongoose.model('UserSchema');
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

exports.retrievePlaylists = function(request, response){
	userLog("I get to the user controller");
	var User = mongoose.model("UserSchema");
	var getUser = new User();
	getUser.getPlaylists(request.user, function(docs){
		console.log("RESPONSE", docs);
		response.send({
			playlist: docs,
			success: (docs !== undefined)
		});
	});
};

exports.addPlaylist = function(request, response){
	var User = mongoose.model("UserSchema");
	var addPlaylistUser = new User();
	var reqData = request.body;
	console.log(reqData);
	console.log(request.user);
	addPlaylistUser.addPlaylist(request.user, reqData, function(data){
		response.send({
			success: true,
			data: data
		});
	});
};

function userLog(err){
	console.log("[User controller] - ", err);
}