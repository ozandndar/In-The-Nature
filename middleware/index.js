var Campground = require("../models/campground"),
		Comment		 = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCommentOwner = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.c_id, (err, foundComment) => {
			if (err) {
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Bunu yapmak için yetkiniz bulunmamaktadır.");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "Lütfen önce giriş yapınız.");
		res.redirect('back');
	}
};

middlewareObj.checkCampgroundOwner = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCamp) => {
			if (err || !foundCamp) {
				req.flash("error", "Kamp yeri bulunamadı.");
				res.redirect('back');
			} else {
				if (foundCamp.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Bunu yapmak için yetkiniz bulunmamaktadır.");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "Lütfen önce giriş yapınız.");
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Lütfen önce giriş yapınız.");
	res.redirect('/login');
};

module.exports = middlewareObj;