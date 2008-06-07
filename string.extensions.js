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

// It seems impossible to translate html into a markdown without implementing a parser
String.prototype.htmlToMarkdown = (function(){
  
  var reTag = /<(\S*)\s*([^>]*)>(.*)<\/\1>/;
  var map = {
    h1: '\# #{content}',
    h2: '\#\# #{content}',
    h3: '\#\#\# #{content}',
    h4: '\#\#\#\# #{content}',
    h5: '\#\#\#\#\# #{content}',
    h6: '\#\#\#\#\#\# #{content}'
  }

  for (var name in map) {
    map[name] = new Template(map[name]);
  }
  
  return function() {
    
    var content = '';
    var match = this.match(reTag);

    if (!match) return;

    var tagName = match[1];
    var attributes = match[2];
    var content = match[3];

    if (!map[tagName]) return '';

    return map[tagName].evaluate({ content: this.stripTags() });
  }
})();