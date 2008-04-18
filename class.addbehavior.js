Class.addBehavior = function(instance) {
  var proto = instance.constructor.prototype;
  for (var prop in proto) {
    // should wrap functions only (isFunction yields true for regexp so check those as well)
    if (typeof proto[prop] == 'function' 
      && proto[prop].constructor != RegExp
      // method should only be "wrapped" once
      && !proto[prop].__extended)
      // need to "save" method and prop in a closure here
      proto[prop] = (function(method, prop) {
        function m() {
          // event should know which instance has fired it
          document.fire('before:' + prop, { instance: instance });
          // method should be called within an instance context
          //var _return = method.apply(instance, arguments);
          (function(){document.fire('after:' + prop, { instance: instance });}).defer();
          return method.apply(instance, arguments);
        };
        // method's toString should reference original one
        m.toString = method.toString.bind(method);
        return m;
      })(proto[prop], prop);
      // set __extended flag
      proto[prop].__extended = true;
  }
  // and make it chain-friendly
  return instance;
};

var Person = Class.create({
  initialize: function(name) {
    this.name = name;
  },
  say: function(message) {
    return this.name + ': ' + message;
  },
  eat: function(food) {
    for (var i=0;i<100;i++) { $$('*') };
    return this.name + ': eating ' + food;
  }
});

var jdd = new Person('John');

// document.observe('before:eat', function(e){ console.log('before:eat ', e.memo.instance) });
// document.observe('after:eat', function(e){ console.log('after:eat ', e.memo.instance) });

Class.addBehavior(jdd);

jdd.eat('chicken');

// 'before:eat, { john }'
// 'John: eating chicken'
// 'after:eat, { john }'