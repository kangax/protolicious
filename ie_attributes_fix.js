('outerHTML' in document.documentElement) && Element.addMethods({
  getAttributes: function(element) {
    var match = element.outerHTML.match(/^<\w+\s*([^>]*)\>/);
    if (!match || !match[1]) return [];
    return match[1].split(/\s+/).map(function(pair) {
      return pair.split('=')[0];
    });
  }
})