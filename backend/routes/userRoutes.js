// API to view/create/update/delete users
// requires Admin authentication
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const ProfilePic = require("../models/ProfilePic");

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
		.populate("profilePicture")
		.populate("posts")
		.exec((err, user) => {
			if (err) {
				res.json({ message: "An error occured fetching user info", err: err });
			} else if (user) {
				res.json({
					username: user.username,
					userID: user._id,
					posts: user.posts,
					profilePicture: user.profilePicture,
				});
			}
		});
});

// to be developed: update user (password and username)
// delete user
router.delete("/delete/:userID", async (req, res, next) => {
	// route to delete user and all its posts/comments
	await Post.deleteMany({ user: req.params.userID }, (err) => {
		if (err) {
			console.log(`Error occured deleting posts by user ${req.params.userID}`);
			res.json({
				message: `Error occured deleting posts by user ${req.params.userID}`,
				err: err,
			});
		} else {
			console.log(`Successfully deleted posts by user ${req.params.userID}`);
		}
	});
	await Comment.deleteMany({ user: req.params.userID }, (err) => {
		if (err) {
			console.log(
				`Error occured deleting comments by user ${req.params.userID}`
			);
			res.json({
				message: `Error occured deleting comments by user ${req.params.userID}`,
				err: err,
			});
		} else {
			console.log(
				`Successfully deleted commments by user ${req.params.userID}`
			);
		}
	});
	await ProfilePic.deleteOne({ user: req.params.userID }, (err) => {
		if (err) {
			console.log(
				`Error occured deleting profile picture of user ${req.params.userID}`
			);
			res.json({
				message: `Error occured deleting profile picture user ${req.params.userID}`,
				err: err,
			});
		} else {
			console.log(
				`Successfully deleted profile picture of  ${req.params.userID}`
			);
		}
	});
	await User.findByIdAndDelete(req.params.userID, (err) => {
		if (err) {
			console.log(`Error occured deleting user ${req.params.userID}`);
			res.json({
				message: `Error occured user ${req.params.userID}`,
				err: err,
			});
		} else {
			console.log(`Successfully deleted user ${req.params.userID}`);
			res.json({ message: `Successfully deleted user ${req.params.userID}` });
		}
	});
});

module.exports = router;
