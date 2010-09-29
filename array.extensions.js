/**
 * Array#sum() -> Array
 *
 * Returns the numeric sum value of array elements
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

/**
 * Array#sliceNonUnique -> Array
 *
 *    var arr = [1,1,2,3,3,4,1,2,2,5,5,5];
 *    arr.sliceNonUnique();
 *    
 *    // produces
 *    [[1, 1, 1], [2, 2, 2], [3, 3], [5, 5, 5]]
 *
 **/
Array.prototype.sliceNonUnique = function() {
  var result = [], clone = this.sort();
  for (var i=0, l=clone.length; i<l; i++) {
    if (clone[i] === clone[i+1]) {
      var temp = [];
      while (clone[i] === clone[i+1]) { temp.push(clone[i]); i++; }
      if (clone[i] === clone[i-1]) { temp.push(clone[i]); }
      result.push(temp);
    }
  }
  return result;
};
