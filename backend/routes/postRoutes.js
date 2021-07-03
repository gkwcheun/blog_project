const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

// multer config for photo upload
const storage = multer.diskStorage({
	destination: "post_pictures",
	filename: function (req, file, cb) {
		cb(null, file.originalname + "-" + Date.now());
	},
});

const fileFilter = (req, res, cb) => {
	const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
	if (allowedFileTypes.includes(res.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

let upload = multer({ storage, fileFilter });

router.post("/create-post", upload.single("postImage"), (req, res, next) => {
	// get title, content, toBePublished from form field
	let imageData = req.file
		? {
				data: fs.readFileSync(req.file.path),
				contentType: "image/jpg",
		  }
		: null;
	const newPost = new Post({
		title: req.body.title,
		user: req.user._id,
		content: req.body.content,
		image: imageData ? imageData : null,
		published: req.body.toBePublished === "true",
		datePosted: Date.now(),
	}).save((err, post) => {
		if (err) return next(err);
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

router.patch(
	"/update-post/:postID",
	upload.single("postImage"),
	(req, res, next) => {
		let postData = {
			title: req.body.title,
			content: req.body.content,
			datePosted: Date.now(),
			published: req.body.toBePublished === "true",
		};
		// if there is an image file uploaded on edit, overwrite old file
		// if not only update what is in the rest of update form

		if (req.file) {
			postData.image = {
				data: fs.readFileSync(req.file.path),
				contentType: "image/jpg",
			};
		}

		Post.findByIdAndUpdate(
			req.params.postID,
			{
				...postData,
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
	}
);

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

// route to delete comment from post
router.delete("/:postID/comments/:commentID", (req, res, next) => {
	// delete comment and remove reference to commment in post document
	Post.findByIdAndUpdate(
		req.params.postID,
		{
			$pull: { comments: req.params.commentID },
		},
		{ useFindAndModify: false },
		(err, post) => {
			if (err) {
				res.json({
					message: "Something went wrong removing comment from post.",
					err: err,
				});
			} else if (post) {
				// find comment by ID and delete
				Comment.findByIdAndDelete(req.params.commentID, (err) => {
					if (err) {
						res.json({
							message: "Something went wrong deleting comment.",
							err: err,
						});
					} else {
						res.json({ message: "Successfully deleted comment." });
					}
				});
			}
		}
	);
});

module.exports = router;
