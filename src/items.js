/* globals Entity, ItemStatBlock */

class Item extends Entity { // eslint-disable-line no-unused-vars
  constructor () {
    super();
    this.name = 'Sword';
    this.addStats(new ItemStatBlock());
  }

  equip (creature) {
    this.creature.equipment.addItem(this);
  }

  unequip () {
    this.creature.equipment.removeItem(this);
  }
}

class EquipmentSet { // eslint-disable-line no-unused-vars
  constructor (items) {
    this.items = [];
    for (let i in items) {
      this.items.push(items[i]);
    }
  }

  assign (creature) {
    this.creature = creature;
    creature.equipment = this;
  }

  unassign () {
    this.creature.equipment = undefined;
    this.creature = undefined;
  }

  addItem (item) {
    this.items.push(item);
    item.equipment = this;
    console.log(`${this.creature.name} equipped ${item.name}.`);
  }

  removeItem (item) {
    let idx = this.items.indexOf(item);
    if (idx > -1) {
      this.items.splice(idx, 1);
      item.equipment = undefined;
      console.log(`${this.creature.name} unequipped ${item.name}.`);
    }
  }

  getStat (stat) {
    let value = 0;
    for (let i in this.items) {
      value += this.items[i].stats.getStat(stat);
    }
    return value;
  }
}
