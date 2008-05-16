/**
 * Fires "validation:failed" on a document, 
 * when any form that has "blank" fields 
 * with class "should-be-present" is submitted
 *
 * Passes "failed" elements as "elements" property on event's memo
 *
 **/
document.observe('submit', function(e) {
  var required = e.target.select('.should-be-present')
    .findAll(function(el) { return $F(el).blank() })
  if (required.length) {
    e.stop();
    document.fire('validation:failed', { elements: required });
  }
})