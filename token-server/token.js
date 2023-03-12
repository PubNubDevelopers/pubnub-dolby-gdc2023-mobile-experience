//token.js manages tokens and active streams.

// Imports
const express = require("express"),
	fs = require("fs");

// Static
const port = "7778";
const streamingKey = "b83fce09af13b36220f3cac3f2d0f9ac6c168fa0be5495ea9ba0f25af293f0f9";
const streamingAuthPath = "https://api.millicast.com/api/publish_token/";
let tokenList = []; //Token list will track token names to server to Unity Experience

// Secure certs for https? Maybe not required...;
const httpsOptions = {
	key: fs.readFileSync("certs/server.key"),
	cert: fs.readFileSync("certs/server.crt"),
};
const app = express();

// For testing;
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

//Create streamName token pair for viewers. http://localhost:7778/auth/dolbyio/stream;
app.get("/auth/dolbyio/stream", (req, res) => {
	const d = new Date();
	var streamName = "GDC_Stream_" + String(d.getTime());
	tokenList.push(streamName);
	tokenPair = { token: streamingKey, streamName: streamName };
	res.send(tokenPair);
});

//Returns a list of active streams. http://localhost:7778/auth/dolbyio/streamList;
app.get("/auth/dolbyio/streamList", (req, res) => {
	res.send(tokenList);
});

// spatial token... if needed?
app.get("/auth/dolbyio/spatial", (req, res) => {
	res.send("Not implemented");
});
// PubNub token... if needed?
app.get("/auth/dolbyio/pubnub", (req, res) => {
	res.send("Not implemented");
});

// Listen for calls;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
