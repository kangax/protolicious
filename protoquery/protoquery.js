/*

A fun experiment of "jQuery-way" of performing DOM manipulations

Examples:

// Selects all div elements, adds className 'foo' to them, then selects next elements (nextSibling) after all 'div's and hides them

$Q('div').addClassName('foo').show().next().hide();


// Toggles all div elements with 'collapsible' className when clicked

$Q('div.collapsible').click(function(){ this.toggle() });


// Returned object mixes Enumerable in, so you could always do:

$Q('tr td').invoke('show');
$Q('input[type=text]').pluck('value');


// Certain methods act on a first element only (e.g. #visible, #readAttribute, etc.)

$Q('li a').visible(); // true (checks first element)


// Additional methods are:

#first                          - returns first element
#last                           - returns last element
#setProperty(name, value)       - sets <name> property to a <value> on all elements
#hover(overHandler, otHandler)  - observes mouseover/mouseout events on all elements - invoking overHandler/outHandler functions accordingly


// $Q provides an easy interface for adding additional functionality
// E.g. to simulate jQuery's #width method, we could do something like:

$Q.addMethods({
  width: function(value) {
    return Object.isUndefined(value)
      ? this.first().getWidth()
      : this.setStyle({ width: value + 'px' });
  }
})
*/

(function(){
  
  var Wrapper = Class.create(Enumerable, {
    initialize: function(selector) {
      this.elements = Object.isString(selector) ? $$(selector) : [selector ? $(selector) : document];
      this._toArray();
    }
  });
  
  function copyFrom(obj) {
    for (var method in obj) {
      if (/^Simulated|ByTag|classNames|getElementsByClassName|getElementsBySelector|immediateDescendants$/.test(method)) continue;
      Wrapper.prototype[method] = (function(method) {
        return function() { 
          var args = $A(arguments), returnFirst = false, result, _elements = [];
          this.elements.each(function(element, i) {
            result = obj[method].apply(null, args.length ? [element].concat(args) : [element]);
            if (Object.isUndefined(result) || !Object.isElement(result)) {
              returnFirst = true;
              throw $break;
            }
            result && (_elements[i] = element);
          });

          if (returnFirst) return result;
          this.elements = _elements;
          return this;
        }
      })(method);
    };
  }
  
  copyFrom(Element.Methods);
  copyFrom(Form.Element.Methods);
  
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
    },
    _each: function(iterator) {
      this.elements._each(iterator);
    },
    first: function() {
      return this.elements[0];
    },
    last: function() {
      return this.elements.last();
    },
    _toArray: function() {
      Array.prototype.push.apply(this, this.elements);
    }
  });
  
  $w('blur change click dblclick error focus keydown keypress keyup load mousedown ' +
  'mousemove mouseout mouseover mouseup resize scroll select submit unload').each(function(eventName) {
    Wrapper.prototype[eventName] = (function(eventName) {
      return function(handler) {
        return this.observe(eventName, handler);
      }
    })(eventName);
  });
  
  this.$Q = function(selector) {
    return new Wrapper(selector);
  };
  
  this.$Q.addMethods = function(methods) {
    for (var name in methods) {
      Wrapper.prototype[name] = methods[name];
    }
  };
  
  Element.addMethods = (function(original) {
    var f = function() {
      original.apply(original, arguments);
      copyFrom(Element.Methods);
      copyFrom(Form.Element.Methods);
    };
    f.toString = original.toString.bind(original);
    return f;
  })(Element.addMethods);
  
  Element.addMethods();
})();