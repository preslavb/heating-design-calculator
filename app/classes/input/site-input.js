import Ember from 'ember';
import roomInput from 'heating-design-calculator/classes/input/room-input';

const siteInput = Ember.Object.extend({
  debug: true,

  // Initialize

  init()
  {
    let newRoom = roomInput.create();
    newRoom.set('siteBelongingTo', this);
    this.get('rooms').pushObject(newRoom);
  },

  // Public properties
  heatDuration: "Intermittent",
  designExternalTempSource: "City and altitude",
  buildingRegulation: 'Built before 2000',

  rooms: [],

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

  // Calculate Design External Temperature
  designExternalTemp: Ember.computed('sourceCity', 'designExternalTempSource', 'altitude', 'heatDuration', '_designExternalTemperature',
  {
    get(value)
    {
      if (this.get('designExternalTempSource') === "City and altitude"){
        let temperature = this.get('heatDuration') === "Intermittent" ? this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[1] : this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[2];
        this.set('_designExternalTemp', temperature - (this.get('altitude') - this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[0]) * (0.6/100));
        return this.get('_designExternalTemp');
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

  // Dropdown options
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
    'Belfast'   : [68, -2.6, -1.2],
    'Birmingham': [96, -5.4, -3.4],
    'Cardif'    : [67, -3.2, -1.6],
    'Edinburgh' : [35, -5.4, -3.4],
    'Glasgow'   : [5, -5.9, -3.9],
    'London'    : [25, -3.3, -1.8],
    'Manchester': [75, -3.6, -2.2],
    'Plymouth'  : [27, -1.6, -0.2],
  },

  // Computed properties to check active options
  sourceIsFromCity: Ember.computed.equal('designExternalTempSource', "City and altitude"),

  // Make sure the properties are valid, and are displayed properly to the user
  altitudeObserver: Ember.observer('altitude', function()
  {
    if (this.get('altitude') < -3){
      this.set('altitude', -3);
    }
    else if (this.get('altitude') > 999) {
      this.set('altitude', 999);
    }
  }),

  altitudeObserver: Ember.observer('rooms.length', function()
  {
    this.get('rooms').forEach( room => room.set('siteBelongingTo', this));
  }),

  // DEBUG
  debugObserver: Ember.observer('heatDuration', 'designExternalTempSource', 'buildingRegulation', 'sourceCity', 'altitude', 'designExternalTemp', function()
  {
    if (this.get('debug')){
      console.log("heatDuration: " + this.get('heatDuration'));
      console.log("designExternalTempSource: " + this.get('designExternalTempSource'));
      console.log("buildingRegulation: " + this.get('buildingRegulation'));
      console.log("sourceCity: " + this.get('sourceCity'));
      console.log("altitude: " + this.get('altitude'));
      console.log("designExternalTemp: " + this.get('designExternalTemp'));
    }
  })
})
export default siteInput;
