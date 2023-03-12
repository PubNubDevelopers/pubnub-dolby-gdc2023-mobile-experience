let startBtn = document.getElementById("startBtn");
let endBtn = document.getElementById("endBtn");
let subText = document.getElementById("subText");
let videoPlayer = document.getElementById("videoPlayer");
let titleCard = document.getElementById("titleCard");

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

	let response = await fetch("http://localhost:7778/auth/dolbyio/stream", options);
	let res = await response.json();
	console.log(res);

	const tokenGenerator = () =>
		window.millicast.Director.getPublisher({
			token: res["token"],
			streamName: res["streamName"],
		});

	const publisher = new window.millicast.Publish(res["streamName"], tokenGenerator);
	return publisher;
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
}

function stopStream() {
	//Ends Stream and resets browser.
	//publisher.stop();
	location.reload();
}
