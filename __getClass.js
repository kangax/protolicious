/**
 * Returns internal [[Class]] property of an object
 *
 * Ecma-262, 15.2.4.2
 * Object.prototype.toString( )
 *
 * When the toString method is called, the following steps are taken: 
 * 1. Get the [[Class]] property of this object. 
 * 2. Compute a string value by concatenating the three strings "[object ", Result (1), and "]". 
 * 3. Return Result (2).
 *
 * __getClass(5); // => "Number"
 * __getClass({}); // => "Object"
 * __getClass(/foo/); // => "RegExp"
 * __getClass(''); // => "String"
 * __getClass(true); // => "Boolean"
 * __getClass([]); // => "Array"
 * __getClass(undefined); // => "Window"
 * __getClass(Element); // => "Constructor"
 *
 */
function __getClass(object){
  return Object.prototype.toString.call(object)
    .match(/^\[object\s(.*)\]$/)[1];
};