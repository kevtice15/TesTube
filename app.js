/*===========================
		Express Server
===========================*/

var express = require('express.io'),
	// videos = require('./videos/videos.js');
	app = express(),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	MemoryStore = express.session.MemoryStore,
	sessionStore = new MemoryStore();

var GOOGLE_CLIENT_ID = "846887029586.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "PzU_-cecGvD5VMhkiOTDIvvX";


app.http().io().set('log level', 1);


app.configure(function() {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({secret:'secret'}));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  /*
  app.use(express.static(__dirname + '/public'));
  app.io.set("authorization", passportSocketIo.authorize({
    key:    'express.sid',       //the cookie where express (or connect) stores its session id.
    secret: 'secret', //the session secret to parse the cookie
    store:   sessionStore,     //the session store that express uses
    fail: function(data, accept) {
        // console.log("failed");
        // console.log(data);// *optional* callbacks on success or fail
        accept(null, false);             // second param takes boolean on whether or not to allow handshake
    },
    success: function(data, accept) {
      //  console.log("success socket.io auth");
     //   console.log(data);
        accept(null, true);
    }
	}));
	*/
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://nodejitsu_kevtice15:ua790p8e99iuklq5j4k8ruh25t@ds059917.mongolab.com:59917/nodejitsu_kevtice15_nodejitsudb5039405615');

var db = mongoose.connection;

//Require our data models
var User = require('./models/user.js');
var Playlist = require('./models/playlist.js');
var Room = require('./models/room.js');

//Require our routes 
require("./routes/routes.js")(app);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
//console.log("Serialize", user);
  done(null, user.id);
});


///////DONT CALL THIS AGAIN DOWN THERE
passport.deserializeUser(function(id, done){
	//var userId = new mongoose.Types.ObjectID(id);
	//User.findOne({'google_id': id}, function(err, user){
	//	if(err){
	//		console.log(err);
	//	}
	//	else{
		// console.log("DESERIALIZER !!!!!!!!!!!!!!!!!!!!!!!!!!!!");

			done(null, id);
	//	}
	//});
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://letuce.kevonticer.com:8889/auth/google/callback"
    // callbackURL: "http://letuce.nodejitsu.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      //console.log("Google Profile:", profile);

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      User.findOne({'google_id': profile.id}, function(err, docs){
		console.log(docs);
		if(docs !== null){
			//Start a session
			return done(null, docs);
		}
		else{
			var newUser = new User({google_id: profile.id, name: profile.name});
			newUser.save(function(err){
				if(err)
					console.log(err);
					done(null, false);
			});
			return done(null, newUser);
		}
	});
      //return done(null, profile._json);
    });
  }
));

app.get("/static/:filename", ensureAuthenticated, function(request, response){
	response.sendfile("static/" + request.params.filename);
});

app.get("/static/js/:filename", function(request, response){
	response.sendfile("static/js/" + request.params.filename);
});

app.get("/static/lib/:filename", function(request, response){
	response.sendfile("static/lib/" + request.params.filename);
});

app.get("/static/css/:filename", function(request, response){
	response.sendfile("static/css/" + request.params.filename);
});
app.get("/static/img/:filename", function(request, response){
	response.sendfile("static/img/" + request.params.filename);
});

app.get("/", ensureAuthenticated, function(request, response){
	response.sendfile("static/index.html");
});

// app.get('/static/index.html', ensureAuthenticated, function(req, res){
// 	res.sendfile('static/index.html');
// })

app.get('/login', function(req, res){
  res.sendfile('static/login.html');
});



// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
});

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/static/login.html' }),
  function(req, res) {
	console.log("auth google callback");
    res.redirect('/static/index.html');
    //res.send({success:true});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/static/login.html');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	console.log("ensureAuthenticated");
  if (req.isAuthenticated()) { console.log("is logged in:" + req); return next(); }
  res.redirect('login');
}


// app.get('/videos', videos.findAll);
// app.get('/videos/:id', videos.findById);
// app.post('/videos', videos.addVideo);
// app.put('/videos/:id', videos.updateVideo);
// app.delete('/videos/:id', videos.deleteVideo);




db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {

//Not doing anything here; you can use the restful api with cURL

});




