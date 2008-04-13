// Inspired by http://eigenclass.org/hiki.rb?Changes+in+Ruby+1.9#l54


/**
 * Enumerable.findIndex() -> Number | undefined
 * - iterator(Function): Iterator. Called for each value of a "collection" with value and index
 * - context(Object): Optional object to be used as a context of iterator
 * 
 * Returns index of a first value in "collection" which satisfies iterator
 *
 *    $R(1,10).findIndex(function(v) { return v % 5 == 0 }); // => 4
 *    $R(1,10).findIndex(function(v) { return v % 25 == 0 }); // => undefined
 *
 *    // Get all <td> of <th.foo>
 *    var index = $$('th').findIndex(function(el) { return el.hasClassName('foo') });
 *    $$('td:nth-child(' + index + ')');
 *
 **/
Enumerable.findIndex = function(iterator, context) {
  var result;
  this.each(function(value, index) {
    if (iterator.call(context || iterator, value, index)) {
      result = index;
      throw $break;
    }
  })
  return result;
}

/**
 * Enumerable.count() -> Number
 * - iterator(Function): Iterator. Called for each value of a "collection" with value and index
 * - context(Object): Optional object to be used as a context of iterator
 *
 * Returns a number representing how many values in "collection" iterator satisfies
 *
 *    // how many of 1 is in the array?
 *    ["bar", 1, "foo", 2, 1].count(1); // => 2
 *
 *    // how many could be converted to number?
 *    ["bar", 1, "foo", 2, 3].count(function(v) { return parseInt(v) }); // => 3
 *
 *    // how many are strings?
 *    ["foo", "bar", 1, 2, 3, "baz"].count(Object.isString); // => 3
 *
 **/
Enumerable.count = function(iterator, context) {
  var result = 0;
  this.each(function(value, index) {
    if (iterator.call ? iterator.call(context || iterator, value, index) : (iterator == value))
      ++result;
  })
  return result;
}