var Firebase = require('firebase');
var crypto = require('crypto');

var fb = new Firebase('https://post-pcoleman.firebaseio.com/');
var users = fb.child('users');

function hash(password){
	return crypto.createHash('sha512').update(password).digest('hex');
}

var router = require('express').Router();

router.use( require('body-parser').json() );
router.use( require('cookie-parser')() );
router.use( require('express-session')({
	resave: false,
	saveUninitialized: true,
	secret: '@pplep13izTHEB3$T07030HAHA'
}) );

/**
 * SIGNUP ROUTE
 */
router.post('/api/signup', function(req, res) {
	var badSignedInReason = [
		'Missing username or password',
		'Username already in use'
	];

	var username = req.body.username,
		password = req.body.password;

	if(!username || !password) {
		return res.json({
			signedIn: false,
			message:  badSignedInReason[0]
		});
	}

	users.child(username).once('value', function(snapshot){
		if( !!snapshot.exists() ){
			return res.json({
				signedIn: false,
				message:  badSignedInReason[1]
			});
		}

		var userObj = {
			username: username,
			passwordHash: hash(password),
			group: ['users']
		};

		users.child(username).set(userObj);

		req.session.user = userObj;

		return res.json({
			signedIn: true,
			user: userObj
		});
	});
});

/**
 * SIGNIN ROUTE
 */
router.post('/api/signin', function(req, res) {
	var badSignedInReason = [
		'Missing username or password',
		'Invalid username or password'
	];

	var username = req.body.username,
		password = req.body.password;

	if(!username || !password) {
		return res.json({
			signedIn: false,
			message:  badSignedInReason[0]
		});
	}

	users.child(username).once('value', function(snapshot){
		if( !snapshot.exists() || snapshot.child('passwordHash').val() !== hash(password) ){
			return res.json({
				signedIn: false,
				message:  badSignedInReason[1]
			});
		}

		var user = snapshot.exportVal();

		req.session.user = user;

		return res.json({
			signedIn: true,
			user: user
		});
	});
});

/**
 * SIGNOUT ROUTE
 */
router.post('/api/signout', function(req, res) {
	delete req.session.user;
	return res.json({
		signedIn: false,
		message:  'Your are now signed out.'
	});
});

/**
 * Add User to Group
 */
// router.post('/api/group', function(req, res) {
// 	var badData = [
// 		'Missing username or group',
// 		'Invalid username or group'
// 	];

// 	var username = req.body.username,
// 		password = req.body.group;

// 	if(!username || !password) {
// 		return res.json({
// 			message: badData[0]
// 		});
// 	}

// 	users.child(username).once('value', function(snapshot){
// 		if( !snapshot.exists() || snapshot.child('passwordHash').val() !== hash(password) ){
// 			return res.json({
// 				signedIn: false,
// 				message:  badData[1]
// 			});
// 		}

// 		var user = snapshot.exportVal();

// 		req.session.user = user;

// 		return res.json({
// 			signedIn: true,
// 			user: user
// 		});
// 	});
// });

module.exports = router;