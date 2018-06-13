/* globals canvas, context, Image, creatures */

function render (sprites) { // eslint-disable-line no-unused-vars
  console.log('Rendering started');

  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  let pattern = context.createPattern(sprites.find(sprite => sprite.name === 'tile.png').sprite, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);

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
  let sprites = []; // {name, sprite}

  return new Promise((resolve, reject) => {
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
