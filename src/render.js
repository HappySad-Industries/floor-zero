/* globals CANVAS_HEIGHT, CANVAS_WIDTH, canvas, context, cursor, clicking, debug, Event, Image, creatures, player, moveMode, targetVisual, TargetArrow */

function render (sprites) { // eslint-disable-line no-unused-vars
  if (debug) console.log('Rendering started');

  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  context.beginPath();
  let pattern = context.createPattern(sprites.find(sprite => sprite.name === 'tile.png').sprite, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0 + 2, 0 + 2, canvas.width - 4, canvas.height - 64 - 2);

  for (let i = 0; i < creatures.length; i++) {
    let creature = creatures[i];

    if (sprites.find(sprite => sprite.name === creature.sprite)) {
      // console.log(`Sprite ${creature.sprite} is loaded`);
      let sprite = sprites.find(sprite => sprite.name === creature.sprite).sprite;
      context.drawImage(sprite, creature.position.x - sprite.width / 2, creature.position.y - sprite.height / 2);
    } else {
      throw new Error(`Sprite ${creature.sprite} isn't loaded!`);
    }

    if (creature.hitbox) {
      context.translate(creature.hitbox.pos().x, creature.hitbox.pos().y);
      creature.hitbox.render();
      context.translate(-creature.hitbox.pos().x, -creature.hitbox.pos().y);
    }
  }
}

function renderMovement (dt, creature) { // eslint-disable-line no-unused-vars
  // It's called *render*Movement but no actual rendering occurs here, just the
  // prep for it. I guess it is rendering because it is changing the position in
  // order to render smoothly.

  if (creature.moveTarget) {
    let scaleFactor = 0.01; // To calm down the ridiculous speeds
    let lambda = dt * scaleFactor * creature.stats.baseAgility;
    if (creature.position.distance(creature.moveTarget) <= lambda) { // If within reach, just move there.
      creature.moveTo(creature.moveTarget);
    } else { // Move towards the target, lambda amounts at a time
      creature.position = creature.position.add(creature.position.to(creature.moveTarget).unit(lambda));
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
        if (debug) console.log(loaded);

        if (loaded === toLoad.length) {
          if (debug) console.log('All sprites loaded!');
          resolve(sprites);
        }
      };
    });
  });
}

function loadUI () { // eslint-disable-line no-unused-vars
  if (debug) console.log('Loading sprites1');
  return new Promise((resolve, reject) => {
    if (debug) console.log('Loading sprites');
    let sprites = []; // {name, sprite}

    new Promise((resolve, reject) => {
      let loaded = 0;
      let toLoad = ['ui-tile-1.png', 'ui-tile-2.png', 'ui-tile-3.png', 'ui-tile-4.png', 'ui-tile-5.png', 'ui-tile-6.png', 'ui-tile-7.png', 'ui-tile-8.png', 'ui-tile-9.png', 'ui-tile-arrows.png', 'ui-tile-pause.png', 'ui-tile-empty.png', 'ui-tile-move.png', 'ui-tile-spells.png', 'ui-tile-outline.png', 'ui-tile-outline-dark.png', 'ui-tile-background.png', 'ui-tile-background-dark.png', 'ui-tile-active-move.png', 'ui-tile-hover-move.png', 'border-side.png', 'border-toppom.png', 'ui-divider.png'];
      toLoad.forEach(name => {
        let sprite = new Image();
        sprite.src = 'assets/sprites/' + name;
        sprite.onload = () => {
          sprites.push({name: name, sprite: sprite});
          loaded++;
          if (debug) console.log(loaded);

          if (loaded === toLoad.length) {
            if (debug) console.log('All ui sprites loaded!');
            resolve(sprites);
          }
        };
      });
    }).then(renderUI);
    resolve(sprites);
  });
}

