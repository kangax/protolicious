/**
 * mixin Class.Watchable
 *
 * A convenient mixin for a naive simulation of Mozilla's proprietary Object.prototype.watch/unwatch
 * "watch" interval can be set via static Class.Watchable.INTERVAL (defaults to 100ms)
 * "watched" object is polluted with 4 properties: __clone, __handlers, __timer and __callback
 * handler is invoked with 3 arguments - propertyName, oldValue, newValue
 *
 *   var Person = Class.create(Watchable, {
 *     initialize: function(name) {
 *       this.name = name;
 *     },
 *     speak: function(msg) {
 *       return [this.name, msg].join(': ');
 *     }
 *   })
 *   
 *   var jdd = new Person('John');
 *   
 *   jdd.watch('name', console.log);
 *   
 *   jdd.name; // "John"
 *   jdd.name = "Juriy"; // fires handler associated with "name", passing it: prop, oldValue, newValue
 *
 */
Class.Watchable = Class.create({
  watch: function(prop, handler) {
    
    if (!this.__clone) this.__clone = { };
    this.__clone[prop] = this[prop];
    
    if (!this.__handlers) this.__handlers = { };
    if (!this.__handlers[prop]) this.__handlers[prop] = [];
    if (!this.__handlers[prop].include(handler)) this.__handlers[prop].push(handler);

    if (!this.__timer)
      this.__timer = setInterval(this.__callback.bind(this), Class.Watchable.INTERVAL);
      
    return this;
  },
  unwatch: function(prop) {
    if (this.__clone && this.__clone[prop] && this.__clone[prop].include(handler))
      this.__clone[prop] = this.__clone[prop].without(handler);
    return this;
  },
  __callback: function() {
    var oldValue, handlers;
    for (var prop in this.__clone) {
      if (this.__clone[prop] != this[prop]) {
        oldValue = this.__clone[prop];
        this.__clone[prop] = this[prop];
        handlers = this.__handlers[prop];
        for (var i=0, l=handlers.length; i<l; i++) {
          handlers[i].call(handlers[i], prop, oldValue, newValue);
        }
      }
    }
  }
})

Class.Watchable.INTERVAL = 100;