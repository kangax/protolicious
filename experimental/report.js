/* 
  
  Reports:
    - number of event handlers on a page
    - non-unique ID's
    - collapsing names/ID's (IE bug)
 
  Requires:
    prototype.js v. 1.6.0.3

*/

function report() {
  function isUnique(arr, value) {
    var idx = arr.indexOf(value);
    return arr.indexOf(value, idx + 1) == -1;
  }
  // event handlers
  var results = 0, c = Event.cache;
  for (var element in c) {
    for (var handler in c[element]) {
      for (var eventName in c[element]) {
        if (eventName == 'element') continue;
        results += c[element][eventName].length;
      }
    }
  }
  // find non-unique ids
  var ids = $$('*').pluck('id').without('');
  var nonUnique = [];
  ids.each(function(id) {
    if (!isUnique(ids, id))
      (nonUnique.indexOf(id) == -1) && nonUnique.push(id);
  })
  
  // find collapsing names/ids (IE)
  var withName = $$('*[name]');
  var withId = $$('*[id]');
  var collapsing = [];
  withId.each(function(el) {
    var collapsed = withName.find(function(_el){ return (_el.name == el.id) && _el != el })
    if (collapsed) {
      collapsing.push(el, collapsed);
    }
  });
  
  // return result
  return ['Event handlers: ', results, 
          '\nNon-Unique ID\'s: ', (nonUnique.length ? nonUnique : 'none'), 
          '\nCollapsing names/ID\'s: ', (collapsing.length ? collapsing : 'none')
          ].join('');
}