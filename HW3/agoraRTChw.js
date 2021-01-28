let handlefail = function (err) {
    console.log(err)
}

function addVideoStream(streamId) {

    console.log()
    let callerContainer = document.getElementById("caller-container")
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)"
    streamDiv.className = "new-caller";
    callerContainer.appendChild(streamDiv);

    let participantList = document.getElementById("participant-container")
    let callerName = document.createElement("span");
    callerName.innerHTML = streamId;
    callerName.className = "participant";
    participantList.appendChild(callerName);
}

document.getElementById("join").onclick = function () {
    let channel = document.getElementById("channel").value;
    let username = document.getElementById("username").value;
    let appId = "8670601d5846453da7342427e9da5420";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    let participantList = document.getElementById("participant-container")
    let callerName = document.createElement("span");
    callerName.innerHTML = username;
    callerName.className = "participant";
    participantList.appendChild(callerName);

    client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
    )

    client.join(
        null,
        channel,
        username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function () {
                localStream.play("self-stream")
                console.log(`App id: ${appId}\nChannel id: ${channel}`)
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt) {
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function (evt) {
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })

}