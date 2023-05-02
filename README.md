Dolby.io + PubNub: Metaverse Mobile Social Experience
======================================================
Welcome to the Dolby.io and PubNub Real-Time Metaverse Mobile Social Experience!

This is a JavaScript demo that allows users to connect to a metaverse-style game built in Unity to showcase real-time features. Originally built as a demo for GDC 2023, users who join the mobile experience will have their video live-streamed from their camera into the game in real time. While users can join the Unity game while it is not running, the full experience is best suited when combined with the Unity game. Finally, while this mobile experience is intended to be used by mobile devices, this application can be used by any browser that has a camera available.

<p align="middle">
  <img src="/media/MobileExperience1.png"/>
</p>

## Demo
1. Scan the QR code with your mobile device or navigate to the demo experience with the [URL](https://developer.dolby.io/demos/GDC-demo-experience/).
<p align="middle">
  <img src="/media/MobileExperienceQRCode.png"/>
</p>
2. Click on the "Join the Experience" button, which will request permissions for your camera - click Allow.
<p align="middle">
  <img src="/media/MobileExperience2.jpeg"/>
</p>
3. You will now be live streaming from your camera into the experience and are known as a streamer.
4. Follow the [instructions](https://github.com/PubNubDevelopers/dolbyio-pubnub-gdc2023-unity/blob/main/README.md) in the Unity metaverse game to see the streamers populate in the Unity game as television objects once they join the experience and have their video be streamed in real time.
5. Click "Leave the Experience" for the mobile experience to stop streaming your video in real time. Watch the Unity game as your television object is removed.

## Architecture of Mobile + Unity Experience
<p align="middle">
  <img src="/media/architecture.png"/>
</p>

There is a server that provides the mobile experience the Dolby.io publish token and account id necessary to connect to Dolby.io’s network. The server also provides the mobile user the PubNub Publish/Subscribe keys necessary to connect to the PubNub Network via an object.
Once this object is created, users connect to the PubNub network using a subscribe call and by providing a channel, which is the mechanism through which the data is transmitted from one device to another.

When the Unity game starts, it creates a PubNub object and connects to the network via a subscribe call that is listening to the same channel name as the mobile experience (using a wildcard subscribe), which allows the Unity experience to listen for a hierarchical list of channel names. Event listeners allow users to then catch any new mobile connections, since subscribe events, with a setting enabled, generate what are called Presence events.
The basic Presence events are sent across the network when the joins, leaves, or suddenly quits from the network.

The Unity game then creates the streamer TV game object that pulls in the live video from the mobile users by connecting to the Dolby.io network.
The presence events are also used to determine how many active players are in the game at a time. The chat messages listen for any message events generated when a user publishes a message to a specified channel whenever a message is sent. The ID of the sender, as well as their corresponding message, is displayed on the screen. The debug console players (little red objects) when a debug console player connects to the network (channel name starts with “debug-console”). The Unity experience catches these presence events and generates the game objects based on the channel name.

## Building and Running

While this demo is fully playable and featured, if you would like to expand upon this application yourself to add more real-time functionality and not have API limits, you will need Dolby.io and PubNub API keys to power the real-time features used in these applications.

Note: while this demo uses a server that is hosted to provide the token and authorization to both Dolby.io and PubNub, you can run everything locally by following the instructions below.

#### Get Your Dolby.io Keys
1. Sign in to your [Dolby.io Dashboard](https://dolby.io/signup).
2. Create an application in the Live broadcast section and navigate to the token details section.
3. Save the Publishing token and Account ID from your Dolby.io dashboard application to use later.

#### Get Your PubNub Keys
1. Sign in to your [PubNub Dashboard](https://admin.pubnub.com/). You are now in the Admin Portal.
2. Click on the generated app and then keyset.
3. Enable Presence by clicking on the slider to turn it on. A pop-up will require that you enter in “ENABLE”. Enter in “ENABLE” in all caps and then press the “Enable” button. Enable the "Generate Leave on TCP FIN or RST checkbox", which generates leave events when clients close their connection (used to track occupancy and remove non-connected clients in app). You can leave the rest of the default settings.
5. Click on save changes.
6. Save the Publish and Subscribe Keys.

#### Node.js
Install the latest version of [Node.js](https://nodejs.org/en)

#### Build & Run

1. Clone the GitHub repository.

	```bash
	git clone https://github.com/PubNubDevelopers/pubnub-dolby-gdc2023-mobile-experience.git
	```  
2. Install any necessary packages by opening the terminal and navigating to the directory with the command ```npm i```
3. Navigate to the folder and open token.js. This is the server that grants the token and authorization requests to both PubNub and Dolby.io networks.
4. Replace the streamingKey with your Dolby.io Publishing Key.
5. Replace the pnPublishKey and pnSubscribeKey with your PubNub publish and subscribe keys respectively. Save the file. 
6. Open the terminal in this file location. Install [express](https://www.npmjs.com/package/express), the web framework used to power this application with the command ```npm install express```.
7. Run the server by entering the following command in the terminal in the directory after installing updates with the command ```node token```.
8. Open public/index.html and follow the demo steps to interact with the mobile experience. 

## Links
- Mobile Experience Demo: https://developer.dolby.io/demos/GDC-demo-experience/
- Unity Experience: https://github.com/PubNubDevelopers/dolbyio-pubnub-gdc2023-unity/
- Dolby.io Documentation: https://docs.dolby.io/
- PubNub Documentation: https://www.pubnub.com/docs/

## License
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
