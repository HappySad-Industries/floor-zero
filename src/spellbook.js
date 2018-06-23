/* globals Ability */

// Spellbook class

class Spellbook { // eslint-disable-line no-unused-vars
  constructor (list, excludeAttack = false) {
    this.spells = [];
    if (!excludeAttack) {
      this.addSpell(new Ability('BasicAttack'));
    }
    for (let i in list) {
      this.addSpell(new Ability(list[i]));
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

  addSpell (spell) {
    spell.assign(this);
    this.spells.push(spell);
  }

  removeSpell (spell) {
    let idx = this.spells.indexOf(spell);
    if (idx > -1) {
      spell.unassign();
      this.spells.splice(idx, 1);
    }
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
