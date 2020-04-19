var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	User = require('../models/User');

var middleware = require('../middleware');

router.get('/', function(req, res) {
	Campground.find({}, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campItems: result });
		}
	});
});

router.post('/', middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var newCamp = { name: name, image: image, description: desc, author: author };
	Campground.create(newCamp, (err, camps) => {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', 'Kamp yeri başaralıyla eklendi.');
			res.redirect('/kamp-yerleri');
		}
	});
});

router.get('/yeni-ekle', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, newItem) => {
			if (err || !newItem) {
				req.flash('error', 'Kamp yeri bulunumadı.');
				res.redirect('back');
			} else {
				res.render('campgrounds/show', { data: newItem });
			}
		});
});

router.put('/:id', middleware.checkCampgroundOwner, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, result) => {
		if (err) {
			console.log(err);
			res.send('There was a problem while editing campgorund.');
		} else {
			req.flash('success', 'Kamp yeri başaralıyla güncellendi.');
			res.redirect('/kamp-yerleri/' + req.params.id);
		}
	});
});

router.delete('/:id', middleware.checkCampgroundOwner, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, result) => {
		if (err) {
			res.send('There was a problem while deleting campgorund.');
		} else {
			req.flash('success', 'Kamp yeri başaralıyla silindi.');
			res.redirect('/kamp-yerleri');
		}
	});
});

router.get('/:id/edit', middleware.checkCampgroundOwner, (req, res) => {
	Campground.findById(req.params.id, (err, item) => {
		res.render('campgrounds/edit', { data: item });
	});
});

module.exports = router;