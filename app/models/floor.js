import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  shortLength: DS.attr('number'),
  longLength: DS.attr('number'),
  edgesExposed: DS.attr('string'),
  insulation: DS.attr('number'),

  // Private properties
  _uValue: DS.attr('number'),

  // Property accessors
  uValue: Ember.computed('insulation', '_uValue',
  {
    get(key)
    {
      if (this.get('insulation')){
        return this.get('insulation.uValue');
      } else {
        return this.get('_uValue');
      }
    },

    set(key, value)
    {
      this.set('_uValue', value);
    }
  })
});
