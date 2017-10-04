import Ember from 'ember';
import roomInput from 'heating-design-calculator/classes/input/room-input';
import siteInput from 'heating-design-calculator/classes/input/site-input';
import emitterSpecifications from 'heating-design-calculator/classes/input/emitter-specifications';

export default Ember.Component.extend({
  // Create the input classes which store the different inputs for the calculation
  roomInput: roomInput.create(),
  siteInput: siteInput.create(),
  emitterSpecifications: emitterSpecifications.create()
});
