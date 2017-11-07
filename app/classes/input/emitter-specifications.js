import Ember from 'ember';

const emitterSpecifications = Ember.Object.extend({
  // Debugging
  debug: true,

  // Public properties
  emitterType: "Convector",
  convectorTemperatureFactor: 0.85,

  // Private properties:
  // For Convectors
  _temperatureFactor: 0.85,

  // For Radiators
  _radiatorSurfaceFinishFactorF1: 1,
  _radiatorSurfaceFinishFactorF2: 1,
  _nCoefficient: 1.30,
  _installedEmitterSize: 2000,

  // For Underfloor Heating
  _floorTOG: 0.25,

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

  radiatorSurfaceFinishFactorF1: Ember.computed('emitterType', '_radiatorSurfaceFinishFactorF1',
  {
    get(key)
    {
      if (this.get('emitterType') === "Radiator"){
        return this.get('_radiatorSurfaceFinishFactorF1');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_radiatorSurfaceFinishFactorF1', value);
      return value;
    }
  }),

  radiatorSurfaceFinishFactorF2: Ember.computed('emitterType', '_radiatorSurfaceFinishFactorF1',
  {
    get(key)
    {
      if (this.get('emitterType') === "Radiator"){
        return this.get('_radiatorSurfaceFinishFactorF2');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_radiatorSurfaceFinishFactorF2', value);
      return value;
    }
  }),

  installedEmitterSize: Ember.computed('emitterType', '_installedEmitterSize',
  {
    get(key)
    {
      if (this.get('emitterType') === "Radiator" || this.get('emitterType') === "Convector"){
        return this.get('_installedEmitterSize');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_installedEmitterSize', value);
      return value;
    }
  }),

  // For Underfloor
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

  // Computed properties
  radiatorTemperatureFactor: Ember.computed('emitterType', 'roomBelongingTo.siteBelongingTo.heatingMWT', 'roomBelongingTo.roomTypeDesignTemperature', 'nCoefficient', function()
  {
    if (this.get('emitterType') === "Radiator") {
      let heatingMWT = this.get('roomBelongingTo.siteBelongingTo.heatingMWT');
      let roomDesignTemperature = this.get('roomBelongingTo.roomTypeDesignTemperature');
      let nCoefficient = this.get('nCoefficient');

      return Math.pow((heatingMWT - roomDesignTemperature)/50, nCoefficient);
    } else {
      return NaN;
    }
  }),

  intermittencyFactor: Ember.computed('roomBelongingTo.siteBelongingTo.heatDuration', function()
  {
    return this.get('roomBelongingTo.siteBelongingTo.heatDuration') === "Intermittent" ? 0.83 : 1;
  }),

  minimumEmitterSize: Ember.computed('emitterType', 'radiatorSurfaceFinishFactorF1', 'radiatorSurfaceFinishFactorF2', 'roomBelongingTo.siteBelongingTo.heatingMWT', 'roomBelongingTo.totalHeatLoss', 'nCoefficient', 'convectorTemperatureFactor', 'radiatorTemperatureFactor', 'intermittencyFactor', function()
  {
    let designHeatLoss = this.get('roomBelongingTo.totalHeatLoss');
    let intermittencyFactor = this.get('intermittencyFactor');

    if (this.get('emitterType') === "Radiator") {
      let radiatorSurfaceFinishFactorF1 = this.get('radiatorSurfaceFinishFactorF1');
      let radiatorSurfaceFinishFactorF2 = this.get('radiatorSurfaceFinishFactorF2');
      let radiatorTemperatureFactor = this.get('radiatorTemperatureFactor');

      return designHeatLoss / (radiatorSurfaceFinishFactorF1 * radiatorSurfaceFinishFactorF2 * intermittencyFactor * radiatorTemperatureFactor);
    }
    else if (this.get('emitterType') === "Convector") {
      let convectorTemperatureFactor = this.get('convectorTemperatureFactor');

      return designHeatLoss / (intermittencyFactor * convectorTemperatureFactor);
    }
    else {
      return NaN;
    }
  }),

  // For Underfloor Heating
  designTemperatureRestricted: Ember.computed('roomBelongingTo.isCustomMaximumSurfaceTemp', 'roomBelongingTo.maximumFloorSurfaceTemp', 'roomBelongingTo.floorSurfaceType', 'roomBelongingTo.roomTypeDesignTemperature', function()
  {
    let designRoomTemperature = this.get('roomBelongingTo.floorSurfaceType') === "Vinyl floor finish" ? 0 : this.get('roomBelongingTo.roomTypeDesignTemperature');
    let designTempRestricted = this.get('roomBelongingTo.isCustomMaximumSurfaceTemp') ?
                               this.get('roomBelongingTo.maximumFloorSurfaceTemp') :
                               (designRoomTemperature + this.get('roomBelongingTo.maximumFloorSurfaceTemp'));

    return designTempRestricted;
  }),

  requiredSystemPerformanceFactor: Ember.computed('roomBelongingTo.totalHeatLoss', 'intermittencyFactor', 'roomBelongingTo.activeFloorArea', 'heatingMWT', 'designTemperatureRestricted', function()
  {
    let designHeatLoss = this.get('roomBelongingTo.totalHeatLoss');
    let intermittencyFactor = this.get('intermittencyFactor');
    let activeFloorArea = this.get('roomBelongingTo.activeFloorArea');
    let heatingMWT = this.get('heatingMWT');
    let designRoomTemperature = this.get('roomBelongingTo.roomTypeDesignTemperature');
    let designTemperatureRestricted = this.get('designTemperatureRestricted');

    return (designHeatLoss / (intermittencyFactor * activeFloorArea)) / (designTemperatureRestricted - designRoomTemperature);
  }),

  requiredMinimumPipeSpacing: Ember.computed('', function()
  {

  }),

  // Constants
  floorConstructionRequiredMinimumPipeSpacing: {
    // Floor construction
    "Floating screed floor": {
      // TOG
      0: [6.27, 5.42, 4.70, 4.09, 3.56],
      0.25: [5.32, 4.66, 4.09, 3.60, 3.17],
      0.50: [4.63, 4.10, 3.64, 3.23, 2.88],
      0.75: [4.10, 3.66, 3.28, 2.95, 2.65],
      1: [3.68, 3.32, 3.00, 2.71, 2.46],
      1.25: [3.34, 3.04, 2.76, 2.52, 2.30],
      1.5: [3.06, 2.80, 2.56, 2.35, 2.16],
      1.75: [2.83, 2.60, 2.39, 2.20, 2.03],
      2: [2.62, 2.43, 2.24, 2.08, 1.92]
    },
    "Floating dry floor including 18 mm chipboard": {
      // TOG
      0: [NaN, 3.60, 3.34, 3.04, 2.73],
      0.25: [NaN, 3.26, 3.04, 2.79, 2.51],
      0.50: [NaN, 2.98, 2.78, 2.57, 2.33],
      0.75: [NaN, 2.74, 2.57, 2.38, 2.17],
      1: [NaN, 2.53, 2.39, 2.22, 2.04],
      1.25: [NaN, 2.36, 2.23, 2.08, 1.92],
      1.5: [NaN, 2.21, 2.09, 1.96, 1.81],
      1.75: [NaN, 2.07, 1.97, 1.85, 1.71],
      2: [NaN, 1.95, 1.86, 1.75, 1.63]
    },
    "Floating dry floor including 18 mm gypsum fibreboard": {
      // TOG
      0: [NaN, 5.58, 5.10, 4.58, 4.04],
      0.25: [NaN, 4.80, 4.43, 4.02, 3.59],
      0.50: [NaN, 4.21, 3.91, 3.58, 3.23],
      0.75: [NaN, 3.75, 3.50, 3.23, 2.94],
      1: [NaN, 3.38, 3.17, 2.94, 2.69],
      1.25: [NaN, 3.07, 2.89, 2.70, 2.48],
      1.5: [NaN, 2.82, 2.66, 2.49, 2.31],
      1.75: [NaN, 2.60, 2.47, 2.32, 2.15],
      2: [NaN, 2.42, 2.30, 2.16, 2.02]
    }
  },

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

  // DEBUG
  debugObserver: Ember.observer(function()
  {
    if(this.get('debug'))
    {
    }
  })
});
export default emitterSpecifications;
