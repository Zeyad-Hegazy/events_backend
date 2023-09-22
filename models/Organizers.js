import mongoose from "mongoose";

const organizersSchema = mongoose.Schema({
	name: String,
	business: String,
	email: String,
	password: String,
	events: {
		type: [String],
		default: [],
	},
});

const Organizer = mongoose.model("Organizer", organizersSchema);

export default Organizer;
