// The StatBlock class

class StatBlock { // eslint-disable-line no-unused-vars
  constructor (hp, statList) {
    this.baseMaxHp = hp;
    this.damageTaken = 0;

    let mult = 1;
    if (this instanceof ItemStatBlock) {
      mult = 0;
    }

    this.baseStrength = 10 * mult;
    this.baseAgility = 10 * mult;
    this.baseIntelligence = 10 * mult;
    this.baseInitiative = 10 * mult;

    this.baseMovement = 20 * mult;
    this.baseAttackDamage = 2 * mult;

    this.statCalculators = {
      movement: () => {
        let agilityBonus = Math.pow(this.getStat('Agility'), 0.8) * 20;
        return agilityBonus;
      },
      attackDamage: () => {
        let strengthBonus = Math.pow(this.getStat('Strength'), 0.8) * 2;
        let weaponBonus = 0;
        if (this.entity.weapon) {
          weaponBonus += this.entity.weapon.stats.getStat('AttackDamage');
        }
        return strengthBonus + weaponBonus;
      },
      spellPower: () => {
        let intBonus = Math.pow(this.getStat('Intelligence'), 0.8) / 3;
        return intBonus;
      }
    };

    for (let i in statList) {
      let lower = i.charAt(0).toLowerCase() + i.substr(1);
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
    let lower = stat.charAt(0).toLowerCase() + stat.substr(1);
    let upper = lower.charAt(0).toUpperCase() + lower.substr(1);
    let base = 'base' + upper;
    let value = 0;
    if (this[base]) {
      value += this[base];
    }
    if (this.statCalculators[lower]) {
      value += this.statCalculators[lower]();
    }
    return Math.round(value);
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

  spellPower () {
    return this.getStat('spellPower');
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

class ItemStatBlock extends StatBlock { // eslint-disable-line no-unused-vars
  constructor (statList) {
    super(1, statList);
  }
}
