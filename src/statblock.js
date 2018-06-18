// The StatBlock class

class StatBlock { // eslint-disable-line no-unused-vars
  constructor (hp, statList) {
    this.baseMaxHp = hp;
    this.damageTaken = 0;

    this.baseStrength = 10;
    this.baseAgility = 10;
    this.baseIntelligence = 10;
    this.baseInitiative = 10;

    this.baseMovement = 20;

    this.statCalculators = {
      movement: () => {
        let agilityBonus = Math.pow(this.getStat('agility'), 0.8) * 20;
        return agilityBonus;
      }
    };

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
    let lower = stat.toLowerCase();
    let upper = lower.charAt(0).toUpperCase() + lower.substr(1);
    let value = this['base' + upper];
    if (this.statCalculators[stat]) {
      value += this.statCalculators[stat]();
    }
    return value;
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
