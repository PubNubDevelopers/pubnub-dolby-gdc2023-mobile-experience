//token.js manages tokens and active streams.

// Imports
const express = require("express"),
	fs = require("fs");

// Static
const port = "7778";
const streamingKey = "b83fce09af13b36220f3cac3f2d0f9ac6c168fa0be5495ea9ba0f25af293f0f9";
const streamingAuthPath = "https://api.millicast.com/api/publish_token/";
let tokenList = []; //Token list will track token names to server to Unity Experience
const pnPublishKey = "pub-c-ec1b608c-c9a0-4989-a56f-590694da613e"; //key for publishing messages on pubnub network
const pnSubscribeKey = "sub-c-56ff6621-8a89-483f-b92b-28f2ea165821"; //key for receiving messages on pubnub network

// Secure certs for https? Maybe not required...;
const httpsOptions = {
	key: fs.readFileSync("certs/server.key"),
	cert: fs.readFileSync("certs/server.crt"),
};
const app = express();

// For testing;
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});
app.use(express.static('public'))

//Create streamName token pair for viewers. http://localhost:7778/auth/dolbyio/stream;
app.get("/auth/dolbyio/stream", (req, res) => {
	const d = new Date();
	var streamName = "GDC_Stream_" + String(d.getTime());
	tokenList.push(streamName);
	tokenPair = { token: streamingKey, streamName: streamName };
	res.send(tokenPair);
});

// spatial token... if needed?
app.get("/auth/dolbyio/spatial", (req, res) => {
	res.send("Not implemented");
});
// Return the PubNub Keys and authorization for user.
app.get("/auth/dolbyio/pubnub", (req, res) => {
	//Normally, would make use of PubNub's Access Manager to retrieve keys and permission rights for
	//a specific user.
	//To keep things simple, returning the static subscribe and publish key.
	tokenPair = { subscribeKey: pnSubscribeKey, publishKey: pnPublishKey };
	res.send(tokenPair);
});

// Listen for calls;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
