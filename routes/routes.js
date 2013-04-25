//Require controllers
var playlists = require('../controllers/playlists');
var rooms = require('../controllers/rooms');
var users = require('../controllers/users');
var videos = require('../controllers/videos');

module.exports = function(app){

	//Static route
	// app.get("/static/:filename", function(request, response){
	// 	response.sendfile("static/" + request.params.filename);
	// });

	//User routes
	
	/*
	app.io.route('/users:create', function(request){
		console.log("****************************");
		users.create(request);
	});
	*/
app.io.route('users', {
    create: function(req) {
			console.log("THE ROUTE GETS CALLED ");
      users.create(req);
      //return res;
    },
    retrieve: function(req, res){
      users.retrieve(req, res);
      return res;
    },
    update: function(req, res) {
      users.update(req, res);
      return res;
    },
    remove: function(req, res) {
      users.del(req, res);
      return res;
    }
});

app.io.route('rooms', {
    create: function(req, res) {
    	console.log("THE ROUTE GETS CALLED ROOM");
      rooms.create(req);
      return res;
    },
    retrieve: function(req, res){
      rooms.retrieve(req);
      return res;
    },
    update: function(req, res) {
      rooms.update(req);
      return res;
    },
    remove: function(req, res) {
      rooms.del(req);
      return res;
    }
});

	app.post('/users', function(request, response){
		users.create(request, response);
	});

	app.get('/users', function(request, response){
		users.retrieve(request, response);
	});

	app.get('/users/:id', function(request, response){
		users.retrieve(request, response);
	});

	app.put('/users/:id', function(request, response){
		users.update(request, response);
	});

	app.del('/users/:id', function(request, response){
		users.del(request, response);
	});


	//Room routes
	app.post('/rooms', function(request, response){
		rooms.create(request, response);
	});

	app.get('/rooms', function(request, response){
		rooms.retrieve(request, response);
	});

	app.get('/rooms/:id', function(request, response){
		rooms.retrieve(request, response);
	});

	app.put('/rooms/:id', function(request, response){
		rooms.update(request, response);
	});

	app.del('/rooms/:id', function(request, response){
		rooms.del(request, response);
	});

	//Playlist routes
	app.post('/playlists', function(request, response){
		playlists.create(request, response);
	});

	app.get('/playlists', function(request, response){
		playlists.retrieve(request, response);
	});

	app.get('/playlists/:id', function(request, response){
		playlists.retrieve(request, response);
	});

	app.put('/playlists/:id', function(request, response){
		playlists.update(request, response);
	});

	app.del('/playlists/:id', function(request, response){
		playlists.del(request, response);
	});

	//Video routes
	app.post('/videos', function(request, response){
		videos.create(request, response);
	});

	app.get('/videos', function(request, response){
		videos.retrieve(request, response);
	});

	app.get('/videos/:id', function(request, response){
		videos.retrieve(request, response);
	});

	app.put('/videos/:id', function(request, response){
		videos.update(request, response);
	});

	app.del('/videos/:id', function(request, response){
		videos.del(request, response);
	});


	//My Routes
	app.post('/users/:id/new/playlist', function(request, response){
		users.addPlaylist(request, response);
	});
	app.get('/users/:id/playlists', function(request, response){
		users.retrievePlaylists(request, response);
	});

	app.post('/playlists/new/video/:id', function(request, response){
		playlists.addVideo(request, response);
	});
};

function routesLog(type, log){
	console.log("[Routes]-[", type, "] - ", log);
}

