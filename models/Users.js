import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	fullName: String,
	age: Number,
	city: String,
	gender: String,
	imageUrl: String,
	email: String,
	password: String,
	phoneNumber: String,
	subscripeAt: {
		type: [String],
		default: [],
	},
});

export default mongoose.model("User", userSchema);
