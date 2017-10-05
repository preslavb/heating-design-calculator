import Ember from 'ember';

const floorInput = Ember.Object.extend({
  // Public properties
  shortLength: 5,
  longLength: 5,
  edgesExposed: 'Two adjacent edges',
  insulationType: 'Solid floor - Enter a U-value',

  // Private properties
  _uValue: 0.15,

  // Property accessors
  uValue: Ember.computed('insulationType', {
    get(key)
    {
      if (this.get('isCustomInsulation')){
        return this.get('_uValue');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_uValue', value);
      return value;
    }
  }),

  // Dropdown options
  edgesExposedOptions: [
    "Two adjacent edges",
    "One edge (short)",
    "One edge (long)",
    "Two opposite edges",
    "Three edges (short outer edge)",
    "Three edges (long outer edge)"
  ],

  insulationTypeOptions: [
    "Solid floor - Enter a U-value",
    "Suspended floor - Enter U-value",
    "Solid no insulation",
    "Solid 25mm insulation",
    "Solid 50mm insulation",
    "Solid 75mm insulation",
    "Solid 100mm insulation",
    "Suspended no insulation",
    "Suspended 25mm insulation",
    "Suspended 50mm insulation",
    "Suspended 75mm insulation",
    "Suspended 100mm insulation"
  ],

  // Computed properties to check active options
  isCustomInsulation: Ember.computed('insulationType', function()
  {
    return(this.get('insulationType') === "Solid floor - Enter a U-value" || this.get('insulationType') === "Suspended floor - Enter U-value");
  }),

  // DEBUGGER
  debugObserver: Ember.observer('shortLength', 'longLength', 'edgesExposed', 'insulationType', 'uValue', function()
  {
    console.log('shortLength: ' + this.get('shortLength'));
    console.log('longLength: ' + this.get('longLength'));
    console.log('edgesExposed: ' + this.get('edgesExposed'));
    console.log('insulationType: ' + this.get('insulationType'));
    console.log('uValue: ' + this.get('uValue'));
  })
});
export default floorInput;
