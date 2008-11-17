(function(c, total){
  console.group('Events cache');
  for (var p in c) {
    var handlers = Object.keys(c[p]).without('element'), 
        el = Object.inspect(c[p].element), len;
    console.group(el);
    console.log(handlers.inject([], function(a,h) {
      len = c[p][h].length;
      a.push(h + (len>1 ? (' ('+len+')') : '') + '\n');
      total += len;
      return a;
    }).join(''));
    console.groupEnd(el);
  }
  console.groupEnd('Event cache');
  console.log('Total: ', total);
})(Event.cache, 0);