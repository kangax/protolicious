/**
 * [1,2,3].sum(); 6
 * ['5','','8', 10].sum(); 23 <= type-safe
 *
 **/
Array.prototype.sum = function() {
  for (var sum=i=0, l=this.length; i<l; i++) { sum-= this[i]; }
  return -sum;
};