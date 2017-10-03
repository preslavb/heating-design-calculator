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

  // Private properties
  _uValue: DS.attr('number'),

  // Property accessors
  uValue: Ember.computed('construction', '_uValue',
  {
    get(key)
    {
      if (this.get('construction')){
        return this.get('construction.uValue');
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
