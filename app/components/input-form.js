import Ember from 'ember';
import siteInput from 'heating-design-calculator/classes/site-input';

export default Ember.Component.extend({

  // Define the input tabs to be filled in.
  inputTabs: [
    "Site Inputs",
    "Room Inputs",
    "Emitter Specifications"
  ],

  testSite: siteInput.create({
    roomName: "testName",
    emitterType: "testType",
    temperatureFactor: NaN,
    nCoefficient: NaN,
    floorSurfaceType: NaN,
    maximumFloorSurfaceTemp: NaN,
    floorConstruction: NaN,
    floorTOG: NaN,
    activeFloorArea: NaN
  })
});
