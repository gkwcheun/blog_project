require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const router = express.Router();

router.post("/signup", (req, res, next) => {
	User.findOne({ username: req.body.username }, (err, user) => {
		if (err) return next(err);
		if (user) {
			res.json({
				message: `User with username: ${req.body.username} already exists!`,
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) return next(err);
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
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

router.get("/blog", (req, res, next) => {
	Post.find({ published: true })
		.populate("User", "username")
		.populate("Comment")
		.exec((err, posts) => {
			if (err) {
				res.json({ message: "Error retreiving posts" });
			} else {
				res.json({ message: "Successfully retrieved posts", posts: posts });
			}
		});
});

module.exports = router;
