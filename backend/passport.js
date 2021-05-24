require("dotenv").config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcryptjs");

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				console.log("error occured");
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: "Incorrect Username",
				});
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					return done(null, user);
				} else {
					console.log("Incorrect Password");
					return done(null, false, { message: "Incorrect Password" });
				}
			});
		});
	})
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET_KEY,
		},
		(jwtPayload, done) => {
			return User.findById(jwtPayload.user._id)
				.then((user) => {
					return done(null, user);
				})
				.catch((err) => {
					return done(err);
				});
		}
	)
);
