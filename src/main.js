/* globals Player, Enemy, StatBlock, render */

console.log('Main.js loaded');

let canvas, context, creatures, player; // eslint-disable-line no-unused-vars

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

function initialize () {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  let container = document.getElementById('container');
  container.style.textAlign = 'center';
}

function startGame () {
  creatures = []; // Array of the creatures in the game, including the player

  player = new Player();
  player.addStats(new StatBlock(20));
  creatures.push(player);
  player.stats.takeDamage(5);

  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(300, 100));
}

initialize();
startGame();
render();
