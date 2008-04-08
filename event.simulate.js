Event.simulate = function(element, eventName) {
  
  var options = Object.extend({
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  }, arguments[2] || { } );
  
  var eventMatchers = {
    'HTMLEvents': /load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll/,
    'MouseEvents': /click|mousedown|mouseup|mouseover|mousemove|mouseout/
  };
  
  var oEvent, eventType = null;
  
  for (var name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) eventType = name;
  }
  
  if (!eventType) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

  if (document.createEvent) {
    oEvent = document.createEvent(eventType);
    if (eventType == 'HTMLEvents') {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    }
    else {
      oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 
        options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, $(element));
    }
    $(element).dispatchEvent(oEvent);
  }
  else {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    oEvent = Object.extend(document.createEventObject(), options);
    $(element).fireEvent('on' + eventName, oEvent);
  }
}