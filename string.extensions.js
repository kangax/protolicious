/**
 *  Array#namespace(parrent=window) -> Array
 *  - parent(Object): top level object to start injection from
 *  
 *  Creates a nested chain of objects, based on the value of array items
 *  
 *      'Prototype.foo.bar'.namespace();
 *      typeof Prototype.foo.bar; // => 'object'
 *      'util.DOM.dimensions'.namespace(Prototype);
 *      typeof Prototype.util.DOM.dimensions; // => 'object'
 **/
String.prototype.namespace = function(parent) {
  return this.split('.').inject(parent || window, function(object, property) {
    return object[property] = object[property] || { };
  })
};