var express = require('express'),
	router = express.Router({ mergeParams: true }),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

var middleware = require("../middleware");

router.get('/new', middleware.isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

router.post('/', middleware.isLoggedIn, (req, res) => {
	//look up camp using id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			req.flash("error", "Yorum bulunamadı.");
			res.redirect('/kamp-yerleri');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Yorumunuz başarıyla eklendi.");
					res.redirect(`/kamp-yerleri/${campground._id}`);
				}
			});
		}
	});
});

router.put('/:c_id', middleware.checkCommentOwner ,(req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			var newComment = {
				text: req.body.comment.text,
				author: {
					id: req.user._id,
					username: req.user.username
				}
			};
			Comment.findByIdAndUpdate(req.params.c_id, newComment, (err, result) => {
				if (err) {
					res.send(err);
				} else {
					console.log(result);
					req.flash("success", "Yorumunuz başaralıyla güncellendi.");
					res.redirect(`/kamp-yerleri/${campground._id}`);
				}
			});
		}
	});
});

router.delete('/:c_id', middleware.checkCommentOwner, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			Comment.findByIdAndRemove(req.params.c_id, (err, result) => {
				if (err) {
					res.send('There was a problem while deleting campgorund.');
				} else {
					req.flash("success", "Yorumunuz başaralıyla silindi.");
					res.redirect(`/kamp-yerleri/${campground._id}`);
				}
			});
		}
	});
});


module.exports = router;