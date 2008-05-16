/** 
 * Adding enumerable to strings
 *
 * 'h1 h2 div h3 span'.grep(/\d+$/); ['h1', 'h2', 'h3']
 *
 */
String.prototype._each = function() {
  return Array.prototype._each.apply($w(String(this)), arguments);
};
Object.extend(String.prototype, Enumerable);