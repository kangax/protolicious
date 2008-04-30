/**
 * mixin Class.Watchable
 *
 * - watch(property, handler) -> Object
 * - unwatch(property) -> Object
 *
 * A convenient mixin for a naive simulation of Mozilla's proprietary Object.prototype.watch/unwatch
 * "watch" interval can be set via static Class.Watchable.INTERVAL (defaults to 100ms)
 * "watched" object is polluted with 2 properties: __watchable and __callback
 * handler is invoked with 3 arguments - propertyName, oldValue, newValue
 *
 *   var Person = Class.create(Class.Watchable, {
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
     // isFunction will return true for regexp (but it's too ugly to fix it here)
     if (Object.isUndefined(prop) || !Object.isFunction(handler))
       throw new TypeError('Wrong arguments supplied');

     if (!this.__watchable) this.__watchable = { };
     var w = this.__watchable;

     if (!w.clone) w.clone = { };
     w.clone[prop] = this[prop];

     if (!w.handlers) w.handlers = { };
     if (!w.handlers[prop]) w.handlers[prop] = [ ];
     if (!w.handlers[prop].include(handler)) w.handlers[prop].push(handler);

     if (!w.timer)
       w.timer = setInterval(this.__callback.bind(this), Class.Watchable.INTERVAL);

     return this;
   },
   unwatch: function(prop) {
     var w = this.__watchable;
     if (w.clone && w.clone[prop] && w.clone[prop].include(handler))
       w.clone[prop] = w.clone[prop].without(handler);
     return this;
   },
   __callback: function() {
     var oldValue, handlers, w = this.__watchable;
     for (var prop in w.clone) {
       if (w.clone[prop] != this[prop]) {
         oldValue = w.clone[prop];
         w.clone[prop] = this[prop];
         handlers = w.handlers[prop];
         for (var i=0, l=handlers.length; i<l; i++) {
           handlers[i].call(handlers[i], prop, oldValue, this[prop]);
         }
       }
     }
   }
 })

 Class.Watchable.INTERVAL = 100;