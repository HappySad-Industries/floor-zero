
console.log('hello world');

var canvas;

function initialize () {
  canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 500;
  canvas.style.backgroundColor = 'black';
  var container = document.getElementById('container');
  container.style.textAlign = 'center';
}

initialize();
