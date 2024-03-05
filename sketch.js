let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/LSukMy6cB/';

let video;
let flippedVideo;
let label = "";
let isVideoStarted = false;
let inputImage;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  const canvas = createCanvas(520, 520);
  canvas.parent('canvas');
  background(0);

  // Start and Stop buttons for video
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', startVideo);

  const stopButton = document.getElementById('stopButton');
  stopButton.addEventListener('click', stopVideo);

  // Image Upload button and Classify button
  const imageUpload = document.getElementById('imageUpload');
  imageUpload.addEventListener('change', handleImageUpload);

  const classifyButton = document.getElementById('classifyButton');
  classifyButton.addEventListener('click', () => classifyImage(inputImage));
}

function startVideo() {
  if (isVideoStarted) return;
  isVideoStarted = true;
  inputImage = null; 

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  classifyVideo();

  document.getElementById('startButton').style.display = 'none';
  document.getElementById('stopButton').style.display = 'inline';
}

function stopVideo() {
  if (!isVideoStarted) return;
  isVideoStarted = false;

  video.remove();
  document.getElementById('startButton').style.display = 'inline';
  document.getElementById('stopButton').style.display = 'none';

  background(0); 
}

function handleImageUpload(event) {
  if (isVideoStarted) {
    alert("Stop the video before uploading an image.");
    return;
  }

  const file = event.target.files[0];
  inputImage = createImg(URL.createObjectURL(file), '');
  inputImage.hide(); 
}

function draw() {
  background(0);

  if (isVideoStarted && video) {
    flippedVideo = ml5.flipImage(video);
    image(flippedVideo, 0, 0);
    classifyVideo();
  } else if (inputImage) {
    image(inputImage, 0, 0, width, height);
  }

  fill(255);
  textSize(30);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

function classifyVideo() {
  classifier.classify(flippedVideo, gotResult);
}

function classifyImage(img) {
  if (!img) return;
  classifier.classify(img, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
}
