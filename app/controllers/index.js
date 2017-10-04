import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    // Define the action for creating a model of the room in the store
    createRoom(roomName, emitterType, temperatureFactor, nCoefficient, floorSurfaceType,
               maximumFloorSurfaceTemp, floorConstruction, floorTOG, activeFloorArea)
    {
      this.get('store').createRecord('room', {
        name: roomName,
        emitter: emitterType,
        roomType: "Kitchen",
        chimneyType: "test",
        designRoomVentilationRate: 2,
        roomLength: 4,
        roomWidth: 4,
        roomHeight: 4,

        // Specific parts of a room
        constructionElements: [null],
        floors: [null],
        portals: [null]
      });
    }
  }
});
