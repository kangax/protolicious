(function(_){
  var head = $$('head')[0];
  var jsEl = new Element('script', { type: 'text/javascript' });
  var cssEl = new Element('link', { type: 'text/css', rel: 'stylesheet' });
  _.addScript = function(url) {
    jsEl.src = url;
    head.appendChild(jsEl);
  };
  _.addStylesheet = function(url) {
    cssEl.href = url;
    head.appendChild(cssEl);
  }
})(Prototype);