const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("js/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("js/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("js/models"),
]).then(getVideo);

function getVideo() {
    navigator.getUserMedia(
        { video: {} },
        (stream) => (video.srcObject = stream),
        (e) => console.error(e)
    );
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
        // console.log(detections)
        const {angry, digusted, fearful, happy, neutral, sad, surprised} = detections.pop()['expressions']
        console.log(happy)
    }, 100);
});
