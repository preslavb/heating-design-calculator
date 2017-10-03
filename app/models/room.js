import DS from 'ember-data';

export default DS.Model.extend({
  // Public properties
  name: DS.attr('string'),
  emitter: DS.belongsTo('emitter'),
  roomType: DS.attr('string'),
  chimneyType: DS.attr('string'),
  designRoomVentilationRate: DS.attr('number'),
  roomLength: DS.attr('number'),
  roomWidth: DS.attr('number'),
  roomHeight: DS.attr('number'),

  // Specific parts of a room
  constructionElements: DS.hasMany('construction-element'),
  floors: DS.hasMany('floor'),
  portals: DS.hasMany('portal')
});
