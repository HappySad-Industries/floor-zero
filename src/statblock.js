// The StatBlock class

class StatBlock { // eslint-disable-line no-unused-vars
  constructor (hp) {
    this.baseMaxHp = hp;
    this.damageTaken = 0;
  }

  assign (entity) {
    entity.stats = this;
    this.entity = entity;
  }

  // glorified 'get a variable' functions

  maxHp () {
    return this.baseMaxHp;
  }

  hp () {
    return this.maxHp() - this.damageTaken;
  }

  // booleans

  isAlive () {
    return this.hp() > 0;
  }

  // events

  takeDamage (dmg) {
    this.damageTaken += dmg;
    console.log('Damage taken by ' + this.entity.name + ': ' + dmg + ' (Reduced to ' + this.hp() + ' HP)'); // for debugging
  }
}
