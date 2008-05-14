/**
 * Returns negated function
 * 
 * e.g. Find all hidden elements:
 * 
 * $$('*').findAll(function(element) { return !element.visible() }); // old way
 * $$('*').findAll(Element.visible.negate()); // using negate
 *
 */
Function.prototype.negate = function() {
  var f = this;
  return function() {
    return !f.apply(f, arguments);
  }
};

/**
 * Calls and returns function
 *
 * myElement.toggle();
 * input.observe('change', myElement.toggle); // runs handler only when event occurs
 * 
 * input.observe('change', myElement.toggle.runOnce()); // using invoke
 */
Function.prototype.runOnce = function() {
  this.apply(this, arguments);
  return this;
}