/* globals Player, Enemy, StatBlock, render, loadSprites, renderUI */

console.log('Main.js loaded');

let canvas, context, creatures, player; // eslint-disable-line no-unused-vars
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
