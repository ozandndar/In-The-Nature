var express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	passport = require('passport'),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

router.get('/api/camps', (req, res) => {
	// Campground.find({})
	// 	.populate('comments')
	// 	.exec((err, jsonResult) => {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			res.setHeader('Content-Type', 'application/json');
	// 			res.end(JSON.stringify(jsonResult));
	// 		}
	// 	});

	// 		Campground.find( { "author.username":"ozan" } , (err, jsonResult) => {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				res.setHeader('Content-Type', 'application/json');
	// 				res.end(JSON.stringify(jsonResult));
	// 			}
	// 		});

	Campground.find({ 'author.username': 'ozan' })
		.populate('comments')
		.exec((err, jsonResult) => {
			if (err) {
				console.log(err);
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(jsonResult));
			}
		});
});

router.get('/', function(req, res) {
	res.render('landing');
});

router.get('/register', (req, res) => {
	res.render('register');
});

router.get('/profile', (req, res) => {
	if (req.isAuthenticated()) {
		Campground.find({ 'author.username': req.user.username })
			.populate('comments')
			.exec((err, userProfile) => {
				if (err) {
					console.log(err);
				} else {
					var c = 0;
					userProfile.forEach(i => {
						c += i.comments.length;
					});
					res.render('profile', { data: userProfile, countedComment: c });
				}
			});
	} else {
		res.redirect('login');
	}
});

router.post('/register', (req, res) => {
	var newUser = new User({ username: req.body.username, mail: req.body.mail });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			// req.flash("error", err.message);
			res.send(err.message);
			return res.redirect('register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash("success", "In The Nature hesabın başarıyla oluşturuldu, " + user.username);
			res.send("Successfully created account");
			res.redirect('/kamp-yerleri');
		});
	});
});

// Login Route
router.get('/login', (req, res) => {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/kamp-yerleri',
		failureRedirect: '/login'
	}),
	(req, res) => {
		
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success", "Başarılı bir şekilde çıkış yaptınız.");
	res.redirect('/login');
});


module.exports = router;