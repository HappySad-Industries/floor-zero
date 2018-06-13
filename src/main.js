/* globals Player, Enemy, StatBlock, render, loadSprites, renderUI, Vector */

console.log('Main.js loaded');

let canvas, cursor, context, creatures, player; // eslint-disable-line no-unused-vars
let takingAction = false;

const CANVAS_WIDTH = (13 * 64) + 2; // 836
const CANVAS_HEIGHT = (448 + 64) + 4; // 516

function initialize () {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  let container = document.getElementById('container');
  container.style.textAlign = 'center';

  cursor = new Vector(-50, -50);
  document.addEventListener('mousemove', (e) => {
    var rect = canvas.getBoundingClientRect(); // Gets the absolute size of the canvas
    cursor.x = e.clientX - rect.left; // Adjust cursor coordinates to be relative to element
    cursor.y = e.clientY - rect.top;
  });
  document.addEventListener('click', (e) => {
    if (cursor.x > 0 && cursor.x < CANVAS_WIDTH && cursor.y > 0 && cursor.y < CANVAS_HEIGHT) {
      executeClick();
    }
  });
}

function startGame () {
  creatures = []; // Array of the creatures in the game, including the player

  player = new Player();
  player.addStats(new StatBlock(20));
  creatures.push(player);
  player.stats.takeDamage(5);

  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(300, 100));
  creatures.push(new Enemy().addStats(new StatBlock(5)).moveTo(500, 100));
}

function update (sprites) {
  if (!takingAction) {
    for (let i in creatures) {
      creatures[i].actionTimer -= creatures[i].stats.getStat('initiative');
      if (creatures[i].actionTimer <= 0) {
        creatures[i].actionTimer += creatures[i].maxActionTimer;
        takingAction = creatures[i];
        console.log(`It is now ${creatures[i].name}'s action.`);
        break;
      }
    }
  }
  render(sprites);
}

initialize();
startGame();

renderUI().then(() => {
  loadSprites().then((sprites) => {
    setInterval(update, 1000, sprites);
  });
});

function executeClick () {
  if (cursor.y < CANVAS_HEIGHT - 64 - 2) {
    player.moveTo(cursor.clone());
  }
  return true;
}
