var mongoose = require('mongoose');

exports.create = function(request, response){
	var Resource = mongoose.model('Room');
	console.log(request);
	var fields = request.body;

	var r = new Resource(fields);
	r.save(function(err, Resource){
		if(err){
			response.send(500, {error: err});
		}
		return(Resource);
	});
};

exports.retrieve = function(request, response){
	var Resource = mongoose.model('Room');

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
	var Resource = mongoose.model('Room');
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
	var Resource = mongoose.model('Room');

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

function roomLog(err){
	console.log("[Room route] - ", err);
}