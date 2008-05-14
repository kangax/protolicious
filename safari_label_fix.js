// Label support in Safari 2

document.observe('click', function(e) {
  var target = e.findElement('label[for]');
  if (!target) return;
  var input = $(target.readAttribute('for'));
  if (!input) return;
  input.focus();
  input.type && (/radio|checkbox/).test(input.type)) && input.click();
})