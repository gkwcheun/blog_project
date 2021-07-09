const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const UserSchema = new Schema({
// 	username: { type: String, required: true },
// 	password: { type: String, required: true },
// 	profilePicture: { data: Buffer, contentType: String },
// 	posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
// });

const UserSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	profilePicture: { type: Schema.Types.ObjectId, ref: "ProfilePic" },
	posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("User", UserSchema);
