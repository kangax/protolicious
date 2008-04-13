var Proto = Proto || { };

/**
 * class Proto.FormDispatcher(element) -> Element
 * - element(FormElement): element to observe
 *
 * Dispatches custom event when form's state changes.
 * The event is dispatched by the form element itself.
 * Rules for determining 'state change' can be customized via (static) Proto.FormDispatcher.rules
 * Name of event can be changed via (static) Proto.FormDispatcher.eventName
 *
 *    new Proto.FormDispatcher('myForm');
 *    
 *    document.observe('state:changed', function(e) {
 *      var element = e.memo.element;
 *      alert( element + ' was changed, and its value is now ' + $F(element) );
 *    })
 *
 **/
Proto.FormDispatcher = Class.create({
  eventName: 'state:changed',
  rules: {
    'input[type=text]': 'keyup',
    'textarea': 'keyup',
    'input[type=checkbox]': 'click',
    // TODO 'input[type=radio]': ''
    'select': 'change'
  },
  initialize: function(element) {
    if (!(this.element = $(element)))
      throw new Error('Constructor requires DOMElement');
    
    this.formElements = this.element.getElements();
    this.initObservers();
  },
  initObservers: function() {
    this.formElements.each(function(element) {
      for (var rule in this.rules) {
        if (element.match(rule)) {
          element.observe(this.rules[rule], function() {
            this.element.fire(Proto.FormDispatcher.eventName, { 
              element: element
            });
          }.bind(this));
          return;
        }
      }
    }, this);
  }
})