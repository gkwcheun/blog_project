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

router.post("/create-post", (req, res, next) => {
	// get title, content, toBePublished from form field
	console.log(req.body);
	const newPost = new Post({
		title: req.body.title,
		user: req.user._id,
		content: req.body.content,
		published: req.body.toBePublished ? true : false,
		datePosted: Date.now(),
	}).save((err, post) => {
		if (err) return next(err);
		console.log(post);
		User.findByIdAndUpdate(
			req.user._id,
			{ $push: { posts: post._id } },
			{ useFindAndModify: false },
			(err, user) => {
				if (err) res.json({ err: err });
				res.json({ message: "New Post Created! Success!" });
			}
		);
	});
});

router.put("/update-post/:postID", (req, res, next) => {
	Post.findByIdAndUpdate(
		req.params.postID,
		{
			// how to only update the content that was changed?
			title: req.body.title ? req.body.title : null,
			published: req.body.toBePublished ? req.body.toBePublished : null,
			content: req.body.content ? req.body.content : null,
			datePosted: Date.now(),
		},
		{ useFindAndModify: false },
		(err, post) => {
			if (err) {
				res.json({
					message: "Something went wrong with post update",
					err: err,
				});
			} else {
				res.json({ message: "Successful update", post: post });
			}
		}
	);
});

router.delete("/delete-post/:postID", (req, res, next) => {
	User.findByIdAndUpdate(
		req.user._id,
		{ $pull: { posts: req.params.postID } },
		{ useFindAndModify: false },
		(err, user) => {
			if (err) {
				res.json({
					message: "Something went wrong removing post from user",
					err: err,
				});
			} else if (user) {
				Post.findByIdAndDelete(req.params.postID, (err) => {
					if (err) {
						res.json({
							message: "Something went wrong deleting post",
							err: err,
						});
					} else {
						res.json({ message: "Successfully deleted post." });
					}
				});
			}
		}
	);
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

router.get("/post-detail/:postID", (req, res, next) => {
	// get post with postID, return json data of post to frontend
});

module.exports = router;
