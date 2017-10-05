import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  shortLength: DS.attr('number'),
  longLength: DS.attr('number'),
  edgesExposed: DS.attr('string'),
  insulation: DS.attr('number'),
  uValue: DS.attr('number')
});
