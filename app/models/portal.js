import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  elementAttachedTo: DS.attr(),
  height: DS.attr('number'),
  width: DS.attr('number'),
  glazingType: DS.attr(),

  // Private properties
  _uValue: DS.attr('number'),

  // Property accessors
  uValue: Ember.compted('_uValue', 'glazingType',
  {
    get(key)
    {
      if (this.get('glazingType')){
        return this.get('glazingType.uValue');
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
