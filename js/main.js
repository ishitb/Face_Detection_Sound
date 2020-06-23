const video = document.querySelector("#video");

function getVideo() {
    navigator.getUserMedia(
        { video: {} },
        (stream) => video.srcObject = stream,
        (err) => console.error(err)
    );
    console.log(video, "hello");
}

getVideo();
