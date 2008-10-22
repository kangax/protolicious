// bench(function(){ $$('div'); }, 100);

function bench(fn, numIterations) {
  
  if (!fn) return 0;
  
  var numBenchmarks = 15, results = [];
      
  function _bench(fn, numIterations) {
    var i = numIterations || 1, t = new Date();
    while (i--) {
      fn();
    }
    return new Date() - t;
  }
  
  while (numBenchmarks--) {
    results.push(_bench(fn, numIterations));
  }
  
  var average = (function(){
    var i = results.length, sum = 0;
    while (i--) {
      sum += results[i];
    }
    return sum / results.length;
  })();
  
  var median = (function(){
    var idx = results.length / 2;
    if (results.length % 2 === 0) {
      return ((results[idx] + results[idx + 1]) / 2);
    }
    return results[Math.ceil(idx)];
  })();
  
  return {
    average: average,
    actual: results,
    median: median
  };
};