import Ember from 'ember';

const floorInput = Ember.Object.extend({
  // Public properties
  shortLength: 5,
  longLength: 5,
  edgesExposed: 'Two adjacent edges',
  insulationType: 'Solid floor - Enter a U-value',

  // Private properties
  _uValue: 0.15,

  // Computed properties
  area: Ember.computed('shortLength', 'longLength', function()
  {
    return this.get('shortLength') * this.get('longLength');
  }),

  solidOrSuspended: Ember.computed('insulationType', function()
  {
    return this.get('insulationType').indexOf('Solid') > -1 ? "solid" : "suspended";
  }),

  designTemperatureDifference: Ember.computed('spaceTypeOnOtherSide', 'roomBelongingTo.roomTypeDesignTemperature', 'roomBelongingTo.siteBelongingTo.designExternalTemp', 'solidOrSuspended', function()
  {
    let designTemperature = (this.get('solidOrSuspended') === "solid") ? 10 : this.get('roomBelongingTo.siteBelongingTo.designExternalTemp');
    let roomDesignTemperature = this.get('roomBelongingTo.roomTypeDesignTemperature');

    return roomDesignTemperature - designTemperature;
  }),

  insulationThickness: Ember.computed('designTemperatureDifference', function()
  {
    let thickness = 0;

    if (this.get('insulationType') != "Solid floor - Enter a U-value" && this.get('insulationType') != "Suspended floor - Enter U-value") {
      if (this.get('insulationType').indexOf("mm") > -1) {
        let thicknessStrings = this.get('insulationType').split(' ');
        thickness = parseFloat(thicknessStrings[1]);
      } else {
        thickness = 0;
      }
    } else {
      thickness = NaN;
    }
    return thickness;
  }),

  uValueByInsulationType: Ember.computed('solidOrSuspended', 'shortLength', 'longLength', 'edgesExposed', function()
  {
    let solidOrSuspended = this.get('solidOrSuspended');
    let edgesExposed = this.get('edgesExposed');
    let shortLength = this.get('shortLength');
    let longLength = this.get('longLength');
    let insulationThickness = this.get('insulationThickness') / 25;

    let formulaToUse;

    switch(edgesExposed) {
      case "Two adjacent edges":
        formulaToUse = parseFloat(shortLength) + parseFloat(longLength);
        break;
      case "Two opposite edges":
        formulaToUse = parseFloat(shortLength);
        break;
      case "Three edges (short outer edge)":
        formulaToUse = (shortLength + "." + longLength);
        break;
      case "Three edges (long outer edge)":
        formulaToUse = (shortLength + "." + longLength);
        break;
      case "One edge (long)":
        formulaToUse = parseFloat(longLength);
        break;
      case "One edge (short)":
        formulaToUse = parseFloat(shortLength);
        break;
    }

    let dataSet = "";

    if (! (edgesExposed.indexOf("Three edges") > -1)) {
      let keys = (Object.keys(this.get(`uValuesByInsulationType.${solidOrSuspended}.${edgesExposed}`)));
      let firstKey = keys[0];
      let lastKey = keys[keys.length - 1];

      if (formulaToUse < firstKey.split('-')[0]) {
        dataSet = firstKey;
      }

      else if (formulaToUse >= lastKey.split('-')[1]) {
        dataSet = lastKey;
      }

      else {
        keys.forEach( key => {
          let splitKey = key.split('-');

          if (formulaToUse >= splitKey[0] && formulaToUse < splitKey[1]) {
            dataSet = key;
          }
        });
      }
    }

    else {
      dataSet = formulaToUse;
    }

    let uValue = this.get(`uValuesByInsulationType.${solidOrSuspended}.${edgesExposed}.${dataSet}.${insulationThickness}`);

    return uValue;
  }),

  heatLoss: Ember.computed('uValue', 'designTemperatureDifference', 'area', function()
  {
    return this.get('uValue') * this.get('designTemperatureDifference') * this.get('area');
  }),

  // Property accessors
  uValue: Ember.computed('uValueByInsulationType', '_uValue', 'isCustomInsulation', {
    get(key)
    {
      if (this.get('isCustomInsulation')){
        return this.get('_uValue');
      } else {
        return this.get('uValueByInsulationType');
      }
    },

    set(key, value)
    {
      this.set('_uValue', value);
      return value;
    }
  }),

  // Constants
  uValuesByInsulationType: {
    "solid" : {
      "Two adjacent edges" : {
        "5-6" : [1.02, 0.58,	0.41,	0.31,	0.26],
        "6-7" : [0.9,	0.54,	0.39,	0.3, 0.25],
        "7-8" : [0.82,0.51,	0.37,	0.29,	0.24],
        "8-9" : [0.76, 0.49,	0.36,	0.28,	0.23],
        "9-10" : [0.7, 0.46,	0.34,	0.27,	0.23],
        "10-12" : [0.6,	0.41,	0.32,	0.26,	0.22],
        "12-14" : [0.52, 0.38,	0.29,	0.24,	0.21],
        "14-17" : [0.45, 0.34,	0.27,	0.23,	0.19],
        "17-20" : [0.39, 0.3,	0.25,	0.21,	0.18]
      },
      "Two opposite edges" : {
        "2-3" : [1.15,	0.62,	0.43,	0.32,	0.26,],
        "3-4" : [0.9,	0.54,	0.39,	0.3,	0.25,],
        "4-5" : [0.73,	0.47,	0.35,	0.28,	0.23,],
        "5-6" : [0.62,	0.43,	0.32,	0.26,	0.22,],
        "6-8" : [0.55,	0.39,	0.3,	0.25,	0.21,],
        "8-10" : [0.44,	0.33,	0.27,	0.22,	0.19,]
      },
      "Three edges (short outer edge)" : {
        "3": { "3" : [1.15,	0.62,	0.43,	0.32,	0.26,],
               "4" : [1.03,	0.58,	0.41,	0.31,	0.26,],
               "6" : [1,	0.57,	0.4,	0.31,	0.25,],
               "8" : [0.96,	0.56,	0.4,	0.31,	0.25,] },
        "4": { "4" : [0.95,	0.56,	0.4,	0.31,	0.25,],
               "6" : [0.85,	0.52,	0.38,	0.29,	0.24,] },
        "5": { "5" : [0.81,	0.51,	0.37,	0.29,	0.24,],
               "7" : [0.74,	0.48,	0.35,	0.28,	0.23,] },
        "6": { "6" : [0.71,	0.46,	0.35,	0.28,	0.23,],
               "8" : [0.65,	0.44,	0.33,	0.27,	0.22,] }
      },
      "Three edges (long outer edge)" : {
        "3": {"3" : [1.05,	0.59,	0.41,	0.32,	0.26,],
              "5" : [0.9,	0.54,	0.39,	0.3,	0.25,],
              "7" : [0.85,	0.52,	0.38,	0.29,	0.24,],
              "9" : [0.77,	0.49,	0.36,	0.28,	0.24,] },
        "4": {"4" : [0.95,	0.56,	0.4,	0.31,	0.25,],
              "6" : [0.87,	0.53,	0.38,	0.3,	0.24,],
              "8" : [0.76,	0.49,	0.36,	0.28,	0.24,] },
        "5": {"5" : [0.83,	0.51,	0.37,	0.29,	0.24,],
              "7" : [0.77,	0.49,	0.36,	0.28,	0.24,],
              "9" : [0.68,	0.45,	0.34,	0.27,	0.23,] },
        "6": {"6" : [0.75,	0.48,	0.36,	0.28,	0.23,],
              "8" : [0.7,	0.46,	0.34,	0.27,	0.23,] }
      },
      "One edge (short)" : {
        "1.25-1.75" : [0.9,	0.54,	0.39,	0.3,	0.25,],
        "1.75-2" : [0.73,	0.47,	0.35,	0.28,	0.23,],
        "2-3" : [0.55,	0.39,	0.3,	0.25,	0.21,],
        "3-5" : [0.45,	0.34,	0.27,	0.23,	0.19,],
        "5-7" : [0.38,	0.3,	0.24,	0.21,	0.18,],
        "7-10" : [0.28,	0.23,	0.2,	0.17,	0.15,]
      },
      "One edge (long)" : {
        "1.25-1.75" : [0.9,	0.54,	0.39,	0.3,	0.25,],
        "1.75-2" : [0.73,	0.47,	0.35,	0.28,	0.23,],
        "2-3" : [0.55,	0.39,	0.3,	0.25,	0.21,],
        "3-5" : [0.45,	0.34,	0.27,	0.23,	0.19,],
        "5-7" : [0.38,	0.3,	0.24,	0.21,	0.18,],
        "7-10" : [0.28,	0.23,	0.2,	0.17,	0.15,]
      },
    },
    "suspended" : {
      "Two adjacent edges" : {
        "5-6" : [1.05,	0.59,	0.41,	0.32,	0.26,],
        "6-7" : [0.93,	0.55,	0.39,	0.3,	0.25,],
        "7-8" : [0.86,	0.53,	0.38,	0.3,	0.24,],
        "8-9" : [0.79,	0.5,	0.37,	0.29,	0.24,],
        "9-10" : [0.75,	0.48,	0.36,	0.28,	0.23,],
        "10-12" : [0.65,	0.44,	0.33,	0.27,	0.22,],
        "12-14" : [0.58,	0.41,	0.31,	0.25,	0.21,],
        "14-17" : [0.71,	0.37,	0.29,	0.24,	0.2,],
        "17-20" : [0.43,	0.33,	0.26,	0.22,	0.19,]
      },
      "Two opposite edges" : {
        "2-3" : [1.1,	0.61,	0.42,	0.32,	0.26,],
        "3-4" : [0.95,	0.56,	0.4,	0.31,	0.25,],
        "4-5" : [0.83,	0.51,	0.37,	0.29,	0.23,],
        "5-6" : [0.74,	0.48,	0.35,	0.26,	0.23,],
        "6-8" : [0.67,	0.45,	0.34,	0.27,	0.23,],
        "8-10" : [0.55,	0.39,	0.3,	0.25,	0.21,]
      },
      "Three edges (short outer edge)" : {
        "3": {"3" : [1.15,	0.62,	0.43,	0.32,	0.26,],
              "4" : [1.03,	0.58,	0.41,	0.31,	0.26,],
              "6" : [1,	0.57,	0.4,	0.31,	0.25,],
              "8" : [0.99,	0.56,	0.4,	0.31,	0.25,] },
        "4": {"4" : [0.95,	0.56,	0.4,	0.31,	0.25,],
              "6" : [0.87,	0.53,	0.38,	0.3,	0.24,] },
        "5": {"5" : [0.83,	0.51,	0.37,	0.29,	0.24,],
              "7" : [0.8,	0.5,	0.37,	0.29,	0.24,] },
        "6": {"6" : [0.75,	0.48,	0.36,	0.28,	0.23,],
              "8" : [0.72,	0.47,	0.35,	0.28,	0.23,] }
      },
      "Three edges (long outer edge)" : {
        "3": {"3" : [1,	0.57,	0.4,	0.31,	0.25,],
              "5" : [0.85,	0.52,	0.38,	0.29,	0.24,],
              "7" : [0.8,	0.5,	0.37,	0.29,	0.24,],
              "9" : [0.77,	0.49,	0.36,	0.28,	0.24,] },
        "4": {"4" : [0.85,	0.52,	0.38,	0.29,	0.24,],
              "6" : [0.79,	0.5,	0.37,	0.29,	0.24,],
              "8" : [0.73,	0.47,	0.35,	0.28,	0.23,] },
        "5": {"5" : [0.77,	0.49,	0.36,	0.28,	0.24,],
              "7" : [0.72,	0.47,	0.35,	0.28,	0.23,],
              "9" : [0.66,	0.44,	0.33,	0.27,	0.23,] },
        "6": {"6" : [0.69,	0.46,	0.34,	0.27,	0.23,],
              "8" : [0.67,	0.45,	0.34,	0.27,	0.23,] }
      },
      "One edge (short)" : {
        "1.25-1.75" : [1.1,	0.61,	0.42,	0.32,	0.26,],
        "1.75-2" : [0.83,	0.51,	0.37,	0.29,	0.24,],
        "2-3" : [0.67,	0.45,	0.34,	0.27,	0.23,],
        "3-5" : [0.56,	0.4,	0.31,	0.25,	0.21,],
        "5-7" : [0.48,	0.35,	0.28,	0.23,	0.2,],
        "7-10" : [0.38,	0.3,	0.24,	0.21,	0.19,]
      },
      "One edge (long)" : {
        "1.25-1.75" : [1.1,	0.61,	0.42,	0.32,	0.26,],
        "1.75-2" : [0.83,	0.51,	0.37,	0.29,	0.24,],
        "2-3" : [0.67,	0.45,	0.34,	0.27,	0.23,],
        "3-5" : [0.56,	0.4,	0.31,	0.25,	0.21,],
        "5-7" : [0.48,	0.35,	0.28,	0.23,	0.2,],
        "7-10" : [0.38,	0.3,	0.24,	0.21,	0.19,]
      },
    },
  },

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
  debugObserver: Ember.observer('shortLength', 'longLength', 'edgesExposed', 'insulationType', 'uValue', 'insulationThickness', function()
  {
    console.log('shortLength: ' + this.get('shortLength'));
    console.log('longLength: ' + this.get('longLength'));
    console.log('edgesExposed: ' + this.get('edgesExposed'));
    console.log('insulationType: ' + this.get('insulationType'));
    console.log('uValue: ' + this.get('uValue'));
  })
});
export default floorInput;
