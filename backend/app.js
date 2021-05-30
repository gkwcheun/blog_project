require("dotenv").config();
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const indexRouter = require("./routes/index");
const cors = require("cors");

require("./passport");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/post", passport.authenticate("jwt", { session: false }), postRouter);

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to DB");
	});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

app.listen(process.env.PORT, () => {
	console.log(`App connected, listening on port ${process.env.PORT}`);
});
