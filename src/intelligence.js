/* globals Vector, FIELD_WIDTH, FIELD_HEIGHT, player */

// Intelligence class

class Intelligence {
  assign (entity) {
    entity.intelligence = this;
    this.entity = entity;
  }

  unassign () {
    this.entity.spellbook = undefined;
    this.entity = undefined;
  }
}

class BasicIntelligence extends Intelligence { // eslint-disable-line no-unused-vars
  move () {
    return new Vector(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT);
  }
}

class RushIntelligence extends BasicIntelligence { // eslint-disable-line no-unused-vars
  move () {
    return player.position.clone();
  }
}
