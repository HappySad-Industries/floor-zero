// Spellbook class

class Spellbook { // eslint-disable-line no-unused-vars
  constructor (list) {
    this.spells = list.slice();
  }

  assign (entity) {
    entity.spellbook = this;
    this.entity = entity;
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
