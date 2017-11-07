import Ember from 'ember';

const portalInput = Ember.Object.extend({
  // Public properties
  partOfString: "0 New Element",
  height: 0.9,
  width: 1.6,
  frameType: "Enter a U-value",

  // Private properties
  _uValue: 0.15,

  // Computed properties
  area: Ember.computed('height', 'width', function()
  {
    return this.get('height') * this.get('width');
  }),

  partOf: Ember.computed('partOfString', function()
  {
    let index = this.get('partOfString').split(" ")[0];

    return this.get(`roomBelongingTo.elements.${index}`);
  }),

  heatLoss: Ember.computed('uValue', 'partOf.uValue', 'partOf.designTemperatureDifference', function()
  {
    this.set('partOf.roomBelongingTo.partsUpdated', Date());
    return this.get('uValue') * this.get('partOf.designTemperatureDifference') * (this.get('uValue') - this.get('partOf.uValue'));
  }),

  // Property accessors
  uValue: Ember.computed('frameType', {
    get(key)
    {
      if (this.get('isCustomFrameType')){
        return this.get('_uValue');
      } else {
        return this.get(`frameTypeValues.${this.get('frameType')}`);
      }
    },

    set(key, value)
    {
      this.set('_uValue', value);
      return value;
    }
  }),

  // Constants
  frameTypeValues: {
    "Enter a U-value": 0.15,
    "Wood/PVC Single": 4.8,
    "Wood/PVC Double": 2.8,
    "Wood/PVC Double, low-E glass": 2.3,
    "Wood/PVC Double, low-E glass, argon filled": 2.1,
    "Wood/PVC Triple": 2.1,
    "Wood/PVC Triple, low-E glass": 1.7,
    "Wood/PVC Triple, low-E glass, argon filled": 1.6,
    "Metal Single": 5.7,
    "Metal Double": 3.4,
    "Metal Double, low-E glass": 2.8,
    "Metal Double, low-E glass, argon filled": 2.6,
    "Metal Triple": 2.6,
    "Metal Triple, low-E glass": 2.1,
    "Metal Triple, low-E glass, argon filled": 2,
    "Secondary glazing": 2.4,
    "Solid Wood Door (External)": 3,
    "Solid Wood Door To Unheated Corridor": 1.4
  },

  // Dropdown options
  partOfOptions: Ember.computed('roomBelongingTo.elements.length', function()
  {
    let newArray = [];
    let elements = this.get('roomBelongingTo.elements');

    elements.forEach( element => {
       newArray.pushObject(element);
    })

    return newArray;
  }),

  frameTypeOptions: [
    "Enter a U-value",
    "Wood/PVC Single",
    "Wood/PVC Double",
    "Wood/PVC Double, low-E glass",
    "Wood/PVC Double, low-E glass, argon filled",
    "Wood/PVC Triple",
    "Wood/PVC Triple, low-E glass",
    "Wood/PVC Triple, low-E glass, argon filled",
    "Metal Single",
    "Metal Double",
    "Metal Double, low-E glass",
    "Metal Double, low-E glass, argon filled",
    "Metal Triple",
    "Metal Triple, low-E glass",
    "Metal Triple, low-E glass, argon filled",
    "Secondary glazing",
    "Solid Wood Door (External)",
    "Solid Wood Door To Unheated Corridor"
  ],

  // Computed properties to check active options
  isCustomFrameType: Ember.computed('frameType', function()
  {
    return(this.get('frameType') === "Enter a U-value");
  }),

  // DEBUGGER
  debugObserver: Ember.observer('shortLength', 'longLength', 'edgesExposed', 'insulationType', 'uValue', function()
  {
    console.log('partOf: ' + this.get('partOf'));
    console.log('height: ' + this.get('height'));
    console.log('width: ' + this.get('width'));
    console.log('frameType: ' + this.get('frameType'));
    console.log('uValue: ' + this.get('uValue'));
  }),
});
export default portalInput;
