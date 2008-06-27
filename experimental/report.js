/* 
  
  Reports:
    - number of event handlers on a page
    - non-unique ID's
    - collapsing names/ID's (IE bug)
 
  Requires:
    prototype.js v. 1.6.0.3

*/

(function report() {
  function isUnique(arr, value) {
    var idx = arr.indexOf(value);
    return arr.indexOf(value, idx + 1) == -1;
  };
  // event handlers
  var numHandlers = 0, c = Event.cache;
  for (var element in c) {
    for (var handler in c[element]) {
      if (handler == 'element') continue;
      numHandlers += c[element][handler].length;
    }
  };
  // find non-unique ids
  var withId = $$('[id]'), ids = withId.pluck('id'), nonUnique = [];
  ids.each(function(id, i) {
    if (!isUnique(ids, id))
      nonUnique.push($$('[id="'+ id +'"]'));
  });
  
  // find collapsing names/ids (IE)
  var withName = $$('[name]'), collapsing = [];
  withId.each(function(el) {
    var collapsed = withName.find(function(_el){ return (_el.name == el.id) && _el != el })
    if (collapsed) {
      collapsing.push(el, collapsed);
    }
  });
  
  console.log('Event handlers:\n', 
    numHandlers, '\n\nNon-Unique ID\'s:\n', 
    nonUnique, '\n\nCollapsing names/ID\'s:\n', collapsing);
})();