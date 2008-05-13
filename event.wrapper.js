// based on implementation by John David Dalton
Event.extend = (function() {
  
  function K(k) { return function() { return k } };
  
  var props = $w("altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey " +
    "currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue pageX pageY prevValue " + 
    "relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which");
  
  function extend(object, event){
    var i = props.length;
    while(i) object[props[--i]] = event[props[i]];
  };
  
  var methods = { };
  for (var prop in Event.Methods) {
    methods[prop] = K(function() {
      return Event.Methods[prop].apply(null, [this.originalEvent].concat($A(arguments)))
    })
  }
  
  methods.stopPropagation = Prototype.Browser.IE
    ? function() { this.originalEvent.cancelBubble = true }
    : function() { this.originalEvent.stopPropagation() };
  
  methods.preventDefault = Prototype.Browser.IE
    ? function() { this.originalEvent.returnValue = false }
    : function() { this.originalEvent.preventDefault() };
  
  function init(event) {
    extend(this, event);
    event._wrapper = this;
    this.originalEvent = event;
    this.stopped       = event.stopped;
    this.memo          = event.memo;
    this.eventName     = event.eventName;
    this.timeStamp     = (new Date).getTime();
  }
  
  if (Prototype.Browser.IE)
    init = init.wrap(function(proceed, event) {
      var pointer         = Event.pointer(event);
      this.target         = Element.extend(event.srcElement);
      this.relatedTarget  = Event.relatedTarget(event);
      this.pageX          = pointer.x;
      this.pageY          = pointer.y;
      proceed.call(this, event);
    })
  
  var Event = Class.create(methods, {
    initialize: init
  });
  
  return function(event) {
    if (!event) return false;
    if (event._wrapper) return event._wrapper;
    if (event.originalEvent) return event;
    return new Event(event);
  }
})();