/**
 * Provides a common interface for enabling/disabling elements
 * (useful for "ignoring" events while animation/ajax requests are in action)
 *
 *    $('foo').observe('click', function(){
 *      new Ajax.Request('example.com', {
 *        onCreate: function(){ $('foo').disable() } // all click events are ignored while request is in action
 *        onComplete: function() { $('foo).enable() } // reenable element
 *      })
 *    })
 *
 **/
Event.observe = Event.observe.wrap(function(p, element, eventName, handler) {
  return p.call(p, element, eventName, function(e) {
    if (e.currentTarget.__disabled) return; 
    handler.call(e.target, e);
  })
})

Element.addMethods({
  disable: function(element, eventName) {
    element.__disabled = true;
  },
  enable: function(element, eventName) {
    delete element.__disabled;
  },
  disabled: function(element) {
    return !!element.__disabled;
  }
  observe: Event.observe
})