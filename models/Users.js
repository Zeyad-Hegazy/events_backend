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
});

const User = mongoose.model("User", userSchema);

export default User;
