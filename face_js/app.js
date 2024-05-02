let video = null;
let detector = null;
let detections = [];
let videoVisibility = true;
let detecting = false;

const videoAction = document.getElementById('videoAction');
const detectionAction = document.getElementById('detectionAction');

document.body.style.cursor = 'wait';

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
}

function draw() {
  if (!video || !detecting) return;
  image(video, 0, 0);
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
  }
}

function drawResult(object) {
  if (object.label === 'person') {
    boundingBox(object);
    drawLabel(object);
  }
}

function boundingBox(object) {
  stroke('blue');
  strokeWeight(6);
  noFill();
  rect(object.x, object.y, object.width, object.height);
}


/*function drawLabel(object) {
  noStroke();
  fill('white');
  textSize(34);
  text(object.label, object.x + 15, object.y + 34);
}*/

function drawLabel(object) {
  noStroke();
  fill('white');
  textSize(34);
  text(object.label, object.x + 15, object.y + 34);
}


/*function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;

  let objectCounts = {};


  for (let i = 0; i < detections.length; i++) {
    const label = detections[i].label;
    if (label === 'person') {
      if ('person' in objectCounts) {
        objectCounts['person']++;
      } else {
        objectCounts['person'] = 1;
      }
    } else {
      if (label in objectCounts) {
        objectCounts[label]++;
      } else {
        objectCounts[label] = 1;
      }
    }
  }

  for (const label in objectCounts) {
    console.log(`Cantidad de ${label}: ${objectCounts[label]}`);
  }

  if (detecting) {
    detect();
  }
}

function detect() {
  detector.detect(video, onDetected);
}*/


function onDetected(error, results) {
  if (error) {
    console.error(error);
    return; // Detener la ejecución si hay un error
  }
  
  // Filtrar las detecciones para que solo incluyan personas
  detections = results.filter(result => result.label === 'person');
  
  // Dibujar las detecciones en el lienzo
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
  }
  
  if (detecting) {
    detect();
  }
}

function detect() {
  detector.detect(video, onDetected);
}

function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    videoAction.innerText = 'Activar Video';
  } else {
    video.show();
    videoAction.innerText = 'Desactivar Video';
  }
  videoVisibility = !videoVisibility;
}

function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect(); // Iniciar la detección de objetos
    detectionAction.innerText = 'Parar...';
  } else {
    detectionAction.innerText = 'Detectar Objetos';
  }
  detecting = !detecting;
}
