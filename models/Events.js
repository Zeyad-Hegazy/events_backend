import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
	title: String,
	imageUrl: String,
	summary: String,
	organizer: String,
	startsAt: String,
	endsAt: String,
	place: String,
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

const Event = mongoose.model("Event", eventSchema);

export default Event;
