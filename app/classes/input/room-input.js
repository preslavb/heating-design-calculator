import Ember from 'ember';

const roomInput = Ember.Object.extend({
  // Debugging
  debug: true,

  // Public properties
  roomName: "",
  emitterType: "Convector",
  elements: [ "testElement"],

  // Private properties:
  // For Convectors
  _temperatureFactor: 0.85,

  // For Radiators
  _nCoefficient: 1.30,

  // For Underfloor Heating
  _floorSurfaceType: "Normally occupied space",
    _maximumFloorSurfaceTemp: 20,
  _floorConstruction: "Floating screed floor",
  _floorTOG: 0.25,
  _activeFloorArea: 25,

  // Public accessors
  // For Convectors
  temperatureFactor: Ember.computed('emitterType', '_temperatureFactor',
  {
    get(key)
    {
      if (this.get('emitterType') === "Convector"){
        return this.get('_temperatureFactor');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_temperatureFactor', value);
      return value;
    }
  }),

  // For Radiators
  nCoefficient: Ember.computed('emitterType', '_nCoefficient',
  {
    get(key)
    {
      if (this.get('emitterType') === "Radiator"){
        return this.get('_nCoefficient');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_nCoefficient', value);
      return value;
    }
  }),

  // For Underfloor
  floorSurfaceType: Ember.computed('emitterType', '_floorSurfaceType',
  {
    get(key)
    {
      let debug1 = this.get('emitterType') === "Underfloor Heating";
      if (this.get('emitterType') === "Underfloor Heating"){
        let debug2 = this.get('_floorSurfaceType');
        return debug2;
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_floorSurfaceType', value);
      return value;
    }
  }),
    // For floor surface type set to custom temperature
    maximumFloorSurfaceTemp: Ember.computed('floorSurfaceType', '_maximumFloorSurfaceTemp',
    {
      get(key)
      {
        if (this.get('floorSurfaceType') === "Specify Maximum Floor Surface Temperature (°C)"){
          return this.get('_maximumFloorSurfaceTemp');
        } else {
          return NaN;
        }
      },

      set(key, value)
      {
        this.set('_maximumFloorSurfaceTemp', value);
        return value;
      }
    }),

  floorConstruction: Ember.computed('emitterType', '_floorConstruction',
  {
    get(key)
    {
      if (this.get('emitterType') === "Underfloor Heating"){
        return this.get('_floorConstruction');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_floorConstruction', value);
      return value;
    }
  }),

  floorTOG: Ember.computed('emitterType', '_floorTOG',
  {
    get(key)
    {
      if (this.get('emitterType') === "Underfloor Heating"){
        return this.get('_floorTOG');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_floorTOG', value);
      return value;
    }
  }),

  activeFloorArea: Ember.computed('emitterType', '_activeFloorArea',
  {
    get(key)
    {
      if (this.get('emitterType') === "Underfloor Heating"){
        return this.get('_activeFloorArea');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_activeFloorArea', value);
      return value;
    }
  }),

  // Dropdown options
  emitterTypeOptions: [
    "Convector",
    "Radiator",
    "Underfloor Heating"
  ],

  floorSurfaceTypeOptions: [
    "Normally occupied space",
    "Peripheral zones",
    "Vinyl floor finish",
    "Specify Maximum Floor Surface Temperature (°C)"
  ],

  floorConstructionOptions: [
    "Floating screed floor",
    "Floating dry floor inc. 18 mm chipboard",
    "Floating dry floor inc. 18 mm gypsum fibreboard"
  ],

  // Computed properties to check active options
  isConvector: Ember.computed('emitterType', function()
  {
    return this.get('emitterType') === "Convector";
  }),

  isRadiator: Ember.computed('emitterType', function()
  {
    return this.get('emitterType') === "Radiator";
  }),

  isUnderfloor: Ember.computed('emitterType', function()
  {
    return this.get('emitterType') === "Underfloor Heating";
  }),
    // Only ever accessible if isUnderfloor
    isCustomMaximumSurfaceTemp: Ember.computed('_floorSurfaceType', function()
    {
      return this.get('_floorSurfaceType') === "Specify Maximum Floor Surface Temperature (°C)";
    }),

  // DEBUG
  debugObserver: Ember.observer('roomName', 'emitterType', 'temperatureFactor', 'nCoefficient', 'floorSurfaceType', 'maximumFloorSurfaceTemp', 'floorConstruction', 'activeFloorArea', 'testSite', function()
  {
    if (this.get('debug')){
      console.log('testSite: ' + this.get('testSite'));
      console.log("roomName: " + this.get('roomName'));
      console.log("emitterType: " + this.get('emitterType'));
      console.log("temperatureFactor: " + this.get('temperatureFactor'));
      console.log("nCoefficient: " + this.get('nCoefficient'));
      console.log("floorSurfaceType: " + this.get('floorSurfaceType'));
      console.log("maximumFloorSurfaceTemp: " + this.get('maximumFloorSurfaceTemp'));
      console.log("floorConstruction: " + this.get('floorConstruction'));
      console.log("floorTOG: " + this.get('floorTOG'));
      console.log("activeFloorArea: " + this.get('activeFloorArea'));
    }
  })
});
export default roomInput;
