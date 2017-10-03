import Ember from 'ember';

export default Ember.Component.extend({
  // Public properties
  heatDuration: "Intermittent",
  designExternalTempSource: "City and altitude",
  buildingRegulation: 'Built before 2000',

  // Private properties
  _sourceCity: "Belfast",
  _altitude: 0,
  _designExternalTemperature: -10,

  // Property accessors
  sourceCity: Ember.computed('designExternalTempSource', '_sourceCity',
  {
    get(key)
    {
      if (this.get('designExternalTempSource') === "City and altitude"){
        return this.get('_sourceCity');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_sourceCity', value);
      return value;
    }
  }),

  altitude: Ember.computed('designExternalTempSource', '_altitude',
  {
    get(key)
    {
      if (this.get('designExternalTempSource') === "City and altitude"){
        return this.get('_altitude');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_altitude', value);
      return value;
    }
  }),

  // Make sure the final temperature passed to the class is valid
  designExternalTemp: Ember.computed('sourceCity', 'designExternalTempSource', '_designExternalTemperature',
  {
    get(value)
    {
      if (this.get('designExternalTempSource') === "City and altitude"){
        this.set('_designExternalTemperature', this.get(`designExternalTempByCity.${this.get('sourceCity')}`))
        return this.get(`designExternalTempByCity.${this.get('sourceCity')}`);
      } else {
        return this.get('_designExternalTemperature');
      }
    },

    set(key, value)
    {
      this.set('_designExternalTemperature', value);
      return value;
    }
  }),

  // Available options for the input dropdowns
  durationOptions: [
    "Intermittent",
    "Countinuous"
  ],

  designExternalTempSourceOptions: [
    "City and altitude",
    "Specify value"
  ],

  sourceCityOptions: [
    "Belfast",
    "Birmingham",
    "Cardif",
    "Edinburgh",
    "Glasgow",
    "London",
    "Manchester",
    "Plymouth"
  ],

  buildingRegulationOptions: [
    'Built before 2000',
    'Built in 2000 or later with double glazing and regulatory minimum insulation',
    'Built after 2006 and complies with all current Building Regulations'
  ],

  // Constants
  designExternalTempByCity: {
    'Belfast'   : -2.8,
    'Birmingham': -5.4,
    'Cardif'    : -3.4,
    'Edinburgh' : -5.8,
    'Glasgow'   : -6.5,
    'London'    : -3.8,
    'Manchester': -3.8,
    'Plymouth'  : -2
  },

  // Computed properties to check active options
  sourceIsFromCity: Ember.computed.equal('designExternalTempSource', "City and altitude"),

  // Make sure the properties are valid, and are displayed properly to the user
  altitudeObserver: Ember.observer('altitude', function()
  {
    if (this.get('altitude') < -3){
      this.set('altitude', -3);
    }
    else if (this.get('altitude') > 99) {
      this.set('altitude', 99);
    }
  }),

  // DEBUG
  /*debugObserver: Ember.observer('heatDuration', 'designExternalTempSource', 'buildingRegulation', 'sourceCity', 'altitude', 'designExternalTemp', function()
  {
    console.log("heatDuration: " + this.get('heatDuration'));
    console.log("designExternalTempSource: " + this.get('designExternalTempSource'));
    console.log("buildingRegulation: " + this.get('buildingRegulation'));
    console.log("sourceCity: " + this.get('sourceCity'));
    console.log("altitude: " + this.get('altitude'));
    console.log("designExternalTemp: " + this.get('designExternalTemp'));
  })*/
});
