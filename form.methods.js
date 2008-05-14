/**
 * Form#unserialize(@element, source) -> Element
 * - @element(FormElement): Form element to fill with values
 * - source(Object | String): Source object where field values are taken from
 *
 * Fills form with values of a given object `source`. 
 * Each propertie name of `source` is compared to name attribute of a form element.
 *
 *    $('myForm').unserialize()
 *
 **/
Form.Methods.unserialize = function(element, source) {
  if (!(element = $(element)))
    throw new Error('DOMElement is required');
  
  source = Object.isString(source) 
    ? source.toQueryParams() 
    : source;
  
  element.getElements().each(function(element) {
    for (var name in source) {
      if (name == element.name)
        element.setValue(source[name]);
    }
  })
  return element;
};