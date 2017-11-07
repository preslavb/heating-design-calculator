import Ember from 'ember';
import roomInput from 'heating-design-calculator/classes/input/room-input';

const siteInput = Ember.Object.extend({
  debug: true,

  // Initialize
  init()
  {
    let newRoom = roomInput.create({ index: 0 });
    newRoom.set('siteBelongingTo', this);
    this.get('rooms').pushObject(newRoom);
  },

  // Public properties
  heatDuration: "Intermittent",
  designExternalTempSource: "City and altitude",
  buildingRegulation: 'Built before 2000',

  rooms: [],

  // Private properties
  _designFlowTemp: 35,
  _customDesignFlowTemp: 35,
  _sourceCity: "Belfast",
  _altitude: 0,
  _designExternalTemperature: -10,

  // Property accessors
  designFlowTemp: Ember.computed('_designFlowTemp', 'customDesignFlowTemp',
  {
    get(key)
    {
      if (this.get('_designFlowTemp') === "Specify Temperature"){
        return this.get('customDesignFlowTemp');
      } else {
        return this.get('_designFlowTemp');
      }
    },

    set(key, value)
    {
      if (value !== null && value !== "Specify Temperature" && (!(!isNaN(parseFloat(value)) && isFinite(value)))){
        let split1 = value.split("≤");
        let split2 = split1[1].split("°C");
        let finalValue = parseFloat(split2[0]);

        this.set('_designFlowTemp', finalValue);
        return finalValue;
      }
      else if (value === "Specify Temperature"){
        this.set('_designFlowTemp', value);
        return this.get('customDesignFlowTemp');
      }

      return this.get('_designFlowTemp');
    }
  }),

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

  heatingMWT: Ember.computed('designFlowTemp', function()
  {
    if (this.get('_designFlowTemp') === "Specify Temperature") {
      return this.get('designFlowTemp')*13/14;
    } else {
      return this.get(`heatingMWTConstants.${this.get('designFlowTemp')}`);
    }
  }),

  // Calculate Design External Temperature
  designExternalTemp: Ember.computed('sourceCity', 'designExternalTempSource', 'altitude', 'heatDuration', '_designExternalTemperature',
  {
    get(value)
    {
      if (this.get('designExternalTempSource') === "City and altitude"){

        let temperature = this.get('heatDuration') === "Intermittent" ? this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[1] : this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[2];

        let designExternalTemperature = (temperature - (this.get('altitude') - this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[0]) * (0.6/100)) > 0 ?
        this.set('_designExternalTemp', Math.round((temperature - (this.get('altitude') - this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[0]) * (0.6/100) + 0.01)*10)/10) :
        this.set('_designExternalTemp', Math.round((temperature - (this.get('altitude') - this.get(`designExternalTempByCity.${this.get('sourceCity')}`)[0]) * (0.6/100) - 0.01)*10)/10);

        return designExternalTemperature;

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

  // Only to be used by designFlowTemp! Use designFlowTemp to access the final value.
  customDesignFlowTemp: Ember.computed('designFlowTemp', '_customDesignFlowTemp',
  {
    get(key)
    {
      if (this.get('isCustomDesignFlowTemp')){
        return this.get('_customDesignFlowTemp');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_customDesignFlowTemp', parseFloat(value));
      return parseFloat(value);
    }
  }),

  // Dropdown options
  designFlowTempOptions: [
    "≤35°C",
    "≤45°C",
    "≤55°C",
    "Specify Temperature"
  ],

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

  heatingMWTConstants: {
    35: 32.5,
    45: 41.8,
    55: 51.1
  },

  // Computed properties to check active options
  isCustomDesignFlowTemp: Ember.computed.equal('_designFlowTemp', "Specify Temperature"),
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

  roomUpdater: Ember.observer('rooms.length', function()
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
});
export default siteInput;
