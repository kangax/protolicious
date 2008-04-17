/**
 * Object.forIn(object, iterator[, context = iterator]) -> object
 *
 * - object(Any):        Object to enumerate over
 * - iterator(Function): Function to call for each iteration. 
 *                       Iterator is being passed key as a first argument, value as a second.
 * - context(Any):       Context to call iterator within. Defaults to an interator.
 *
 *    var KEY_CODES = { };
 *    Object.forIn(Event, function(key, value) {
 *      if (key.startsWith('KEY_'))
 *        KEY_CODES[key] = value;
 *    })
 *    KEY_CODES; // => { KEY_BACKSPACE: 8, KEY_TAB: 9, ... }
 *
 **/

(function() {
  // first declare function the proper way
  Object.forIn = function(object, iterator, context) {
    for (var prop in object) {
      iterator.call(context || iterator, prop, object[prop]);
    }
    return object;
  }
  
  var isDontEnumSkipped = true;
  var DontEnumProperties = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
  ]
  var length = DontEnumProperties.length;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  
  // test if properties that shadow DontEnum ones are enumerated
  for (var prop in { toString: true }) {
    isDontEnumSkipped = false;
  }
  
  if (isDontEnumSkipped) {
    // redeclare function for IE, 
    // make it use already defined variables from the closure
    // for perfomance reasons 
    Object.forIn = function(object, iterator, context) {
      for (var prop in object) {
        iterator.call(context || iterator, prop, object[prop]);
      }
      // walk through "DontEnum-buggy" properties, 
      // check if any of them are directly in the oject
      while (length) {
        if (hasOwnProperty.call(object, DontEnumProperties[--length])) {
          iterator.call(context || iterator, prop, object[prop]);
        }
      }
      return object;
    }
  }
})()


/**
 * Object.flip(object) -> object
 * - object(Any): Object whose key/values are to be flipped
 *
 *    Object.flip({foo: 'bar'}); // => { bar: 'foo' }
 *
 **/
Object.flip = function(object){
  var clone = { };
  Object.forIn(object, function(prop, value) {
    clone[value] = prop;
  })
  return clone;
}

/**
 * Object.find(object, iterator[, context = iterator]) -> object
 * - object(Any): Object to enumerate over
 * - iterator(Function): function to invoke for each iteration
 * - context(Any): Context to call iterator within. Defaults to iterator.
 *
 *    // Find all functions within an Event object
 *    Object.find(Event, function(key, value) {
 *      return Object.isFunction(value);
 *    });
 *
 **/
Object.find = function(object, iterator, context) {
  var result = { };
  Object.forIn(object, function(key, value) {
    if (iterator.call(context || iterator, key, value))
      result[key] = value;
  });
  return result;
}




