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
};

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
 * Function#toDelayed(timeout) -> Function
 * - timeout(Number): interval to call function within (in seconds)
 *
 * Augments a function into a delayed one
 *
 * formElement.observe('reset', handler.toDelayed(1));
 *
 **/
Function.prototype.toDelayed = function(timeout) {
  var __method = this;
  return function() {
    var args = $A(arguments);
    setTimeout(function(){ __method.apply(__method, args) }, timeout * 1000);
  }
};

/**
 * Function#toDeferred() -> Function
 *
 * Augments a function into a deferred one
 *
 * formElement.observe('reset', handler.toDeffered());
 *
 **/
Function.prototype.toDeferred = function() {
  return this.toDelayed(0.01);
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
};

/**
 * Function.prototype.addAdvice(advices) -> Function
 * - advices(Object): collection of key/value pairs where key is type of advice and value is advice itself
 *
 *  function sum(){
 *   return $A(arguments).inject(0, function(result, value){ return result + value; });
 *  }
 *
 * sum = sum.addAdvice({
 *   before: function() { console.log('receiving: ' + $A(arguments)) },
 *   after: function() { console.log('returning: ' + $A(arguments)) }
 * });
 *
 * sum(1,2,3);
 *
 * logs:
 * receiving: 1,2,3
 * returning: 6
 *
 **/
Function.prototype.addAdvice = function(advices) {
  return this.wrap(function() {
    var args = $A(arguments), proceed = args.shift();
    var a = advices, bf = a.before, ar = a.around, af = a.after;
    bf && bf.apply(proceed, args);
    ar && ar.apply(proceed, args);
    var result = proceed.apply(proceed, args);
    ar && ar.apply(proceed, result);
    af && af.apply(proceed, result);
    return result;
  })
};