import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import orgaizerRoutes from "./routes/organizerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const connection_url = process.env.CONNENCTION_URL;
const PORT = process.env.PORT || 8080;

const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.use("organize", orgaizerRoutes);
app.use("user", userRoutes);
app.use("event", eventRoutes);

mongoose
	.connect(connection_url)
	.then(() => {
		app.listen(PORT);
		console.log(`server running on port : ${PORT}`);
	})
	.catch((err) => {
		console.log(err);
	});
