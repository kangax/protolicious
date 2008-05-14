/**
 * Returns negated function
 * 
 * e.g. Find all hidden elements:
 * 
 * $$('*').findAll(function(element) { return !element.visible() }); // old way
 * $$('*').findAll(Element.visible.negate()); // using negate
 *
 **/
Function.prototype.negate = function() {
  var f = this;
  return function() {
    return !f.apply(f, arguments);
  }
};

/**
 * Calls and returns function
 *
 * // old way
 * myElement.toggle();
 * input.observe('change', myElement.toggle);
 * 
 * // new way
 * input.observe('change', myElement.toggle.runOnce());
 **/
Function.prototype.runOnce = function() {
  this.apply(this, arguments);
  return this;
}

/**
 * Invokes function as a constructor
 *
 * var Person = Class.create({
 *   initialize: function(name){
 *     this.name = name;
 *   }
 * })
 * 
 * Person._new('Foo Bar');
 *
 **/
Function.prototype._new = function() {
  var __method = this, args = arguments;
  function C() { return __method.apply(this, args); };
  C.prototype = __method.prototype;
  return new C;
};

/**
 * Creates a function which returns specified value.
 * Useful as a closure "wrapper" for blocks of code 
 * which need to have certain variables stored in their own closure (rather than sharing them)
 *
 * for (var prop in source) {
 *   dest[prop] = function(){ return String(prop) } // <= "prop" is "shared" among all methods
 * }
 *
 * for (var prop in source) {
 *   dest[prop] = Function.K(String(prop)); // <= now each "prop" is stored in Function.K's closure
 * }
 *
 **/
Function.K = function(k){
  return function() {
    return k;
  }
}