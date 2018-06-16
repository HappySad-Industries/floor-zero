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

  unassign () {
    this.entity.stats = undefined;
    this.entity = undefined;
  }

  // glorified 'get a variable' functions

  getStat (stat) {
    let lower = stat;
    let upper = lower.charAt(0).toUpperCase() + lower.substr(1);
    return this['base' + upper];
  }

  getResource (resource) {
    return this.getStat(resource) - this[resource + 'Spent'];
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

  spendResource (resource, amount) {
    if (resource !== 'hp') {
      this[resource + 'Spent'] += amount;
      console.log(`${this.entity.name} spent ${amount} ${resource} (Reduced to ${this.getResource(resource)})`);
    } else {
      this['damageTaken'] += amount;
    }
  }

  takeDamage (dmg) {
    this.spendResource('hp', dmg);
    console.log(`Damage taken by ${this.entity.name}: ${dmg} (Reduced to ${this.hp()} HP)`); // for debugging
  }
}
