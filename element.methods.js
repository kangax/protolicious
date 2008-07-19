/**
 *  Element#containsText(@element, pattern) -> Boolean
 *  - @element(Element): element which content will be tested
 *  - pattern(String|RegExp): pattern to test element's content against
 *  
 *  Tests whether element's content contains specified string (or matches agains regular expression)
 *  
 *      $("myElement").containsText("some text...");
 *      $("otherElement").containsText(/(foo|bar)/i)
 **/ 
Element.Methods.containsText = function(element, pattern) { 
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
  return Element.writeAttribute(element, attr, element.readAttribute(attr)
    .replace(new RegExp(pattern), replacement))
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

/**
 * Element.wrapContent(@element, wrapper, attributes) -> @element
 *
 * Wraps element's content with wrapper (i.e. a DOMElement or an html string)
 *
 *
 *    <pre id="foo">
 *      some content <span>some tag</span>
 *    </pre>
 *    ...
 *    $('foo').wrapContent('<code class="javascript">');
 *    ...
 *    <pre>
 *      <code class="javascript"> 
 *        some content <span>some tag</span>
 *      </code>
 *    </pre>
 *
 **/
Element.Methods.wrapContent = function(element, wrapper, attributes) {
  if (!(element = $(element))) return;
  if (Object.isElement(wrapper))
    $(wrapper).writeAttribute(attributes || { })
  else if (Object.isString(wrapper))
    wrapper = new Element(wrapper, attributes);
  else wrapper = new Element('div', wrapper);
  
  while (element.firstChild)
    wrapper.appendChild(element.firstChild)
  
  element.appendChild(wrapper);
  return element;
};

/**
 * This snippet fully duplicates what prototype does when initializing Element.extend, 
 * but applied to a specified iframe document
 * I think we should expose "copy" function as a public method, for cases like this one
 * Tested in FF and Safari. Doesn't work in Opera.
 *
 **/
Element.extendIframe = function(element) {
  element = $(element);
  var proto = $(element).contentWindow.HTMLElement.prototype;
  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }
  copy(Element.Methods, proto);
  copy(Element.Methods.Simulated, proto, true);
  return element;
};

/**
 * Element.indexOf(@element) -> Number|undefined
 * returns index of element in its parent or undefined if parent does not exist
 *
 *    $(document.body).indexOf(); // 1
 *    $$('ul#nav li a.active')[0].indexOf(); // 12
 *
 **/
Element.Methods.indexOf = function(element) {
  var parent = $(element.parentNode);
  if (!parent) return;
  return parent.childElements().indexOf(element);
};

/**
 * Element.isTagName(@element, tagName) -> Boolean | null
 * returns true if element has tagName equal to the one specified
 * returns null if element has no tagName
 *
 *    $(document.body).isTagName('body'); // true
 *    $$('h2)[0].isTagName('span'); // false
 *
 **/
Element.Methods.isTagName = function(element, tagName) {
  if (!element.tagName) return null;
  return element.tagName.toUpperCase() == String(tagName).toUpperCase();
};

/**
 * Element.getContentWidth(@element) -> Number
 * returns element's "inner" width - without padding/border dimensions
 *
 *    $(someElement).getContentWidth(); // 125
 *
 **/
Element.Methods.getContentWidth = function(element) {
  return ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth']
    .inject(Element.getWidth(element), function(total, prop) {
      return total - parseInt(Element.getStyle(element, prop), 10);
    })
};

/**
 * Element.getContentHeight(@element) -> Number
 * returns element's "inner" height - without padding/border dimensions
 *
 *    $(someElement).getContentHeight(); // 141
 *
 **/
Element.Methods.getContentHeight = function(element) {
  return ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
    .inject(Element.getHeight(element), function(total, prop) {
      return total - parseInt(Element.getStyle(element, prop), 10);
    })
};

/**
 * Element.setWidth(@element, width) -> @element
 * sets element's width to a specified value 
 * or to a value of its content width (if value was not supplied)
 *
 *    $(someElement).setWidth();
 *    $(someOtherElement).setWidth(100);
 *
 **/
Element.Methods.setWidth = function(element, width) {
  return Element.setStyle(element, { 
    width: (Object.isUndefined(width) ? Element.getContentWidth(element) : width) + 'px'
  })
};

/**
 * Element.setHeight(@element, height) -> @element
 * sets element's height to a specified value 
 * or to a value of its content height (if value was not supplied)
 *
 *    $(someElement).setHeight();
 *    $(someOtherElement).setHeight(68);
 *
 **/
