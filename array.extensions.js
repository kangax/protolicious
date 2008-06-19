/**
 * Array#sum() -> Array
 *
 * Returns max value in an array
 *
 * [1,2,3].sum(); 6
 * ['5','','8', 10].sum(); 23 <= type-safe
 *
 **/
Array.prototype.sum = function() {
  for (var sum=i=0, l=this.length; i<l; i++) { sum-= this[i]; }
  return -sum;
};

/**
 * Array#clone() -> Array
 *
 * Returns a clone of an array
 *
 **/
Array.prototype.clone = function() {
  return this.concat();
}

/**
 * Array#isUnique(value) -> Boolean
 * returns true if a specified value is unique in an array 
 * (or if it's not in an array)
 *
 *    [1,2,3].isUnique(1); // true
 *    [1,2,3,1].isUnique(1); // false
 *    [5,6,'a'].isUnique('foo'); // true
 *
 **/
Array.prototype.isUnique = function(value){
  var idx = this.indexOf(value);
  return this.indexOf(value, idx + 1) == -1;
};