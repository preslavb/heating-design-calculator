import Ember from 'ember';
import elementInput from 'heating-design-calculator/classes/input/components/element-input';
import floorInput from 'heating-design-calculator/classes/input/components/floor-input';
import portalInput from 'heating-design-calculator/classes/input/components/portal-input';

const roomInput = Ember.Object.extend({
  // Debugging
  debug: true,

  // Initialize
  init()
  {
    let newElement = elementInput.create({ index: 0 });
    newElement.set('roomBelongingTo', this);
    this.get('elements').pushObject(newElement);

    let newFloor = floorInput.create({ index: 0 });
    newFloor.set('roomBelongingTo', this);
    this.get('floors').pushObject(newFloor);

    let newPortal = portalInput.create({ index: 0 });
    newPortal.set('roomBelongingTo', this);
    this.get('portals').pushObject(newPortal);
  },

  // Arrays
  elements: [],
  floors: [],
  portals: [],

  // Public properties
  roomName: "",
  emitterType: "Convector",
  roomType: "Living room",
  chimneyType: "No chimney or open fire",
  length: 5,
  width: 5,
  height: 2.4,

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

  // Computed properties
  designRoomVentilationRate: Ember.computed('chimneyType', 'siteBelongingTo.buildingRegulation', 'roomType', 'width', 'height', 'length', function()
  {
    let chimneyType = this.get('chimneyType');
    let regulations = this.get('siteBelongingTo.buildingRegulation');
    let roomType = this.get('roomType');

    let width = this.get('width');
    let height = this.get('height');
    let length = this.get('length');

    if (chimneyType !== "No chimney or open fire"){
      let alternativeVentilationRate = chimneyType === "Without throat restrictor fitted to flue" ?
        ((width*height*length) <= 40 ? 5 : 4) :
        ((width*height*length) <= 40 ? 3 : 2);

      return Math.max(alternativeVentilationRate, this.get(`roomTypeVentilationRateByRegulation.${regulations}.${roomType}`));
    } else {
      return this.get(`roomTypeVentilationRateByRegulation.${regulations}.${roomType}`);
    }
  }),

  roomVolume: Ember.computed('length', 'width', 'height', function()
  {
    return this.get('length') * this.get('width') * this.get('height');
  }),

  designTemperatureDifference: Ember.computed('roomTypeDesignTemperature', 'siteBelongingTo.designExternalTemp', function()
  {
    return this.get('roomTypeDesignTemperature') - this.get('siteBelongingTo.designExternalTemp');
  }),

  roomTypeDesignTemperature: Ember.computed('roomType', function()
  {
    return this.get(`roomTypeDesignTemperatures.${this.get('roomType')}`);
  }),

  heatLoss: Ember.computed('roomVolume', 'designRoomVentilationRate', function()
  {
    if (this.get('roomVolume') > 0) {
      return ( 0.33 * this.get('roomVolume') * this.get('designRoomVentilationRate') * this.get('designTemperatureDifference') );
    }
  }),

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
      if (this.get('emitterType') === "Underfloor Heating"){
        let floorSurfaceType = this.get('_floorSurfaceType');
        return floorSurfaceType;
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

  // Constants
  roomTypeDesignTemperatures: {
    "Living room": 21,
    "Dining room": 21,
    "Bedsitting room": 21,
    "Bedroom": 18,
    "Hall and landing": 18,
    "Kitchen": 18,
    "Bathroom": 22,
    "Toilet": 18,
    "Outside": -3.8,
    "Unheated space": -3.8,
    "Adjoining dwelling": 10
  },

  roomTypeVentilationRateByRegulation: {
    "Built before 2000": {
      "Living room": 1.5,
      "Dining room": 1.5,
      "Bedsitting room": 1.5,
      "Bedroom": 1,
      "Hall and landing": 2,
      "Kitchen": 2,
      "Bathroom": 3,
      "Toilet": 3
    },
    "Built in 2000 or later with double glazing and regulatory minimum insulation": {
      "Living room": 1,
      "Dining room": 1,
      "Bedsitting room": 1,
      "Bedroom": 1,
      "Hall and landing": 1,
      "Kitchen": 1.5,
      "Bathroom": 1.5,
      "Toilet": 1.5
    },
    "Built after 2006 and complies with all current Building Regulations": {
      "Living room": 0.5,
      "Dining room": 0.5,
      "Bedsitting room": 0.5,
      "Bedroom": 0.5,
      "Hall and landing": 0.5,
      "Kitchen": 1.5,
      "Bathroom": 1.5,
      "Toilet": 1.5
    }
  },

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

  roomTypeOptions: [
    "Living room",
    "Dining room",
    "Bedsitting room",
    "Bedroom",
    "Hall and landing",
    "Kitchen",
    "Bathroom",
    "Toilet"
  ],

  chimneyTypeOptions: [
    "No chimney or open fire",
    "Without throat restrictor fitted to flue",
    "With throat restrictor fitted to flue"
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

  // Functions
  addElement(index)
  {
    this.get(`siteInput.rooms.${index}.elements`).pushObject(elementInput.create({ roomBelongingTo: this.get(`siteInput.rooms.${index}`)}));
  },

  destroyElement(index)
  {
    this.get(`siteInput.rooms.${index}.elements`).objectAt(index).destroy();
    this.get(`siteInput.rooms.${index}.elements`).removeAt(index);
  },

  addFloor(index)
  {
    this.get(`siteInput.rooms.${index}.floors`).pushObject(floorInput.create({ roomBelongingTo: this.get(`siteInput.rooms.${index}`)}));
  },

  destroyFloor(index)
  {
    this.get(`siteInput.rooms.${index}.floors`).objectAt(index).destroy();
    this.get(`siteInput.rooms.${index}.floors`).removeAt(index);
  },

  addPortal(index)
  {
    this.get(`siteInput.rooms.${index}.portals`).pushObject(portalInput.create({ roomBelongingTo: this.get(`siteInput.rooms.${index}`)}));
  },

  destroyPortal(index)
  {
    this.get(`siteInput.rooms.${index}.portals`).objectAt(index).destroy();
    this.get(`siteInput.rooms.${index}.portals`).removeAt(index);
  },
  // DEBUG
  debugObserver: Ember.observer('designRoomVentilationRate', 'siteBelongingTo.buildingRegulation', 'roomName', 'emitterType', 'temperatureFactor', 'nCoefficient', 'floorSurfaceType', 'maximumFloorSurfaceTemp', 'floorConstruction', 'activeFloorArea', 'testSite', 'roomType', 'chimneyType', 'roomTypeDesignTemperature', function()
  {
    if (this.get('debug')){
      console.log('designRoomVentilationRate: ' + this.get('designRoomVentilationRate'));
      console.log('testSite: ' + this.get('testSite'));
      console.log("roomName: " + this.get('roomName'));
      console.log("emitterType: " + this.get('emitterType'));
      console.log("roomType: " + this.get('roomType'));
      console.log("chimneyType: " + this.get('chimneyType'));
      console.log("temperatureFactor: " + this.get('temperatureFactor'));
      console.log("nCoefficient: " + this.get('nCoefficient'));
      console.log("floorSurfaceType: " + this.get('floorSurfaceType'));
      console.log("maximumFloorSurfaceTemp: " + this.get('maximumFloorSurfaceTemp'));
      console.log("floorConstruction: " + this.get('floorConstruction'));
      console.log("floorTOG: " + this.get('floorTOG'));
      console.log("activeFloorArea: " + this.get('activeFloorArea'));
      console.log('roomTypeDesignTemperature: ' + this.get('roomTypeDesignTemperature'));
    }
  })
});
export default roomInput;
