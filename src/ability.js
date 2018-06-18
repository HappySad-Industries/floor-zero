// Ability class

class Ability { // eslint-disable-line no-unused-vars
  constructor (name) {
    this.name = name;
    this.targetType = 'arrow';

    this.style = { };
  }

  cast (target) {
    this.effect(target);
  }
}

class Fireball extends Ability { // eslint-disable-line no-unused-vars
  constructor () {
    super('Fireball');
    this.style.strokeStyle = 'red';
    this.style.fillStyle = 'red';
  }

  effect (target) {
    target.stats.takeDamage(8);
  }
}
