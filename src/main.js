/* globals Image, Player, StatBlock */

console.log('Hello World');

let canvas, context, player;

function initialize () {
  let tile = new Image();
  tile.src = 'assets/sprites/tile.png';

  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 500;
  canvas.style.backgroundColor = 'black';

  let container = document.getElementById('container');
  container.style.textAlign = 'center';

  tile.onload = event => {
    let pattern = context.createPattern(tile, 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame () {
  player = new Player();
  player.addStats(new StatBlock(20));
  player.stats.takeDamage(5);
}

initialize();
startGame();
