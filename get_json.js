/*

getJSON(
  'http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?', 
  function(data){
    console.log(data);
  }
);

*/

(function(){
  var id = 0, head = $$('head')[0], global = this;
  global.getJSON = function(url, callback) {
    var script = document.createElement('script'), token = '__jsonp' + id;
    
    // callback should be a global function
    global[token] = callback;
    
    // url should have "?" parameter which is to be replaced with a global callback name
    script.src = url.replace(/\?(&|$)/, '__jsonp' + id + '$1');
    
    // clean up on load: remove script tag, null script variable and delete global callback function
    script.onload = function() {
      script.remove();
      script = null;
      delete global[token];
    };
    head.appendChild(script);
    
    // callback name should be unique
    id++;
  }
})();

