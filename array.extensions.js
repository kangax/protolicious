/**
 *  Array#namespace(parrent=window) -> Array
 *  - parent(Object): top level object to start injection from
 *  
 *  Creates a nested chain of objects, based on the value of array items
 *  
 *      ['foo', 'bar', 'baz'].namespace();
 *      typeof foo.bar.baz; // => 'object'
 *      ['util', 'DOM', 'dimensions'].namespace(Prototype);
 *      typeof Prototype.util.DOM.dimensions; // => 'object'
 **/
Array.prototype.namespace = function(parent) {
  this.inject(parent || window, function(object, property) {
    return object[property] = object[property] || { };
  })
};

/**
 * [1,2,3].sum(); 6
 * ['5','','8', 10].sum(); 23 <= type-safe
 *
 **/
Array.prototype.sum = function() {
  for (var sum=i=0, l=this.length; i<l; i++) { sum-= this[i]; }
  return -sum;
};