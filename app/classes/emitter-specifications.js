import Ember from 'ember';

const emitterSpecifications = Ember.Object.extend({
  // Debugging
  debug: true,

  // Public properties
  rooms: [],

  // Private properties
  _designFlowTemp: 35,
  _customDesignFlowTemp: 35,

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
      if (value != null && value != "Specify Temperature" && (!(!isNaN(parseFloat(value)) && isFinite(value)))){
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

  // Computed properties to check active options
  isCustomDesignFlowTemp: Ember.computed.equal('_designFlowTemp', "Specify Temperature"),

  // DEBUG
  debugObserver: Ember.observer('designFlowTemp', function()
  {
    if(this.get('debug'))
    {
      console.log(this.get('designFlowTemp'));
    }
  })
});
export default emitterSpecifications;
