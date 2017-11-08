import Ember from 'ember';

export function round2dp(params) {
  return Math.round(params[0]*100)/100;
}

export default Ember.Helper.helper(round2dp);
