/**
 * mixin Class.Observable
 *
 *    var Person = Class.create(Class.Observable, {
 *      initialize: function(name){ this.name = name }
 *    })
 *
 *    var jdd = new Person('John');
 *
 *    jdd.observe(':say', console.log);
 *    jdd.fire(':say');
 *
 **/
 
// with corrections by John David Dalton
(function(){
  function getElement(object){
    return (object._eventElement = object._eventElement || new Element('code'));
  }
  Class.Observable = {
    observe: function(eventName, handler) {
      getElement(this).observe(eventName, handler);
    },
    stopObserving: function() {
      getElement(this).stopObserving.apply(null, arguments);
    },
    fire: function(eventName) {
      getElement(this).fire(eventName);
    }
  }
})();