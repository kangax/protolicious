/*

Example:

document.observe('key:esc', helpWindow.close);
document.observe('key:space', focusNextField);

*/
 

(function() {
  var hash = { 32: 'space', 19: 'pause' };
  var handler = function(e) {
    if (!hash[e.keyCode]) return;
    if (e.type == 'keydown' && e.keyCode != Event.KEY_TAB) return;
    document.fire('key:' + hash[e.keyCode], e);
  }
  for (var prop in Event) {
    if (prop.startsWith('KEY_'))
      hash[Event[prop]] = prop.replace('KEY_', '').toLowerCase();
  }
  document.observe('keyup', handler).observe('keydown', handler);
})();