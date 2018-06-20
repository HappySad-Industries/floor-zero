/* globals Ability */

// Spellbook class

class Spellbook { // eslint-disable-line no-unused-vars
  constructor (list) {
    this.spells = [];
    for (let i in list) {
      let spell = new Ability(list[i]);
      spell.assign(this);
      this.spells.push(spell);
    }
  }

  assign (entity) {
    entity.spellbook = this;
    this.entity = entity;
  }

  unassign () {
    this.entity.spellbook = undefined;
    this.entity = undefined;
  }

  getSpell (name) {
    for (let i in this.spells) {
      if (this.spells[i].name === name) {
        return this.spells[i];
      }
    }
    return false;
  }
}
