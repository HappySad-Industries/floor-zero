/* globals canvas, context, Image, creatures */

function render () { // eslint-disable-line no-unused-vars
  console.log('Rendering started');

  let tile = new Image();
  tile.src = 'assets/sprites/tile.png';
  tile.onload = event => {
    let pattern = context.createPattern(tile, 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  for (let i = 0; i < creatures.length; i++) {
    let creature = creatures[i];

    let sprite = new Image();
    sprite.src = 'assets/sprites/' + creature.sprite;
    sprite.onload = () => {
      context.drawImage(sprite, creature.position.x, creature.position.y);
    };
  }
}
