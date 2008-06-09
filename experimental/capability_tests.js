// IE and Opera are missing .innerHTML support for TABLE-related and SELECT elements
var selectCanBeUpdated = (function(){
  var select = document.createElement('select');
  select.innerHTML = '<option>test<\/option>';
  var firstChild = select.childNodes[0];
  return !!(firstChild && 
    firstChild.tagName && 
    firstChild.tagName.toUpperCase() == 'OPTION');
})();