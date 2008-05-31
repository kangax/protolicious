(function(_){
  var head = $$('head')[0];
  var jsEl = new Element('script', { type: 'text/javascript' });
  var cssEl = new Element('link', { type: 'text/css', rel: 'stylesheet' });
  Prototype.addScript = function(url, callback) {
    jsEl.src = url;
    jsEl.onload = callback;
    head.appendChild(jsEl);
  };
  Prototype.addStylesheet = function(url, callback) {
    cssEl.href = url;
    cssEl.onload = callback;
    head.appendChild(cssEl);
  }
})();