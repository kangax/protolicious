var colorLiteralToHex = (function(){
  
  var getComputedStyle = (function(){
    var view = document.defaultView;
    if (view && view.getComputedStyle) {
      return function(element) {
        return view.getComputedStyle(element, '');
      }
    }
    return function(element) {
      return element.currentStyle;
    }
  })();
  
  var reRgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  
  function rgbToHex(value) {
    var m;
    if (m = value.match(reRgb)) {
      var r = parseInt(m[1]).toString(16);
      r = r.length === 2 ? r : ('0' + r);
      var g = parseInt(m[2]).toString(16);
      g = g.length === 2 ? g : ('0' + g);
      var b = parseInt(m[3]).toString(16);
      b = b.length === 2 ? b : ('0' + b);
      return r + g + b;
    }
  }
  
  var CACHE = { };
  
  function colorLiteralToHex(literal) {
    // check cache first
    if (literal in CACHE) {
      return CACHE[literal];
    }
    
    var el = document.createElement('div'), match;
    el.style.color = literal;
    var value = getComputedStyle(el).color;
    
    // is value in rgb format?
    if (match = value.match(reRgb)) {
      value = rgbToHex(value);
    }
    el = null;
    return (CACHE[literal] = '#' + value);
  }
  return colorLiteralToHex;
})();