app.listen(8889);
console.log('Express listening on port 8889');







/*===========================
		Socket Server
===========================*/
//var io = require('socket.io').listen(server);



// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var roomArray = ['room1','room2','room3'];
var roomState = {
	'playlist': []
};


app.io.sockets.on("connection", function(socket) {
	console.log('SERVER CONNECTION!@@@@@@@@@@@@@@@@@@@@@@@@@@');

	//console.log(socket);

	socket.on('addRoom', function(roomname){
		console.log("Add room start");
		var user = socket.handshake.session.passport.user;
		//create new room in db

		var newPlaylist = new Playlist({
			creator: user,
			shared: true,
			name: roomname,
			dj: user
		});
		newPlaylist.save(function(err, newPlaylist){
			if(err){
				console.error(err);
			}
			else{
				console.log("New playlist on add", newPlaylist);
			}
		});

		var newRoom = new Room({
			'name': roomname,
			'DJ': user,
			'playlist': newPlaylist._id
		});
		newRoom.save(function(err, newRoom){
			if(err){
				console.error(err);
			}
			else{
				console.log("New room on add", newRoom);
			}
		});

		// console.log("new room id", newRoom._id);
		// newRoom.addPlaylist(newRoom._id, newPlaylist._id, function(room){
		// 	console.log("Added playlist to room:", room);
		// })

		//socket.handshake.session.passport.room = newRoom._id;
		console.log(socket.handshake.session.passport);

		//socket.emit('rooms:create', {body:{name: roomname}});
		//rooms.create({name: roomname});
		//socket.emit('roomDoneCreated');
		console.log("Add room end");
		socket.emit('write-room-id', {room_id: newRoom._id});
	});

	socket.on('joinRoom', function(room){
		// store the room name in the socket session for this client
		console.log("HOW BOUT THIS SWEET JOIN ROOM ENTRY");
		socket.room = room.room_name;
		var roomname = room.room_name;
		var room_Id = room.room_id;
		var user = socket.handshake.session.passport.user;
		//var room = socket.handshake.session.passport.room;
		console.log(socket.handshake.session.passport);
		var Room = mongoose.model('Room');
		var Playlist = mongoose.model('Playlist');
		var User = mongoose.model('UserSchema');

		Room.findById(room_Id, function(err, room){
			console.log("I get here 1");
			//if the room exists
			if(room !== null){
				console.log("Room exists!");
				//Add user
				User.joinRoom(user, room._id, function(upUser){
					console.log(upUser);
				});
				/*
				//Create playlist
				var playlist = new Playlist({
					creator: user,
					shared: true,
					name: roomname,
					dj: user
				});
				playlist.save(function(err){
					if(err){
						console.error(err);
					}
				});
				//Add playlist
				room.addPlaylist(room._id, playlist._id, function(room){
					console.log("added playlist to room", room);
				});
				*/
			}
			//if it doesn't exist
			else{
				console.log("Room doesn't exist!");
				//create it with a new playlist
				var playlist = new Playlist({
					creator: user,
					shared: true,
					name: roomname,
					dj: user
				});
				playlist.save(function(err){
					if(err){
						console.error(err);
					}
				});

				var newRoom = new Room({
					name: roomname,
					DJ: user,
					playlist: playlist._id
				});

				newRoom.save(function(err){
					if(err){
						console.error(err);
					}
				});

				console.log("newRoom id: ", newRoom._id);
				console.log("playlist id: ", playlist._id);

				newRoom.addPlaylist(newRoom._id, playlist._id,function(room){
					console.log("Room with playlist: ", room);
				});
				// add the user to it
				User.joinRoom(user, newRoom._id, function(upUser){
					console.log(upUser);
				});
			}
		});
		console.log("I get here 2");
		// join room
		socket.join(roomname);
		//var newRoom = rooms.create({'body':{'name': roomname, 'DJ': user}});
		//console.log('newRoom', newRoom);
		//user.update({'data': {'room_id'}, })
		console.log("you joined: ", roomname);
		// echo to client they've connected
		socket.emit('updatechat', 'you have connected to', roomname);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(roomname).emit('updatechat',  ' has connected to this room');

		console.log("I get here 3");
		console.log("Get room playlist: ", room.room_id);
		Room.getPlaylist(room.room_id, function(playlist){
			console.log("The Playlist: " + playlist);
			User.isDJ(user, room.room_id, function(amDJ){
				socket.emit('populateRoom', playlist, amDJ);
				if(!amDJ){
					socket.emit('notDJ');
				}
				console.log("pop u late room emitted");
			});
		});
	});


	socket.on('disconnect', function(data){
		var User = mongoose.model('UserSchema');
		var user = socket.handshake.session.passport.user;
		console.log("User at disconnect", user);
		//Attach user to room they just joined

		User.leaveRoom(user, function(foundUser){
			console.log("Removed user from room: ", foundUser);
		});


		//TODO Delete room from db if no one is in the room;

		var oldroom = socket.room;
		socket.leave(socket.room);
		console.log('user left room');
		app.io.sockets.in(oldroom).emit('updatechat', ' has left this room');
		// app.io.sockets.emit('updaterooms', rooms);
	});

	socket.on('videoAdded', function(data){
		console.log('videoAddedData', data);
		var user = socket.handshake.session.passport.user;
		var User = mongoose.model('UserSchema');
		var Room = mongoose.model('Room');
		var Playlist = mongoose.model('Playlist');
		var Video = mongoose.model('Video');
		User.findById(user, function(err, foundUser){
			if(err){
				console.error(err);
			}
			else{
				Room.getPlaylist(foundUser.room_id, function(playlist){
					Playlist.findById(playlist, function(err, foundPlaylist){
						foundPlaylist.addVideo(playlist, data.body.id, data.body.title, data.body.thumbnail, function(plist){
							console.log("Added to room playlist", plist);
						});
					});
				});
			}
		});

		socket.emit('status', {success: 'true'});
		app.io.sockets.in(socket.room).emit('newVideo', { body: data.body });
		roomState.playlist.push(data.body.id);
		console.log("Current playlist on server: " + roomState.playlist);
		console.log(data.body);
		console.log("socket.room: " + socket.room);
		console.log("socket.roomname: " + socket.roomname);
	});

	socket.on('updateVideo', function(video){
		socket.emit('status', {success: 'true'});
		// socket.broadcast.to('room1').emit('updateVideo', video);
		app.io.sockets.in(socket.roomname).emit('updateVideo', video);
	});

	socket.on('playPause', function(data){
		console.log("Play pause data: ", data);
		console.log("server received playpause: " +  data.state + " at " + data.time);
		// socket.broadcast.to('room1').emit('update', data);
		var user = socket.handshake.session.passport.user;
		var Room = mongoose.model('Room');
		var User = mongoose.model('UserSchema');
		var cState = {currentVideoTime: data.time, currentVideoState: data.state};
		User.findById(user, function(err, foundUser){
			Room.changeState(foundUser.room_id, cState, function(room){
				console.log("Room State Update:", room);
			});
		});

		app.io.sockets.in(socket.roomname).emit('update', {state: data.state, time: data.time});
	});

	// socket.on('playPause', function(data){
	// 	console.log("server received playpause: " +  data);
	// 	// socket.broadcast.to('room1').emit('update', data);
	// 	io.sockets.in('room1').emit('update', data);
	// });

	socket.on('stop', function(){
		console.log("server received stop");
		app.io.sockets.in(socket.roomname).emit('stopVideo')
	});

	socket.on('dj-request', function(){
		var user = socket.handshake.session.passport.user;
		var User = mongoose.model('UserSchema');
		var Rooom = mongoose.model('Room');

		User.findById(user, function(err, foundUser){
			if(err){
				console.error(err);
			}
			else{
				User.isDJ(user, foundUser.room_id, function(isDJ){
					if(!isDJ){
						console.log("The user is not the dj");
						Room.changeDJ(foundUser.room_id, foundUser._id, function(room){
							console.log("New room dj: ", room);
							socket.emit("giveDJControls");
						});
					}
					else{
						console.log("The user is the dj");
						socket.emit("giveDJControls");

					}
				});
			}
		});
	});

});

function socketEventLog(log){
	console.log("[Socket emit] - ", log);
}