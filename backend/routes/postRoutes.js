const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/post-detail/:postID", (req, res, next) => {
	// get post with postID, return json data of post to frontend
	Post.findById(req.params.postID)
		.populate("comments")
		.exec((err, post) => {
			if (err) {
				res.json({
					message: "An error has occured fetching post data",
					err: err,
				});
			} else if (post) {
				res.json({ post });
			}
		});
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

router.patch("/update-post/:postID", (req, res, next) => {
	Post.findByIdAndUpdate(
		req.params.postID,
		{
			// how to only update the content that was changed?
			title: req.body.title,
			content: req.body.content,
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

module.exports = router;
