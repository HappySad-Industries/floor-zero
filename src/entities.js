// Entities

// The creature base class
class Creature { // eslint-disable-line no-unused-vars
  constructor () {
    this.name = 'Nameless';
  }
}

// The player class
class Player extends Creature { // eslint-disable-line no-unused-vars
  constructor () {
    super();
    this.name = 'Player';
  }
}