function renderUI (sprites) { // eslint-disable-line no-unused-vars
  if (debug) console.log('UI sprites loaded, rendering UI');
  const UI_TOP = CANVAS_HEIGHT - 64;
  const UI_LEFT = 1;

  for (let i = 0; i < 13; i++) {
    let sprite;

    // The move icon is special
    if (i === 0) {
      sprite = sprites.find(sprite => sprite.name === `ui-tile-move.png`).sprite;
      context.drawImage(sprite, UI_LEFT + i * 64, UI_TOP);
    }

    // Background and outline
    if (i !== 0) context.drawImage(sprites.find(sprite => sprite.name === `ui-tile-background.png`).sprite, UI_LEFT + i * 64, UI_TOP);
    if (cursor.y > UI_TOP && (cursor.x > UI_LEFT + i * 64 && cursor.x < UI_LEFT + i * 64 + 64)) {
      if (i !== 0) {
        context.drawImage(sprites.find(sprite => sprite.name === `ui-tile-outline-dark.png`).sprite, UI_LEFT + i * 64, UI_TOP);
        if (clicking) {
          document.dispatchEvent(new Event(`ui-click-${i}`));
          context.drawImage(sprites.find(sprite => sprite.name === `ui-tile-background-dark.png`).sprite, UI_LEFT + i * 64, UI_TOP);
        }
      } else {
        context.drawImage(sprites.find(sprite => sprite.name === `ui-tile-hover-move.png`).sprite, UI_LEFT + i * 64, UI_TOP);
        if (clicking) {
          console.log(`ui-click-${i}`);
          document.dispatchEvent(new Event(`ui-click-${i}`));
          context.drawImage(sprites.find(sprite => sprite.name === `ui-tile-active-move.png`).sprite, UI_LEFT + i * 64, UI_TOP);
        }
      }
    } else {
      if (i !== 0) context.drawImage(sprites.find(sprite => sprite.name === `ui-tile-outline.png`).sprite, UI_LEFT + i * 64, UI_TOP);
    }

    // Icon
    if (i > 0 && i < 10) {
      // console.log(`ui-tile-${hover}${i}.png`);
      sprite = sprites.find(sprite => sprite.name === `ui-tile-${i}.png`).sprite;
      context.drawImage(sprite, UI_LEFT + i * 64, UI_TOP);
    } else if (i === 10) {
      sprite = sprites.find(sprite => sprite.name === `ui-tile-arrows.png`).sprite;
      context.drawImage(sprite, UI_LEFT + i * 64, UI_TOP);
    } else if (i === 11) {
      sprite = sprites.find(sprite => sprite.name === `ui-tile-spells.png`).sprite;
      context.drawImage(sprite, UI_LEFT + i * 64, UI_TOP);
    } else if (i === 12) {
      sprite = sprites.find(sprite => sprite.name === `ui-tile-pause.png`).sprite;
      context.drawImage(sprite, UI_LEFT + i * 64, UI_TOP);
    }

    // Divider
    if (i !== 0 && i !== 13) context.drawImage(sprites.find(sprite => sprite.name === `ui-divider.png`).sprite, i * 64, UI_TOP);
  }

  // Borders
  context.drawImage(sprites.find(sprite => sprite.name === `border-side.png`).sprite, 0, 0);
  context.drawImage(sprites.find(sprite => sprite.name === `border-side.png`).sprite, CANVAS_WIDTH - 2, 0);
  context.drawImage(sprites.find(sprite => sprite.name === `border-toppom.png`).sprite, 0, 0);
  context.drawImage(sprites.find(sprite => sprite.name === `border-toppom.png`).sprite, 0, UI_TOP);
  context.drawImage(sprites.find(sprite => sprite.name === `border-toppom.png`).sprite, 0, CANVAS_HEIGHT - 2);
}

function renderEffects () { // eslint-disable-line no-unused-vars
  // Render effects and other misc buddies (e.g. tooltips)

  if (moveMode) {
    context.arc(player.position.x, player.position.y, player.stats.getStat('agility') * 10, 0, 2 * Math.PI);
    context.stroke();
    if (!targetVisual) {
      targetVisual = new TargetArrow(player.position, player.stats.getStat('agility') * 10);
    }
    targetVisual.render();
  }
}
