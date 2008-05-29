// A fun experiment of "jQuery-way" of performing DOM manipulations
//
// Example:
// $Q('div').addClassName('foo').show().next().hide();
// // selects all div elements, adds className 'foo' to them, then selects next elements (nextSibling) after all 'div's and hides them
//
// $Q('div.collapsible').click(function(){ this.toggle() });
// // toggles all div elements with 'collapsible' className when clicked
//
// Returned object mixes Enumerable in, so you could always do:
//
// $Q('tr td').invoke('show');
// $Q('input[type=text]').pluck('value');
// etc.

(function(){
  
  var Wrapper = Class.create({
    initialize: function(selector) {
      this.elements = Object.isElement(selector) ? [selector] : $$(selector);
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
          var result = Element.Methods[method].apply(null, [element].concat(args));
          return Object.isElement(result) ? result : element;
        }).compact();
        return this;
      }
    })(method);
  };
  
  Wrapper.addMethods({
    inspect: function(){
      return Object.inspect(this.elements);
    },
    hover: function(over, out) {
      return this.observe('mouseover', function(e) {
        over.call(e.target, e);
      }).observe('mouseout', function(e) {
        out.call(e.target, e);
      });
    },
    setProperty: function(name, value) {
      this.each(function(element) {
        element[name] = value;
      });
      return this;
    }
  });
  
  $w('blur change click dblclick error focus keydown keypress keyup load mousedown ' +
  'mousemove mouseout mouseover mouseup resize scroll select submit unload').each(function(eventName) {
    Wrapper.prototype[eventName] = (function(eventName){
      return function(handler) {
        return this.observe(eventName, handler);
      }
    })(eventName);
  });
  
  this.$Q = function(selector) {
    return new Wrapper(selector);
  };
})();