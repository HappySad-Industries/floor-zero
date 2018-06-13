// Entities

// The creature base class
class Creature { // eslint-disable-line no-unused-vars
  constructor () {
    this.name = 'Nameless';
    this.position = {x: 0, y: 0};
    this.sprite = 'baddie.png';
  }

  addStats (stats) {
    stats.assign(this);
  }

  moveTo () {
    if (arguments.length === 1) {
      this.position = arguments[0];
    } else {
      this.position = {x: arguments[0], y: arguments[1]};
    }
  }
}

// The player class
class Player extends Creature { // eslint-disable-line no-unused-vars
  constructor () {
    super();
    this.name = 'Player';
    this.sprite = 'friend.png';
  }
}
