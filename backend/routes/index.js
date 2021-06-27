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
		.populate("user", "username profilePicture")
		.populate("Comment")
		.exec((err, posts) => {
			if (err) {
				res.json({ message: "Error retreiving posts" });
			} else {
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
			let profilePictureData = fs.readFileSync(req.file.path);
			console.log(profilePictureData);
			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) return next(err);
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
					profilePicture: {
						data: profilePictureData,
						contentType: "image/jpg",
					},
				}).save((err) => {
					if (err) return next(err);
					res.json({
						message: `User with username: ${req.body.username} created`,
					});
				});
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

module.exports = router;
