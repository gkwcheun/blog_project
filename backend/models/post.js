const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: "User" },
	content: { type: String, required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	published: { type: Boolean, default: false },
	datePosted: { type: Date, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
