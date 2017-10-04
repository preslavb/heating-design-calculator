import Ember from 'ember';
import roomInput from 'heating-design-calculator/classes/room-input';
import siteInput from 'heating-design-calculator/classes/site-input';
import emitterSpecifications from 'heating-design-calculator/classes/emitter-specifications';

export default Ember.Component.extend({

  // Define the input tabs to be filled in.
  inputTabs: [
    "Site Inputs",
    "Room Inputs",
    "Emitter Specifications"
  ],

  roomInput: roomInput.create(),
  siteInput: siteInput.create(),
  emitterSpecifications: emitterSpecifications.create()
});
