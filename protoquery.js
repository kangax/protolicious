// A fun experiment of "jQuery-way" of performing DOM manipulations
//
// Example:
// $Q('div').addClassName('foo').show().next().hide();
// // selects all div elements, adds className 'foo' to them, then selects next elements (nextSibling) after all 'div's and hides them
//
// Returned object mixes Enumerable in, so you could always do:
//
// $Q('tr td').invoke('show');
// $Q('input[type=text]').pluck('value');
// etc.

(function(){
  var global = (function(){ return this })(), slice = Array.prototype.slice;
  
  var Wrapper = Class.create({
    initialize: function(selector) {
      this.elements = $$(selector);
    },
    inspect: function() {
      return Object.inspect(this.elements);
    },
    _each: function(iterator) {
      this.elements._each(iterator);
    }
  });
  
  Object.extend(Wrapper.prototype, Enumerable);
  
  for (var method in Element.Methods) {
    if (method == 'Simulated' || method == 'ByTag') continue;
    Wrapper.prototype[method] = (function(method){
      return function() {
        var args = $A(arguments);
        this.elements = this.elements.map(function(element) {
          return Element.Methods[method].apply(null, [element].concat(args));
        }).compact();
        return this;
      }
    })(method);
  }
  
  global.$Q = function(selector) {
    return new Wrapper(selector);
  }
})();