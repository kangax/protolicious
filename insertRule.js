var insertRule = (function(){
  var ss = document.styleSheets[0],
      reSelectorRule = /([^\{]*)\{([^\}]*)\}/;
  if (!ss) {
    var el = document.createElement('style');
    el.type = 'text/css';
    el.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(el);
    ss = document.styleSheets[0];
  }
  if (ss.addRule) {
    return function(rule) { // IE
      var match = rule.match(reSelectorRule);
      if (!match) return;
      var ss = document.styleSheets[document.styleSheets.length-1];
      ss.addRule(match[1], match[2], ss.rules.length);
    }
  }
  return function(rule) { // Others
    if (!rule.match(reSelectorRule)) return;
    var ss = document.styleSheets[document.styleSheets.length-1];
    ss.insertRule(rule, ss.cssRules.length);
  }
})();