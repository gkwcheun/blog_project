const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User" },
	comment: { type: String, required: true },
	datePosted: { type: Date, required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