Element.Methods.setHeight = function(element, height) {
  return Element.setStyle(element, { 
    width: (Object.isUndefined(width) ? Element.getContentHeight(element) : height) + 'px'
  })
};

/**
 * Element.appearVisible(@element, effectOptions) -> @element
 * Assumes that element (the method is applied on) has style of "visibility:hidden"
 * Makes element appear from its state to a visible, by changing opacity
 *
 * requires: effects.js
 *
 **/
Element.Methods.appearVisible = function(element, options) {
  return Element.setOpacity(element, 0)
    .setStyle({ visibility: 'visible' })
    .morph('opacity:1', options);
};

/**
 * Element.delegate(@element, eventName, selector, handler) -> element
 * Invokes handler when specified element receives an event from one of its siblings (via bubbling)
 * A cornerstone of "event delegation"
 *
 *    document.delegate('click', 'a.foo', function(e) {
 *      e.stop();
 *      // original even is passed through
 *      // handler is called in a context of an element which was first to match the selector
 *      // ("a.foo" in this case) 
 *    })
 *
 **/
Element.Methods.delegate = function(element, eventName, selector, handler) {
  if (Object.isElement(selector)) {
    return Event.observe(element, eventName, function(e) {
      if (e.target == selector || e.target.descendantOf(selector))
        handler.call(selector, e);
    })
  }
  else {
    return Event.observe(element, eventName, function(e, element) {
      if (!(element = e.findElement(selector))) return;
      handler.call(e.target, e);
    })
  }
};
document.delegate = Element.Methods.delegate.curry(document);

/**
 * Element#fillDocument(@element) -> @element
 * Sets element's dimensions to completely fill document (not viewport) 
 * a.k.a modal-page-overlay
 *
 **/
Element.Methods.fillDocument = function(element) {
  element = $(element);
  var vpDim = document.viewport.getDimensions();
  var docDim = $(document.documentElement).getDimensions();
  element.style.width = Math.max(docDim.width, vpDim.width) + 'px';
  element.style.height = Math.max(docDim.height, vpDim.height) + 'px';
  return element;
};

/**
 * Element#centerInViewport(@element) -> @element
 * Centers element in a vieport. Element should be absolutely positioned.
 *
 **/
Element.Methods.centerInViewport = function(element) {
  element = $(element);
  var vpDim = document.viewport.getDimensions();
  var offsets = document.viewport.getScrollOffsets();
  var elDim = Element.getDimensions(element);
  element.style.left = (((vpDim.width - elDim.width) / 2) + offsets.left)  + 'px';
  element.style.top = (((vpDim.height - elDim.height) / 2) + offsets.top) + 'px';
  return element;
};

Element.Methods.vExpand = function(element, options) {
  element = $(element);
  if (Element.visible(element)) return element;
  Element.show(element);
  var top = parseFloat(Element.getStyle(element, 'paddingTop'), 10);
  var bottom = parseFloat(Element.getStyle(element, 'paddingBottom'), 10);
  var height = Element.getContentHeight(element);
  var style = 'height:'+ height +'px;padding-top:'+ top +'px;padding-bottom:'+ bottom +'px;opacity:1';
  Element.setStyle(element, { height: 0, paddingTop: 0, paddingBottom: 0 });
  return Element.morph(element, style, Object.extend(options || { }, {
    afterFinish: function() {
      Element.setStyle(element, { height: 'auto' })
    }
  }))
};

Element.Methods.vCollapse = function(element, options) {
  element = $(element);
  if (!Element.visible(element)) return element;
  return Element.morph(element, 'height:0px;padding-top:0px;padding-bottom:0px;opacity:0', Object.extend(options || {}, {
    afterFinish: function() {
      Element.hide(element).setStyle({ height: '', paddingTop: '', paddingBottom: '' });
    }
  }))
};
 
/**
 * Element#vToggle(@element, options) -> @element
 * - @element(DOMElement): element to toggle
 * - options(Object): standard effect options (for effect fine tuning)
 *
 * Toggles element by morphing its height/opacity back and forth. 
 * Works safely with paddings
 * 
 * requires: Element#getContentHeight
 *
 *
 **/
Element.Methods.vToggle = function(element, options) {
  return Element[Element.visible(element) ? 'vCollapse' : 'vExpand'](element, Object.extend(options || { }, {
    queue: { limit: 1, position: 'end', scope: element.identify() }
  }));
};

Element.addMethods();