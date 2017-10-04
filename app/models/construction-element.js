import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  description: DS.attr('string'),
  spaceTypeOnOtherSide: DS.attr('string'),
  length: DS.attr('number'),
  width: DS.attr('number'),
  construction: DS.attr(),
  uValue: DS.attr('number')
});
