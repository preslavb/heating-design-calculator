import Ember from 'ember';

const elementInput = Ember.Object.extend({
  // Debugging
  debug: true,

  // Public properties
  description: '',
  spaceTypeOnOtherSide: "Living room",
  heightOrLength: 2.4,
  width: 5,
  construction: "Enter a U-value",

  // Private properties
  _uValue: 1,

  // Computed properties
  area: Ember.computed('heightOrLength', 'width', function()
  {
    return this.get('heightOrLength') * this.get('width');
  }),

  designTemperatureDifference: Ember.computed('spaceTypeOnOtherSide', 'roomBelongingTo.roomTypeDesignTemperature', function()
  {
    let designTemperature = this.get(`roomBelongingTo.roomTypeDesignTemperatures.${this.get('spaceTypeOnOtherSide')}`);
    let roomDesignTemperature = this.get('roomBelongingTo.roomTypeDesignTemperature');

    return roomDesignTemperature - designTemperature;
  }),

  heatLoss: Ember.computed('uValue', 'designTemperatureDifference', 'area', function()
  {
    return this.get('uValue') * this.get('designTemperatureDifference') * this.get('area');
  }),

  // Property accessors
  uValue: Ember.computed('construction', '_uValue', {
    get(key)
    {
      if (this.get('isCustomConstruction')){
        return this.get('_uValue');
      } else {
        return this.get(`constructionValues.${this.get('construction')}`);
      }
    },

    set(key, value)
    {
      this.set('_uValue', value);
      return value;
    }
  }),

  // Constants
  constructionValues: {
    "Enter a U-value": 1,
    "Brick 102 mm, plaster": 2.97,
    "Brick 228 mm, plaster": 2.11,
    "Brick 343 mm, plaster": 1.64,
    "Stone 305mm (12in)": 2.87,
    "Stone 457mm (18in)": 2.23,
    "Stone 610mm (24in)": 1.68,
    "Concrete 102mm, plaster": 3.51,
    "Concrete 152mm, plaster": 3.12,
    "Concrete 204mm, plaster": 2.8,
    "Concrete 254 mm, plaster": 2.54,
    "Render 19mm, high performance aerated block (k=0,11) 215mm, 13mm plaster": 0.44,
    "Tiles, airspace, high performance aerated block, 215mm, 13mm plaster": 0.43,
    "Brick 102mm, cavity, brick 102mm, 13mm plaster": 1.37,
    "Brick 102mm, cavity, brick 102mm, 12,5mm plasterboard on dabs": 1.21,
    "Brick 102mm, 50mm  mineral slab, brick 102mm, 13mm plaster": 0.56,
    "Brick 102mm, 50mm mineral slab, brick 102mm, 12,5mm plasterboard on dabs": 0.53,
    "Brick 102mm, cavity, 100mm standard aerated block (k=0,17), 13mm plaster": 0.87,
    "Brick 102mm, cavity, 125mm standard aerated block (k=0,17), 13mm plaster": 0.77,
    "Brick 102mm, cavity, 100mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs": 0.8,
    "Brick 102mm, cavity, 125mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs": 0.72,
    "Brick 102mm, mineral wool slab in cavity 50mm, 100mm standard aerated block (k=0,17), 13mm plaster": 0.45,
    "Brick 102mm, mineral wool slab in cavity 50mm, 120mm standard aerated block (k=0,17), 13mm plaster": 0.42,
    "Brick 102mm, mineral wool slab in cavity 50mm,100mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs": 0.43,
    "Brick 102mm, mineral wool slab in cavity 50mm,125mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs": 0.41,
    "Brick 102mm, cavity, 100mm high performance aerated block (k=0,11), 13mm plaster": 0.68,
    "Brick 102mm, cavity, 125mm high performance aerated block (k=0,11), 13mm plaster": 0.59,
    "Brick 102mm, cavity, 100mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs": 0.64,
    "Brick 102mm, cavity, 125mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs": 0.56,
    "Brick 102mm, mineral wool slab in cavity 50mm, 100mm high performance aerated block (k=0,11), 13mm plaster": 0.39,
    "Brick 102mm, mineral wool slab in cavity 50mm, 120mm high performance aerated block (k=0,11), 13mm plaster": 0.36,
    "Brick 102mm, mineral wool slab in cavity 50mm,100mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs": 0.38,
    "Brick 102mm, mineral wool slab in cavity 50mm,125mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs": 0.35,
    "Render 19mm, brick 102mm, cavity, brick 102mm, 13mm plaster": 1.25,
    "Render 19mm, brick 102mm, 50mm mineral wool slab,  brick 102mm, 13mm plaster": 0.54,
    "Render 19mm, brick 102mm, cavity, brick 102mm, 12,5mm plasterboard on dabs": 1.11,
    "Render 19mm, brick 102mm, 50mm mineral wool slab, brick 102mm, 12,5mm plasterboard on dabs": 0.51,
    "Render 19mm, brick 102mm, cavity, 100mm standard aerated block, 13mm plaster": 0.82,
    "Render 19mm, brick 102mm, cavity, 125mm standard aerated block, 13mm plaster": 0.73,
    "Render 19mm, brick 102mm, mineral wool slab in cavity 50mm, 100mm standard aerated block, 13mm plaster": 0.44,
    "Render 19mm, brick 102mm, mineral wool slab in cavity 50mm, 125mm standard aerated block, 13mm plaster": 0.41,
    "Render 19mm, standard aerated block 100mm, cavity, 100mm standard aerated block, 13mm plaster": 0.61,
    "Render 19mm, standard aerated block 100mm, cavity, 125mm standard aerated block, 13mm plaster": 0.56,
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm standard aerated block, 13mm plaster": 0.37,
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm standard aerated block, 13mm plaster": 0.35,
    "Render 19mm, standard aerated block 100mm, cavity, 100mm  high performance aerated block (k=0,11), 13mm plaster": 0.51,
    "Render 19mm, standard aerated block 100mm, cavity, 125mm high performance aerated block (k=0,11), 13mm plaster": 0.45,
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm  high performance aerated block (k=0,11), 13mm plaster": 0.33,
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm high performance aerated block (k=0,11), 13mm plaster": 0.31,
    "Tiles, airspace, standard aerated block 100mm, 13mm plaster": 0.58,
    "Tiles, airspace, standard aerated block 125mm, 13mm plaster": 0.53,
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm standard aerated block, 13mm plaster": 0.36,
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 120mm standard aerated block, 13mm plaster": 0.34,
    "Tiles, airspace, standard aerated block 100mm, cavity, 100mm high performance aerated block (k=0,11), 13mm plaster": 0.49,
    "Tiles, airspace, standard aerated block 100mm, cavity, 125mm high performance aerated block (k=0,11), 13mm plaster": 0.44,
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm high performance aerated block (k=0,11), 13mm plaster": 0.32,
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm high performance aerated block (k=0,11), 13mm plaster": 0.3,
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, standard aerated block 100mm, 13mm plaster": 0.53,
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, standard aerated block 125mm, 13mm plaster": 0.49,
    "Shiplap boards, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, standard aerated block 100mm, 13mm plaster": 0.34,
    "Shiplap boards, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, standard aerated block 125mm, 13mm plaster": 0.32,
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, 100mm high performance block (K=0,11), 13mm plaster": 0.45,
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, 125mm high performance block (K=0,11), 13mm plaster": 0.41,
    "Shiplap boards, airspace, standard aerated block 125mm, mineral wool slab in cavity 50mm, 100mm high performance block (K=0,11), 13mm plaster": 0.31,
    "Shiplap boards, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm high performance block (K=0,11), 13mm plaster": 0.29,
    "Brick 102,5mm, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 60mm, vapour membrane, plasterboard 12,5mm": 0.43,
    "Brick 102,5mm, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 80mm, vapour membrane, plasterboard 12,5mm": 0.36,
    "Brick 102,5mm, cavity, membrane, plywood 10mm, studding 100mm, with infill  insulation 80mm, vapour membrane, plasterboard 12,5mm": 0.32,
    "Tiles, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 60mm, vapour membrane, plasterboard 12,5mm": 0.47,
    "Tiles, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 80mm, vapour membrane, plasterboard 12,5mm": 0.38,
    "Tiles, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill  insulation 80mm, vapour membrane, plasterboard 12,5mm": 0.34,
    "shiplap boards, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 60mm, vapour membrane, plasterboard 12,5mm": 0.44,
    "shiplap boards, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 80mm, vapour membrane, plasterboard 12,5mm": 0.36,
    "shiplap boards, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill  insulation 80mm, vapour membrane, plasterboard 12,5mm": 0.32,
    "Plasterboard 12,5mm, studding 75mm, plasterboard 12,5mm": 1.72,
    "Plaster 13mm, block 10mm, cavity, block 100mm, plaster 13mm": 1.02,
    "Plaster 13mm, brick 102,5mm, plaster 13mm": 1.76,
    "Plaster 13mm, brick 215mm, plaster 13mm": 1.33,
    "Plaster, breeze block 100mm, plaster": 1.58,
    "Plaster 13mm, standard aerated block 100mm, plaster 13mm": 1.66,
    "Plaster 13mm, standard aerated block 125mm, plaster 13mm": 1.53,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, no insulation, 9,5 mm plasterboard": 2.51,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 50mm insulation between joists, 9,5 mm plasterboard": 0.6,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 100mm insulation between joists, 9,5 mm plasterboard": 0.34,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 200mm insulation between joists, 9,5 mm plasterboard": 0.18,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 300mm insulation between joists, 9,5 mm plasterboard": 0.12,
    "Pitched roof - Slates or tiles, , ventilated air space, no insulation, 9,5 mm plasterboard": 3.13,
    "Pitched roof - Slates or tiles, , ventilated air space, 50mm insulation between joists, 9,5 mm plasterboard": 0.62,
    "Pitched roof - Slates or tiles, , ventilated air space, 100mm insulation between joists, 9,5 mm plasterboard": 0.35,
    "Pitched roof - Slates or tiles, , ventilated air space, 200mm insulation between joists, 9,5 mm plasterboard": 0.18,
    "Pitched roof - Slates or tiles, , ventilated air space, 300mm insulation between joists, 9,5 mm plasterboard": 0.12,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 50mm insulation between rafters, 9,5 mm plasterboard": 0.6,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 100mm insulation between rafters, 9,5 mm plasterboard": 0.34,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 200mm insulation between rafters, 9,5 mm plasterboard": 0.18,
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 300mm insulation between rafters, 9,5 mm plasterboard": 0.12,
    "Chippings, 3 layers of felt, boarding, air space, no insulation, 9,5 mm plasterboard": 1.69,
    "Chippings, 3 layers of felt, boarding, air space, 50mm insulation, 9,5 mm plasterboard": 0.53,
    "Chippings, 3 layers of felt, boarding, air space, 100mm insulation, 9,5 mm plasterboard": 0.32,
    "Chippings, 3 layers of felt, boarding, air space, 200mm insulation, 9,5 mm plasterboard": 0.17,
    "Chippings, 3 layers of felt, boarding, air space, 300insulation, 9,5 mm plasterboard": 0.12,
    "Boarding 19mm, airspace between joists, no insulation, 6mm sheeting - heat flow downward exposed to outside air or unheated space": 1.75,
    "Boarding 19mm, airspace between joists, 100mm insulation, 6mm sheeting - heat flow downward exposed to outside air or unheated space": 0.33,
    "Boarding 19mm, airspace between joists, 150mm insulation, 6mm sheeting - heat flow downward exposed to outside air or unheated space": 0.23,
    "Screed 50mm, concrete slab 150mm, no insulation between battens, 6mm sheeting, heat flow downward - exposed to outside air or unheated space": 1.82,
    "Screed 50mm, concrete slab 150mm, 100mm insulation between battens, 6mm sheeting, heat flow downward - exposed to outside air or unheated space": 0.57,
    "Intermediate floors, boarding 19mm, airspace between joists, 9,5mm plasterboard heat flow upward": 1.73,
    "Intermediate floors, boarding 19mm, airspace 100mm insulation between joists, 9,5mm plasterboard heat flow upward": 0.32,
    "Intermediate floors, boarding 19mm, airspace between joists, 9,5mm plasterboard heat flow downward": 1.41,
    "Intermediate floors, boarding 19mm, airspace 100mm insulation between joists, 9,5mm plasterboard heat flow downward": 0.31
  },

  // Dropdown options
  spaceTypeOnOtherSideOptions: [
    "Living room",
    "Dining room",
    "Bedsitting room",
    "Bedroom",
    "Hall and landing",
    "Kitchen",
    "Bathroom",
    "Toilet",
    "Outside",
    "Unheated space",
    "Adjoining dwelling"
  ],

  constructionOptions: [
    "Enter a U-value",
    "Brick 102 mm, plaster",
    "Brick 228 mm, plaster",
    "Brick 343 mm, plaster",
    "Stone 305mm (12in)",
    "Stone 457mm (18in)",
    "Stone 610mm (24in)",
    "Concrete 102mm, plaster",
    "Concrete 152mm, plaster",
    "Concrete 204mm, plaster",
    "Concrete 254 mm, plaster",
    "Render 19mm, high performance aerated block (k=0,11) 215mm, 13mm plaster",
    "Tiles, airspace, high performance aerated block, 215mm, 13mm plaster",
    "Brick 102mm, cavity, brick 102mm, 13mm plaster",
    "Brick 102mm, cavity, brick 102mm, 12,5mm plasterboard on dabs",
    "Brick 102mm, 50mm  mineral slab, brick 102mm, 13mm plaster",
    "Brick 102mm, 50mm mineral slab, brick 102mm, 12,5mm plasterboard on dabs",
    "Brick 102mm, cavity, 100mm standard aerated block (k=0,17), 13mm plaster",
    "Brick 102mm, cavity, 125mm standard aerated block (k=0,17), 13mm plaster",
    "Brick 102mm, cavity, 100mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs",
    "Brick 102mm, cavity, 125mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs",
    "Brick 102mm, mineral wool slab in cavity 50mm, 100mm standard aerated block (k=0,17), 13mm plaster",
    "Brick 102mm, mineral wool slab in cavity 50mm, 120mm standard aerated block (k=0,17), 13mm plaster",
    "Brick 102mm, mineral wool slab in cavity 50mm,100mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs",
    "Brick 102mm, mineral wool slab in cavity 50mm,125mm standard aerated block (k=0,17), 12,5mm plasterboard on dabs",
    "Brick 102mm, cavity, 100mm high performance aerated block (k=0,11), 13mm plaster",
    "Brick 102mm, cavity, 125mm high performance aerated block (k=0,11), 13mm plaster",
    "Brick 102mm, cavity, 100mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs",
    "Brick 102mm, cavity, 125mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs",
    "Brick 102mm, mineral wool slab in cavity 50mm, 100mm high performance aerated block (k=0,11), 13mm plaster",
    "Brick 102mm, mineral wool slab in cavity 50mm, 120mm high performance aerated block (k=0,11), 13mm plaster",
    "Brick 102mm, mineral wool slab in cavity 50mm,100mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs",
    "Brick 102mm, mineral wool slab in cavity 50mm,125mm high performance aerated block (k=0,11), 12,5mm plasterboard on dabs",
    "Render 19mm, brick 102mm, cavity, brick 102mm, 13mm plaster",
    "Render 19mm, brick 102mm, 50mm mineral wool slab,  brick 102mm, 13mm plaster",
    "Render 19mm, brick 102mm, cavity, brick 102mm, 12,5mm plasterboard on dabs",
    "Render 19mm, brick 102mm, 50mm mineral wool slab, brick 102mm, 12,5mm plasterboard on dabs",
    "Render 19mm, brick 102mm, cavity, 100mm standard aerated block, 13mm plaster",
    "Render 19mm, brick 102mm, cavity, 125mm standard aerated block, 13mm plaster",
    "Render 19mm, brick 102mm, mineral wool slab in cavity 50mm, 100mm standard aerated block, 13mm plaster",
    "Render 19mm, brick 102mm, mineral wool slab in cavity 50mm, 125mm standard aerated block, 13mm plaster",
    "Render 19mm, standard aerated block 100mm, cavity, 100mm standard aerated block, 13mm plaster",
    "Render 19mm, standard aerated block 100mm, cavity, 125mm standard aerated block, 13mm plaster",
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm standard aerated block, 13mm plaster",
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm standard aerated block, 13mm plaster",
    "Render 19mm, standard aerated block 100mm, cavity, 100mm  high performance aerated block (k=0,11), 13mm plaster",
    "Render 19mm, standard aerated block 100mm, cavity, 125mm high performance aerated block (k=0,11), 13mm plaster",
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm  high performance aerated block (k=0,11), 13mm plaster",
    "Render 19mm, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm high performance aerated block (k=0,11), 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, 13mm plaster",
    "Tiles, airspace, standard aerated block 125mm, 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm standard aerated block, 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 120mm standard aerated block, 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, cavity, 100mm high performance aerated block (k=0,11), 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, cavity, 125mm high performance aerated block (k=0,11), 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 100mm high performance aerated block (k=0,11), 13mm plaster",
    "Tiles, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm high performance aerated block (k=0,11), 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, standard aerated block 100mm, 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, standard aerated block 125mm, 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, standard aerated block 100mm, 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, standard aerated block 125mm, 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, 100mm high performance block (K=0,11), 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, cavity, 125mm high performance block (K=0,11), 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 125mm, mineral wool slab in cavity 50mm, 100mm high performance block (K=0,11), 13mm plaster",
    "Shiplap boards, airspace, standard aerated block 100mm, mineral wool slab in cavity 50mm, 125mm high performance block (K=0,11), 13mm plaster",
    "Brick 102,5mm, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 60mm, vapour membrane, plasterboard 12,5mm",
    "Brick 102,5mm, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 80mm, vapour membrane, plasterboard 12,5mm",
    "Brick 102,5mm, cavity, membrane, plywood 10mm, studding 100mm, with infill  insulation 80mm, vapour membrane, plasterboard 12,5mm",
    "Tiles, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 60mm, vapour membrane, plasterboard 12,5mm",
    "Tiles, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 80mm, vapour membrane, plasterboard 12,5mm",
    "Tiles, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill  insulation 80mm, vapour membrane, plasterboard 12,5mm",
    "shiplap boards, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 60mm, vapour membrane, plasterboard 12,5mm",
    "shiplap boards, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill insulation 80mm, vapour membrane, plasterboard 12,5mm",
    "shiplap boards, airspace, cavity, membrane, plywood 10mm, studding 100mm, with infill  insulation 80mm, vapour membrane, plasterboard 12,5mm",
    "Plasterboard 12,5mm, studding 75mm, plasterboard 12,5mm",
    "Plaster 13mm, block 10mm, cavity, block 100mm, plaster 13mm",
    "Plaster 13mm, brick 102,5mm, plaster 13mm",
    "Plaster 13mm, brick 215mm, plaster 13mm",
    "Plaster, breeze block 100mm, plaster",
    "Plaster 13mm, standard aerated block 100mm, plaster 13mm",
    "Plaster 13mm, standard aerated block 125mm, plaster 13mm",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, no insulation, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 50mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 100mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 200mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 300mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, , ventilated air space, no insulation, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, , ventilated air space, 50mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, , ventilated air space, 100mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, , ventilated air space, 200mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, , ventilated air space, 300mm insulation between joists, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 50mm insulation between rafters, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 100mm insulation between rafters, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 200mm insulation between rafters, 9,5 mm plasterboard",
    "Pitched roof - Slates or tiles, sarking felt, ventilated air space, 300mm insulation between rafters, 9,5 mm plasterboard",
    "Chippings, 3 layers of felt, boarding, air space, no insulation, 9,5 mm plasterboard",
    "Chippings, 3 layers of felt, boarding, air space, 50mm insulation, 9,5 mm plasterboard",
    "Chippings, 3 layers of felt, boarding, air space, 100mm insulation, 9,5 mm plasterboard",
    "Chippings, 3 layers of felt, boarding, air space, 200mm insulation, 9,5 mm plasterboard",
    "Chippings, 3 layers of felt, boarding, air space, 300insulation, 9,5 mm plasterboard",
    "Boarding 19mm, airspace between joists, no insulation, 6mm sheeting - heat flow downward exposed to outside air or unheated space",
    "Boarding 19mm, airspace between joists, 100mm insulation, 6mm sheeting - heat flow downward exposed to outside air or unheated space",
    "Boarding 19mm, airspace between joists, 150mm insulation, 6mm sheeting - heat flow downward exposed to outside air or unheated space",
    "Screed 50mm, concrete slab 150mm, no insulation between battens, 6mm sheeting, heat flow downward - exposed to outside air or unheated space",
    "Screed 50mm, concrete slab 150mm, 100mm insulation between battens, 6mm sheeting, heat flow downward - exposed to outside air or unheated space",
    "Intermediate floors, boarding 19mm, airspace between joists, 9,5mm plasterboard heat flow upward",
    "Intermediate floors, boarding 19mm, airspace 100mm insulation between joists, 9,5mm plasterboard heat flow upward",
    "Intermediate floors, boarding 19mm, airspace between joists, 9,5mm plasterboard heat flow downward",
    "Intermediate floors, boarding 19mm, airspace 100mm insulation between joists, 9,5mm plasterboard heat flow downward",
  ],

  // Computed properties to check active options
  isCustomConstruction: Ember.computed.equal('construction', "Enter a U-value"),

  // DEBUGGING
  debugObserver: Ember.observer('description', 'spaceTypeOnOtherSide', 'construction', 'uValue', function()
  {
    if (this.get('debug')){
      console.log(this.get('isCustomConstruction'));
      console.log('description: ' + this.get('description'));
      console.log('spaceTypeOnOtherSide: ' + this.get('spaceTypeOnOtherSide'));
      console.log('construction: ' + this.get('construction'));
      console.log('uValue: ' + this.get('uValue'));
    }
  })
});
export default elementInput;
