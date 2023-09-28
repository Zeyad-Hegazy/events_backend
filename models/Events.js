import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
	title: String,
	imageUrl: String,
	summary: String,
	creator: String,
	startsAt: String,
	endsAt: String,
	place: String,
	price: Number,
	capacity: Number,
	likes: {
		type: [String],
		default: [],
	},
	subscribers: {
		type: [String],
		default: [],
	},
});

export default mongoose.model("Event", eventSchema);
