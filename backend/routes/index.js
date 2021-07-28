require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const ProfilePic = require("../models/ProfilePic");
const router = express.Router();

// multer config
const storage = multer.diskStorage({
	destination: "profile_pictures",
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

// routes definition

router.get("/", (req, res, next) => {
	Post.find({ published: true })
		.populate({ path: "user", populate: { path: "profilePicture" } })
		.exec((err, posts) => {
			if (err) {
				res.json({ message: "Error retreiving posts" });
			} else {
				// console.log(posts);
				res.json({ message: "Successfully retrieved posts", posts: posts });
			}
		});
});

router.post("/signup", upload.single("dp"), (req, res, next) => {
	User.findOne({ username: req.body.username }, (err, user) => {
		if (err) return next(err);
		if (user) {
			res.json({
				message: `User with username: ${req.body.username} already exists!`,
			});
		} else {
			// get profile picture data from uploaded file
			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) return next(err);
				let userData = {
					username: req.body.username,
					password: hashedPassword,
				};
				if (req.file) {
					let dp = new ProfilePic({
						profilePicture: {
							data: fs.readFileSync(req.file.path),
							contentType: "image/jpeg",
						},
					});
					dp.save((err, picture) => {
						if (err) return next(err);
						else {
							userData.profilePicture = picture._id;
							let user = new User({ ...userData });
							user.save((err, user) => {
								if (err) return next(err);
								else {
									ProfilePic.findByIdAndUpdate(
										picture._id,
										{
											user: user._id,
										},
										{ useFindAndModify: false },
										(err) => {
											if (err) {
												res.json({
													message:
														"Error occured while saving profile pic to user",
													err: err,
												});
											}
										}
									);
									res.json({
										message: `User with username: ${req.body.username} created`,
									});
								}
							});
							// console.log(user);
						}
					});
				} else {
					let user = new User({ ...userData });
					user.save((err) => {
						if (err) return next(err);
						res.json({
							message: `User with username: ${req.body.username} created`,
						});
					});
					// console.log(user);
				}
			});
		}
	});
});

router.post("/login", function (req, res, next) {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: "Something is not right",
				user: user,
			});
		}

		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}

			// generate a signed son web token with the contents of user object and return it in the response
			const token = jwt.sign({ user }, process.env.SECRET_KEY);
			// jwt token saved locally in front end app to access authentication required pages
			return res.json({ user, token });
		});
	})(req, res);
});

router.post("/logout", (req, res, next) => {
	res.json({ message: "To be implemented" });
});

router.get("/post/:postID", (req, res, next) => {
	// get post with postID, return json data of post to frontend
	Post.findById(req.params.postID)
		.populate([
			{
				path: "comments",
				populate: {
					path: "user",
					select: "username profilePicture",
					populate: { path: "profilePicture" },
				},
			},
		])
		// .populate({
		// 	path: "comments",
		// 	populate: {
		// 		path: "user.profilePicture",
		// 	},
		// })
		.populate({
			path: "user",
			select: "username profilePicture",
			populate: { path: "profilePicture" },
		})
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

// post comment
router.post("/comments/:postID", (req, res, next) => {
	// post comment and associated user to DB, add comment ID to post
	let comment = new Comment({
		user: req.body.user,
		comment: req.body.comment,
		datePosted: Date.now(),
	}).save((err, comment) => {
		if (err) return next(err);
		// console.log(comment);
		Post.findByIdAndUpdate(
			req.params.postID,
			{ $push: { comments: comment._id } },
			{ useFindAndModify: false },
			(err, post) => {
				if (err) res.json({ err: err });
				res.json({ message: "New Comment Added!" });
			}
		);
	});
});

module.exports = router;
