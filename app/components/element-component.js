import Ember from 'ember';
import ExpandedComponent from 'heating-design-calculator/components/collapsable-component';

export default ExpandedComponent.extend({
  index: 0,
  componentName: Ember.computed('index', function()
  {
    return "Element " + this.get('index');
  })
});
