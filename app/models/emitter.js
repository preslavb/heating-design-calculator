import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  type: DS.attr('string'),
  temperatureFactor: DS.attr('number'),
  nCoefficient: DS.attr('number'),
  floorSurfaceType: DS.attr('string'),
  floorConstruction: DS.attr('string'),
  floorTOG: DS.attr('number'),
  activeFloorArea: DS.attr('number')
});
