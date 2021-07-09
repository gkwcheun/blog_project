const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfilePicSchema = new Schema({
	profilePicture: { data: Buffer, contentType: String },
	user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("ProfilePic", ProfilePicSchema);
