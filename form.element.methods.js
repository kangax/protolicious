/**
 * Returns true when element's value is "blank" (consists of 0 or more whitespaces)
 *
 */
Field.Methods.isBlank = function(element) {
  return $F(element).blank();
}

/**
 * Boosts Field#present to work somewhat more reasonably 
 * with any form control (element with type attribute)
 * 
 * - "reset, submit, button and hidden" always return true
 * - "text, password and file" return true if value attribute is anything but whitespace
 * - "checkbox" return true if checked attribute is not false
 * - "radio" return true if either checked attribute is not false 
 *   or any of the input elements with the same name have checked attribute and it's not false
 * - "select" return true if selectedIndex attribute is not -1
 *
 */
Field.Methods.present = function(element) {
  if (!(element = $(element)) && !element.type) return;
  var t = element.type;
  return ((/text|password|file/.test(t) && !element.value.blank()) ||
    /reset|submit|button|hidden/.test(t) ||
    (t == 'checkbox' && element.checked) ||
    (t == 'radio' && (element.checked || $$('input[name=' + element.name + ']:checked').length))
    (/select-one|select-multiple/.test(t) && element.selectedIndex != -1));
};

/**
 * 
 *
 **/
Field.Methods.selectOptionByValue = function(element, value) {
  var index = 0;
  element = $(element); 
  value = parseInt(value, 10);
  Element.childElements(element).each(function(element, i) {
    if (element.value == value) {
      index = i;
      throw $break;
    }
  })
  element.selectedIndex = index;
  return element;
};

Element.addMethods();