/*

// include mixin into a "class"
Hash.include(Enumerable);

// overwrite one of the mixin methods
Enumerable.each = function(){ return 'foo' };

// changes are reflected on all instances of the "class"
(new Hash()).each(); // 'foo'

*/

Class.Methods.include = function(mixin) {
  var fn;
  for (var prop in mixin) {
    // use late binding
    this.prototype[prop] = (function(prop){
      fn = function() {
        return mixin[prop].apply(mixin, arguments);
      };
      // spoof toString
      fn.toString = mixin[prop].toString.bind(mixin[prop]);
      return fn;
    })(prop);
  }
  return this;
};