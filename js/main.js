const video = document.getElementById("video");
const happyDiv = document.querySelector(".happy");
const angryDiv = document.querySelector(".angry");
const disgustedDiv = document.querySelector(".disgusted");
const feardulDiv = document.querySelector(".feardul");
const neutralDiv = document.querySelector(".neutral");
const sadDiv = document.querySelector(".sad");
const surprisedDiv = document.querySelector(".surprised");
const notVisibleDiv = document.querySelector(".notVisible")

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

getExpression = (expressions) => {
    let face = "neutral";
    for (const expression in expressions) {
        if (expressions[face] < expressions[expression])
            face = expression;
    }
    return face;
};

showExpression = (divs, expression) => {
    for (const div in divs) {
        divs[div].style.display = "none"
    }
    divs[expression].style.display = "flex"
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    let expressions;
    let divs = {
        'happy': happyDiv,
        'neutral': neutralDiv,
        'sad': sadDiv,
        'disgusted': disgustedDiv,
        'angry': angryDiv,
        'surprised': surprisedDiv,
        'notVisible': notVisibleDiv
    };
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if (detections.length != 0) {
            const {happy, neutral, disgusted, sad, fearful, surprised, angry} = detections.pop()["expressions"];
            expressions = {happy, neutral, disgusted, sad, fearful, surprised, angry};
            const faceExpression = getExpression(expressions);
            showExpression(divs, faceExpression)
        } else showExpression(divs, 'notVisible');
    }, 100);
});
