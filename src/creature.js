// the creature class

class Creature {
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
