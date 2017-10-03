import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('room-inputs', 'Integration | Component | room inputs', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{room-inputs}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#room-inputs}}
      template block text
    {{/room-inputs}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
