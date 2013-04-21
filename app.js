
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

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8889/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      //console.log("Google Profile:", profile);

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      handleUser(profile._json);
      return done(null, profile._json);
    });
  }
));

app.http().io().set('log level', 1);


app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ store:sessionStore, secret:'secret', key:'express.sid'}));
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






app.get("/static/:filename", function(request, response){
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

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

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
  passport.authenticate('google', { failureRedirect: '/static/index.html' }),
  function(req, res) {
	console.log("auth google callback");
    res.redirect('/static/index.html');
    //res.send({success:true});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/static/index.html');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


// app.get('/videos', videos.findAll);
// app.get('/videos/:id', videos.findById);
// app.post('/videos', videos.addVideo);
// app.put('/videos/:id', videos.updateVideo);
// app.delete('/videos/:id', videos.deleteVideo);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

//Require our data models
var User = require('./models/user.js');
var Playlist = require('./models/playlist.js');
var Room = require('./models/room.js');

//Require controllers
var playlists = require('./controllers/playlists');
var rooms = require('./controllers/rooms');
var users = require('./controllers/users');

//Require our routes 
require("./routes/routes.js")(app);


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {

//Not doing anything here; you can use the restful api with cURL

});
	
function handleUser(profile){
	console.log("This will add a user to the db", profile);
	//If the user is in the db, return the user
	//var user = mongoose.model('user', UserSchema);
	var query = User.find({'google_id': profile.id}, function(err, docs){
		console.log(docs);
		if(docs !== undefined){
			return docs;
		}
		else{
			var newUser = new User({google_id: profile.id, name: profile.name});
			newUser.save(function(err){
				if(err)
					console.log(err);
			});
		}
	});
	/*
	if(query !== undefined){
		return existingUser;
	}
	//If not, create it in the db
	//Return the user
	else{
		users.create(profile.id, profile.name);
		existingUser = users.retrieve(profile.id);
		return existingUser;
	}
	*/
}


var server = app.listen(8889);
console.log('Express listening on port 8889');







/*===========================
		Socket Server
===========================*/
//var io = require('socket.io').listen(server);



// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];


app.io.sockets.on("connection", function(socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(){
		var nameandroom = {name: "roomname", room: "room"};
		// store the username in the socket session for this client
		// CREATE NEW USER IN DB
		


		//var newUser = socket.handshake.user;
		


		//console.log("*************HEY LOOKADAT USER***********", socket.handshake.user);
		



		//users.create({data: {body: {_id: newUser.id, name: newUser.given_name}}});
		socketEventLog("238 users:create");
		/*
		var newUser = mongoose.model("User");
		var newRoom = mongoose.model("Room");
		console.log("I GET HERE");
		socket.emit('users:create', {body:{name: nameandroom.name}});
		socketEventLog("users:create");
		console.log("I GET HERE 2");
		socket.username = nameandroom.name;
		*/
		socket.emit('rooms:create', {body:{name: nameandroom.room}});
		socketEventLog("249 rooms:create");
		
		//console.log("********Socket Log*********", socket);
		// store the room name in the socket session for this client
		// CREATE NEW ROOM IN DB
		// SET USERS ROOM TO THAT ROOM
		//////////////socket.emit('user:update', {body: {"id": , "room_id": }});
		socket.room = 'room1';
		// add the client's username to the global list
		usernames[nameandroom.name] = nameandroom.name;

		// SET USERS ROOM TO THAT ROOM
		// send client to room 1
		socket.join('room1');
		// echo to client they've connected
		socket.emit('updatechat', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('updatechat', nameandroom.name + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
		console.log("HEY HERES THE END OF THE ADD USER EVENT");
		
	});

	socket.on('addRoom', function(roomname){
		socket.emit('rooms:create', {body:{name: roomname}});
	});

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('updatechat', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});


	socket.on('videoAdded', function(data){
		socket.emit('status', {success: 'true'})
		app.io.sockets.emit('newVideo', { body: data.body });
	});

	socket.on('next', function(video){
		socket.emit('status', {success: 'true'})
		socket.broadcast.to('room1').emit('updateVideo', video);
	});

});

function socketEventLog(log){
	console.log("[Socket emit] - ", log);
}