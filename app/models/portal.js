import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  elementAttachedTo: DS.attr(),
  height: DS.attr('number'),
  width: DS.attr('number'),
  glazingType: DS.attr(),
  uValue: DS.attr('number')
});
