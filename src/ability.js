// Ability class

class Ability { // eslint-disable-line no-unused-vars
  constructor (name) {
    this.name = name;
  }

  cast (target) {
    this.effect(target);
  }
}

class Fireball extends Ability { // eslint-disable-line no-unused-vars
  constructor () {
    super('Fireball');
  }

  effect (target) {
    target.stats.takeDamage(8);
  }
}
