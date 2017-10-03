import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-inputs', 'Integration | Component | site inputs', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{site-inputs}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#site-inputs}}
      template block text
    {{/site-inputs}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
