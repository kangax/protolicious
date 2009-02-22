(function(global){
  
  var global = this;
  
  var methods = (function(){
    var timeTable = { };
    function time(id) {
      timeTable['_' + id] = new Date();
    }
    function timeEnd(id) {
      var _id = '_' + id;
      if (timeTable[_id]) {
        console.log(id + ': ' + (new Date() - timeTable[_id]) + 'ms');
        delete timeTable[_id];
      }
    }
    return {
      time: time,
      timeEnd: timeEnd
    }
  })();

  if (!global.console) {
    global.console = { }
  }
  if (!global.console.log) {
    global.console.log = (global.opera && global.opera.postError)
      ? global.opera.postError
      : function(){ }
  }
  if (!global.console.time) {
    global.console.time = methods.time;
  }
  if (!global.console.timeEnd) {
    global.console.timeEnd = methods.timeEnd;
  }
})();