var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var passport = require('passport');
BearerStrategy = require('passport-http-bearer').Strategy;

var userController = require('../controllers/UserController');
var eventController = require('../controllers/EventController');
var User = require('../models/Users');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/login', userController.login);
router.post('/signup',userController.signUp);
router.post('/event', isLoggedIn, requireRole('organisers'), eventController.createEvent);


passport.use(new BearerStrategy(
	function (token, done) {
		User.findOne({ 'token': { $elemMatch: { "access_token": token } } }, function (err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			var matched_token = 0;
			user.token.forEach(function (u, i) {
				if (u.access_token == token) {
					matched_token = u;
				};
			})
			if (matched_token.expire < Math.floor(Date.now())) {
				return done(null, false, { message: 'Token expired' });
			}
			return done(null, user, { scope: 'read' });
		});
	}
));

function isLoggedIn(req, res, next) {
	return passport.authenticate('bearer', {
		session: false
	}, function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			if (info) {
				return res.status(401).json({
					status: "unsuccess",
					message: info
				});
			} else {
				return res.status(401).json({
					status: "unsuccess",
					message: 'Not authorized'
				});
			}
		}
		req.user = user;
		return next();
	})(req, res, next);
}

function requireRole(role) {
	return function (req, res, next) {
		if (req.user && req.user.role === role) {
			return next();
		} else {
			return  res.json({
				"error"   : "invalid_access",
				"message" : "You are not authorized"
			});
		}
	}
}

module.exports = router;