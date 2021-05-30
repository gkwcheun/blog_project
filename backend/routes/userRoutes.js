// API to view/create/update/delete users
// requires Admin authentication
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

// need to somehow pass jwt through authorization header bearer token
router.get("/", (req, res, next) => {
	if (req.user) {
		res.json({ user: req.user });
	} else {
		res.json({ message: "Please log in first." });
	}
});

router.get("/:userID", (req, res, next) => {
	// get profile with userID, return json with username and posts made
	User.findById(req.params.userID)
		.populate("posts")
		.exec((err, user) => {
			if (err) {
				res.json({ message: "An error occured fetching user info", err: err });
			} else if (user) {
				res.json({
					username: user.username,
					userID: user._id,
					posts: user.posts,
				});
			}
		});
});

// to be developed: update user (password and username)
// delete user

module.exports = router;
