import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // Public properties
  roomBelongingTo: DS.belongsTo('room'),
  type: DS.attr('string'),

  // Private properties
  _temperatureFactor: DS.attr('number'),
  _nCoefficient: DS.attr('number'),
  _floorSurfaceType: DS.attr('string'),
  _floorConstruction: DS.attr('string'),
  _floorTOG: DS.attr('number'),
  _activeFloorArea: DS.attr('number'),

  // Property accessors
  // Convectors Only
  temperatureFactor: Ember.computed('type', '_temperatureFactor',
  {
    get(key)
    {
      if (this.get('type') === "Convector"){
        return this.get('_temperatureFactor');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_temperatureFactor', value);
    }
  }),

  // Radiators Only
  nCoefficient: Ember.computed('type', '_nCoefficient',
  {
    get(key)
    {
      if (this.get('type') === "Radiator"){
        return this.get('_nCoefficient');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_nCoefficient', value);
    }
  }),

  // Underfloor Only
  floorSurfaceType: Ember.computed('type', '_floorSurfaceType',
  {
    get(key)
    {
      if (this.get('type') === "Underfloor Heating"){
        return this.get('_floorSurfaceType');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_floorSurfaceType', value);
    }
  }),

  floorConstruction: Ember.computed('type', '_floorConstruction',
  {
    get(key)
    {
      if (this.get('type') === "Underfloor Heating"){
        return this.get('_floorConstruction');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_floorConstruction', value);
    }
  }),

  floorTOG: Ember.computed('type', '_floorTOG',
  {
    get(key)
    {
      if (this.get('type') === "Underfloor Heating"){
        return this.get('_floorTOG');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_floorTOG', value);
    }
  }),

  activeFloorArea: Ember.computed('type', '_activeFloorArea',
  {
    get(key)
    {
      if (this.get('type') === "Underfloor Heating"){
        return this.get('_activeFloorArea');
      } else {
        return NaN;
      }
    },

    set(key, value)
    {
      this.set('_activeFloorArea', value);
    }
  })
});
