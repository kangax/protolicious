/** 
 *  Object._isFunction(object) -> Boolean
 *  - object(Any): an object to test against
 *  Tests whether an object is a Function object.
 *  
 *  As per ECMA-262, ed3; 15.3.4.2: "The toString function is not generic; 
 *  it throws a TypeError exception if its this value is not a Function object..."
 *  
 *  
 **/
Object._isFunction = function(o) {
  try {
    Function.prototype.toString.call(o);
  } catch(e) {
    return false;
  };
  return true;
};

// Experimental
Object._isFunction2 = function(o) {
  return Object.prototype.toString
    .call(o).indexOf('Function') != -1;
}

/**
 * Object.directProperties(object) -> Array
 *
 * Returns array of object's "direct" properties (i.e. those that are NOT resolved via object's prototype chain)
 *
 **/
Object.directProperties = function(o) {
  var result = [], hop = Object.prototype.hasOwnProperty;
  for (var prop in o) {
    hop.call(o, prop) && result.push(prop);
  }
  return result;
}