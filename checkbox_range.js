/**
 * Adds a multi-select behavior to a group of checkboxes (via a shift key modifier)
 *
 *    new CheckboxRange('.myCheckbox');
 *    new CheckboxRange(); // defaults to all "input[type=checkbox]" within a document
 *
 **/
var CheckboxRange = Class.create({
  initialize: function(elements) {
    this.elements = elements ? $$(elements) : $$('input[type=checkbox]');
    this.initObservers();
  },
  initObservers: function() {
    document.observe('click', function(e, el) {
      if (!(el = e.findElement('input[type="checkbox"]'))) return;
      if (e.shiftKey && this.lastChecked) {
        var currentIndex = this.elements.indexOf(el), 
            lastIndex = this.elements.indexOf(this.lastChecked);
        for (var i=Math.min(currentIndex, lastIndex); i<Math.max(currentIndex, lastIndex); i++) {
          this.elements[i].checked = true;
        }
      }
      if (el.checked) this.lastChecked = el;
    }.bind(this))
  }
})