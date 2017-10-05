import Ember from 'ember';
import siteInput from 'heating-design-calculator/classes/input/site-input';
import emitterSpecifications from 'heating-design-calculator/classes/input/emitter-specifications';

export default Ember.Component.extend({
  // Create the input classes which store the different inputs for the calculation
  siteInput: siteInput.create(),
  emitterSpecifications: emitterSpecifications.create()
});
