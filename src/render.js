/* globals CANVAS_HEIGHT, CANVAS_WIDTH, canvas, context, Image, creatures */

function render (sprites) { // eslint-disable-line no-unused-vars
  console.log('Rendering started');

  context.clearRect(0 + 2, 0 + 2, canvas.width - 4, canvas.height - 64 - 2); // Clear the canvas

  let pattern = context.createPattern(sprites.find(sprite => sprite.name === 'tile.png').sprite, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0 + 2, 0 + 2, canvas.width - 4, canvas.height - 64 - 2);

  for (let i = 0; i < creatures.length; i++) {
    let creature = creatures[i];

    if (sprites.find(sprite => sprite.name === creature.sprite)) {
      // console.log(`Sprite ${creature.sprite} is loaded`);
      context.drawImage(sprites.find(sprite => sprite.name === creature.sprite).sprite, creature.position.x, creature.position.y);
    } else {
      throw new Error(`Sprite ${creature.sprite} isn't loaded!`);
    }
  }
}

function loadSprites () { // eslint-disable-line no-unused-vars
  return new Promise((resolve, reject) => {
    let sprites = []; // {name, sprite}

    let loaded = 0;
    let toLoad = ['tile.png', 'baddie.png', 'friend.png'];
    toLoad.forEach(name => {
      let sprite = new Image();
      sprite.src = 'assets/sprites/' + name;
      sprite.onload = () => {
        sprites.push({name: name, sprite: sprite});
        loaded++;
        console.log(loaded);

        if (loaded === toLoad.length) {
          console.log('All sprites loaded!');
          resolve(sprites);
        }
      };
    });
  });
}

function renderUI () { // eslint-disable-line no-unused-vars
  console.log('Loading sprites1');
  return new Promise((resolve, reject) => {
    console.log('Loading sprites');
    new Promise((resolve, reject) => {
      let sprites = []; // {name, sprite}

      let loaded = 0;
      let toLoad = ['ui-tile-1.png', 'ui-tile-2.png', 'ui-tile-3.png', 'ui-tile-4.png', 'ui-tile-5.png', 'ui-tile-6.png', 'ui-tile-7.png', 'ui-tile-8.png', 'ui-tile-9.png', 'ui-tile-arrows.png', 'ui-tile-pause.png', 'ui-tile-empty.png', 'ui-tile-move.png', 'ui-tile-spells.png', 'border-side.png', 'border-toppom.png', 'ui-divider.png'];
      toLoad.forEach(name => {
        let sprite = new Image();
        sprite.src = 'assets/sprites/' + name;
        sprite.onload = () => {
          sprites.push({name: name, sprite: sprite});
          loaded++;
          console.log(loaded);

          if (loaded === toLoad.length) {
            console.log('All ui sprites loaded!');
            resolve(sprites);
          }
        };
      });
    }).then((sprites) => {
      console.log('UI sprites loaded, rendering UI');
      const UI_TOP = CANVAS_HEIGHT - 64;
      const UI_LEFT = 1;

      for (let i = 0; i < 13; i++) {
        let sprite;
        if (i === 0) {
          sprite = sprites.find(sprite => sprite.name === `ui-tile-move.png`).sprite;
        } else if (i > 0 && i < 10) {
          sprite = sprites.find(sprite => sprite.name === `ui-tile-${i}.png`).sprite;
        } else if (i === 10) {
          sprite = sprites.find(sprite => sprite.name === `ui-tile-arrows.png`).sprite;
        } else if (i === 11) {
          sprite = sprites.find(sprite => sprite.name === `ui-tile-spells.png`).sprite;
        } else if (i === 12) {
          sprite = sprites.find(sprite => sprite.name === `ui-tile-pause.png`).sprite;
        } else {
          sprite = sprites.find(sprite => sprite.name === `ui-tile-empty.png`).sprite;
        }
        context.drawImage(sprite, UI_LEFT + i * 64, UI_TOP);
        if (i !== 0 && i !== 13) context.drawImage(sprites.find(sprite => sprite.name === `ui-divider.png`).sprite, i * 64, UI_TOP);
      }

      context.drawImage(sprites.find(sprite => sprite.name === `border-side.png`).sprite, 0, 0);
      context.drawImage(sprites.find(sprite => sprite.name === `border-side.png`).sprite, CANVAS_WIDTH - 2, 0);
      context.drawImage(sprites.find(sprite => sprite.name === `border-toppom.png`).sprite, 0, 0);
      context.drawImage(sprites.find(sprite => sprite.name === `border-toppom.png`).sprite, 0, UI_TOP);
      context.drawImage(sprites.find(sprite => sprite.name === `border-toppom.png`).sprite, 0, CANVAS_HEIGHT - 2);
    });
    resolve();
  });
}
