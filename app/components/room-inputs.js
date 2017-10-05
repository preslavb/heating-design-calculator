import Ember from 'ember';

export default Ember.Component.extend({
  // Expand and collapse
  isExpanded: true,

  actions: {
    toggleVisibility()
    {
      this.set('isExpanded', !(this.get('isExpanded')));
    }
  }
});
