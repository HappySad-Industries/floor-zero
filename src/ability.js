// Ability class

class Ability { // eslint-disable-line no-unused-vars
  constructor (name) {
    this.name = name;
    this.style = { };

    let obj = abilityList[name];
    if (obj) {
      for (let i in obj) {
        if (i === 'style') {
          for (let j in obj[i]) {
            this.style[j] = obj[i][j];
          }
        } else {
          this[i] = obj[i];
        }
      }
    } else {
      console.log(`Tried to create spell ${name} that does not exist in abilityList`);
    }
  }

  assign (spellbook) {
    this.spellbook = spellbook;
  }

  cast (target) {
    this.effect(target, this.spellbook.entity);
  }
}

// Stored ability information
let abilityList = { // eslint-disable-line no-unused-vars
  Fireball: {
    targetType: 'arrow',
    style: {
      strokeStyle: 'red',
      fillStyle: 'red'
    },
    effect: (target, caster) => {
      target.stats.takeDamage(caster.stats.spellPower() * 8);
    }
  }
};
