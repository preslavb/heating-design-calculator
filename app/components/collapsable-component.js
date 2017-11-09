import Ember from 'ember';

const ExpandedComponent = Ember.Component.extend({
  isExpanded: true,
  componentName: "Generic Component Name",
  classToUse: "defaultCollapsableClass",

  actions: {
    toggleVisibility()
    {
      this.set('isExpanded', !(this.get('isExpanded')));
    }
  }
});
export default ExpandedComponent;
