/**
 *  Element#contains(@element, pattern) -> Boolean
 *  - @element(Element): element which content will be tested
 *  - pattern(String|RegExp): pattern to test element's content against
 *  
 *  Tests whether element's content contains specified string (or matches agains regular expression)
 *  
 *      $("myElement").contains("some text...");
 *      $("otherElement").contains(/(foo|bar)/i)
 **/ 
Element.Methods.contains = function(element, pattern) { 
  element = $(element);
  if (!pattern) return false;
  pattern = pattern.constructor == RegExp ? pattern : RegExp.escape(pattern);
  return !!element.innerHTML.stripTags().match(pattern);
};

/**
 * Removes element from the document, returning it's HTML representation
 *
 */
Element.Methods.toTemplate = function(element) {
  if (!(element = $(element))) return null;
  return element.wrap().show().up().remove().innerHTML;
};

/**
 * Little helper to change element's attribute given pattern and replacement (RegExp object)
 * Encapsulates verbose el.writeAttribute(attr, el.readAttribute(attr))
 *
 */ 
Element.Methods.replaceAttribute = function(element, attr, pattern, replacement) {
  element = $(element);
  return el.writeAttribute(attr, element.readAttribute(attr)
    .replace(new RegExp(pattern), replacement)
  )
};

/**
 * Replaces innerHTML of an element given pattern and replacement
 *
 */
Element.Methods.replaceHTML = function(element, pattern, replacement) {
  element = $(element);
  return element.update(
    element.innerHTML.replace(new RegExp(pattern), replacement)
  );
};

Element.Methods.toHTML = function(element) {
  element = $(element);
  try {
    var xmlSerializer = new XMLSerializer();
    return element.nodeType == 4
      ? element.nodeValue
      : xmlSerializer.serializeToString(element);
  } catch(e) {
    return (element.xml 
      || element.outerHTML
      || element.cloneNode(true).wrap().innerHTML);
  }
};

/**
 * Same as #observe but imlicitly stops event when executing event handler
 *
 * $(someLink)._observe('click', function(e) { ... }) // <= event is stopped automatically
 */
Element.Methods._observe = Element.observe.wrap(function(proceed, element, eventName, handler) {
  return proceed.call(proceed, element, eventName, function(e) {
    Event.stop(e); handler.call(e.target, e);
  })
});

/**
 * Element.addHoverClassName(@element, className) -> @element
 * 
 * Observes element's mouseover/mouseout to add/remove specified className respectively
 *
 *    $('foo').addHoverClassName('over');
 *
 * TODO: change mouseover/mouseout to Andrew's "mouse:enter"/"mouse:leave"
 *
 **/
Element.Methods.addHoverClassName = function(element, className) {
  return $(element).observe('mouseover', Element.addClassName.curry(element, className))
    .observe('mouseout', Element.removeClassName.curry(element, className));
};

/**
 * Element.setProperty(@element, name, value) => @element
 *
 * - @element(Element): Element which property is to be set to a value
 * - name(String): Name of a property
 * - value(Any): Value of a property
 *
 * Dead simple helper for setting specified property of an element to a specified value.
 * This might seem like an overkill, but it's quite useful in conjunction with #invoke,
 * when modifying native properties of an element or creating new ones (a.k.a. expandos) in a batch.
 * This method is somewhat similar to writeAttribute, but is intended to operate on properties, rather than attributes.
 *
 *
 *    // An example of dropdown elements "bound" to each other
 *    // (i.e. changing value of one element results in other ones "changed" to the same value)
 *
 *    var dropdowns = $$('select');
 *    dropdowns.invoke('observe', 'change', function(e) {
 *      var index = e.element().selectedIndex;
 *      dropdowns.invoke('setProperty', 'selectedIndex', index);
 *    })
 *
 *
 **/
Element.Methods.setProperty = function(element, name, value) {
  if (!(element = $(element))) return;
  element[name] = value;
  return element;
};

/**
 * Element.swapClassName(@element, first, second) => @element
 *
 * - @element(Element): Element which className is to be swapped
 * - first(String): Class to remove 
 * - second(String): Class to add
 *
 * $('foo).swapClassName('active', 'inactive');
 *
 **/
Element.Methods.swapClassName = function(element, first, second) {
  return Element.removeClassName(element, first).addClassName(second);
};

/**
 * Element.enableClassName(@element, className, condition) => @element
 *
 * - @element(Element): Element which className is to be enabled (toggled)
 * - first(String): Class to enable (toggle)
 * - condition(Boolean): Condition based on which className will be enabled (toggled)
 *
 * var hasContent = $('foo').select('input[type=text]').any(function(el) {
 *   return !$F(el).blank();
 * })
 *
 * $('foo).enableClassName('hasContent', hasContent);
 * // same as
 * $('foo')[hasContent ? 'addClassName' : 'removeClassName']('hasContent');
 *
 **/
Element.Methods.enableClassName = function(element, className, condition) {
  return Element[condition ? 'addClassName' : 'removeClassName'](element, className);
};

Element.addMethods();