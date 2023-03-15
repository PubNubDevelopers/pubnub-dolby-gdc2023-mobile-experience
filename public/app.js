let startBtn = document.getElementById("startBtn");
let endBtn = document.getElementById("endBtn");
let subText = document.getElementById("subText");
let videoPlayer = document.getElementById("videoPlayer");
let titleCard = document.getElementById("titleCard");
var streamId = "";
var channelId = "streamer.";
var pubnub;

function addStreamToYourVideoTag(mediaTrack) {
	// Video tag management
	videoPlayer.srcObject = mediaTrack;
	videoPlayer.hidden = false;
	videoPlayer.autoplay = true;
}

async function createPublisher() {
	// POST to Dolby.io Token Management Server
	// Creates publisher and passes it back to connectStream()

	const options = {
		method: "GET",
		headers: { accept: "application/json", "content-type": "application/json" },
	};

	let response = await fetch("https://dolbyio-pubnub-gdc2023.netlify.app/auth/dolbyio/stream", options);
	let res = await response.json();
	console.log(res);

	const tokenGenerator = () =>
		window.millicast.Director.getPublisher({
			token: res["token"],
			streamName: res["streamName"],
		});
	streamId = res["streamName"]; //Used as the UUID in PubNub Configuration
	channelId += streamId; //Using the stream name as part of the channelId: streamer.<UUID>.
	const publisher = new window.millicast.Publish(res["streamName"], tokenGenerator);
	return publisher;
}

async function createPubNub() {
	// POST to Dolby.io Token Management Server
	// Creates publisher and passes it back to connectStream()

	const options = {
		method: "GET",
		headers: { accept: "application/json", "content-type": "application/json" },
	};

	let response = await fetch("https://dolbyio-pubnub-gdc2023.netlify.app/auth/dolbyio/pubnub", options);
	let res = await response.json();
	console.log(res);

	//construct the PubNub object with the keys and UUID
	const pubnub = new PubNub({
		subscribeKey: res["subscribeKey"],
    	publishKey: res["publishKey"],
		userId: streamId
	});
	return pubnub;
}

async function connectStream() {
	startBtn.disabled = true;
	endBtn.disabled = false;
	videoPlayer.className = "vidBox";

	const publisher = await createPublisher();
	try {
		const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
		addStreamToYourVideoTag(mediaStream);
		const broadcastOptions = {
			disableAudio: true,
			codec: "vp8",
			bandwidth: 1000,
			mediaStream: mediaStream,
		};
		try {
			await publisher.connect(broadcastOptions);
			titleCard.hidden = true;
			subText.innerHTML = "You're being streamed into the in-game experience!";
			subText.className = false;
		} catch (e) {
			subText.innerHTML = "You've encountered an error: " + e.toString();
			subText.className = "errMsg";
			console.error("Connection failed, handle error", e);
		}
	} catch (err) {
		if (err.name == "NotAllowedError") {
			subText.innerHTML =
				"Error: Front camera access required for demo. <a href = https://support.mergeedu.com/hc/en-us/articles/4405902848909-How-to-enable-camera-permission target='_blank'>Camera access guide</a>";
			subText.className = "errMsg";
			startBtn.disabled = false;
			endBtn.disabled = true;
			console.log(err);
		} else {
			subText.innerHTML = "You've encountered an error: " + err.toString();
			subText.className = "errMsg";
			console.log(err);
		}
	}

	pubnub = await createPubNub();
	//Don't allow PubNub Connection if user did not grant access to camera.
	if(startBtn.disabled) {
		try {
			//Subscribe to PubNub Network.
			pubnub.subscribe({
				channels: [channelId, "default"], //only subscribing to default-pnpres for tracking number of occupants in channel - don't care about other messages.
				withPresence:true
			});
		} catch(e) {
			console.log(e);
		}
	}
}

function stopStream() {
	//Ends Stream and resets browser.
	//publisher.stop();
	//unsubscribe from pubnub to generate a leave event to catch on Unity side
	pubnub.unsubscribe({
		channels: [channelId, "default"]
	});
	location.reload();
}