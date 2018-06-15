/* globals StatBlock, Vector, Spellbook */

// Entities

// Entity base class, used for anything with physical presence in combat
class Entity { // eslint-disable-line no-unused-vars
  constructor () {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0); // Generally sticks to 0 except for animations (e.g. arrow flying)
  }
}

// The creature base class
class Creature extends Entity { // eslint-disable-line no-unused-vars
  constructor () {
    super();
    this.name = 'Nameless';
    this.addStats(new StatBlock(20));
    this.sprite = 'baddie.png';
    this.alignment = 'Neutral';
    this.maxActionTimer = 100;
    this.actionTimer = this.maxActionTimer;
    this.moveTarget = false;
  }

  addStats (stats) {
    stats.assign(this);
    return this;
  }

  addSpellbook (spells) {
    if (spells instanceof Spellbook) {
      spells.assign(this);
    } else {
      (new Spellbook(spells)).assign(this);
    }
  }

  moveTo () {
    if (arguments.length === 1) {
      // Only one argument is specified, an object {x: x, y: y}
      // e.g. `creature.moveTo({x: 10, y: 50})`
      this.position = arguments[0];
    } else {
      // Two arguments specified, an x and a y
      // e.g. `creature.moveTo(10, 50)`
      this.position = {x: arguments[0], y: arguments[1]};
    }
    this.moveTarget = false;
    return this;
  }

  move (target) { // Target is a Vector
    let maxMovement = 10 * this.stats.getStat('agility');
    if (this.position === target) {
      this.moveTarget = false;
    } else {
      if (this.position.to(target).magnitude() > maxMovement) {
        let moveDir = this.position.to(target).unit(maxMovement);
        this.moveTarget = this.position.add(moveDir);
      } else {
        this.moveTarget = this.position.to(target);
      }
    }
  }
}

// The player class
class Player extends Creature { // eslint-disable-line no-unused-vars
  constructor () {
    super();
    this.name = 'Player';
    this.sprite = 'friend.png';
    this.alignment = 'Ally';
  }
}

// The enemy class
class Enemy extends Creature { // eslint-disable-line no-unused-vars
  constructor () {
    super();
    this.name = 'Villain';
    this.alignment = 'Enemy';
  }
}
