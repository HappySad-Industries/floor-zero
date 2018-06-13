// The StatBlock class

class StatBlock { // eslint-disable-line no-unused-vars
  constructor (hp, statList) {
    this.baseMaxHp = hp;
    this.damageTaken = 0;

    this.baseStrength = 10;
    this.baseAgility = 10;
    this.baseIntelligence = 10;
    this.baseInitiative = 10;

    for (let i in statList) {
      let lower = i;
      let upper = lower.charAt(0).toUpperCase() + lower.substr(1);
      this['base' + upper] = statList[i];
    }
  }

  assign (entity) {
    entity.stats = this;
    this.entity = entity;
  }

  // glorified 'get a variable' functions

  getStat (stat) {
    let lower = stat;
    let upper = lower.charAt(0).toUpperCase() + lower.substr(1);
    return this['base' + upper];
  }

  maxHp () {
    return this.getStat('maxHp');
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
    console.log(`Damage taken by ${this.entity.name}: ${dmg} (Reduced to ${this.hp()} HP)`); // for debugging
  }
}
