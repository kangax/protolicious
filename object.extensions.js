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
};

/**
 * Object.isEvent(object) -> Boolean
 * - object(Any): Object to test
 *
 * Returns true if passed object "partially" conforms to a DOM2 Event interface
 * The method uses somewhat naive duck-typing by verifying types of some of the properties as per:
 *
 * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event
 *
 * Most of the time, though, we want to either stop event, invoke #element method or 
 * access some specific property (.target, .currentTarget, etc.)
 * In those cases, it would make sense to test for those particular methods (before calling them)
 *
 * Maybe Object.isExtendedEvent is the way to go?
 *
 *    function toggleAll(e) {
 *      if (Object.isEvent(e)) e.stop();
 *      // $$('div.toggleable').invoke('toggle');
 *    }
 *
 **/
Object.isEvent = function(object) {
  return !!(object &&
    object.target &&
    Object.isNumber(object.target.nodeType) &&
    Object.isString(object.type));
};

/**
 * Object.isClass(object) -> Boolean
 * - object(Any): Object to test
 *
 * Returns true if passed object was created via Class.create
 * (it's somewhat naive in a way that it simply tests for prototype.initialize method on an object) 
 *
 *    Object.isClass(Hash); // true
 *    Object.isClass({}); // false
 *    Object.isClass(function(){}); // false
 *
 **/
Object.isClass = function(object) {
  return Object.isFunction(object) &&
    object.prototype &&
    Object.isFunction(object.prototype.initialize);
};

/**
 * Object.methodize(object) -> Object
 *
 * Returns a clone of a passed in object but with all functions methodized
 *
 *
 *
 // maybe try the "plain vanilla" way (?),
 // since converting object to an array and then back to an object seems excessive
 // eliminating #inject should make things faster as well
 
 var methodized = { };
 for (var prop in object) {
   if (!object[prop].methodize) continue;
   methodized[prop] = (function(prop){
     return object[prop].methodize();
   })(prop);
 }
 return methodized;
 
 */
Object.methodize = function(object) {
  return Object.keys(object).inject({ }, function(m, name) {
    m[name] = object[name].methodize();
    return m;
  });
};

Object.isNodeList = function(object) {
  return !!object && 
    typeof object.length != 'undefined' && 
    typeof object.item != 'undefined'
};

Object.isPrimitive = function(o) {
  return (o == null || /number|string|boolean/.test(typeof o));
};