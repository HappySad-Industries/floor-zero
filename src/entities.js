// Entities

// The creature base class
class Creature { // eslint-disable-line no-unused-vars
  constructor () {
    this.name = 'Nameless';
  }
}

class Player extends Creature {
  constructor () {
    super();
    this.name = 'Player';
  }
}

var creat = new Player();
console.log(creat.name); // literally just bc otherwise Creature is marked as 'unused'
