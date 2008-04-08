/**
 *  Simplified version of a UI.DragHelper
 *  http://svn.prototype-ui.com/public/prototype-ui/trunk/src/util/drag.js
 *
 */
 (function() {
   var initPointer, currentDraggable, dragging;

   document.observe('mousedown', onMousedown);

   function onMousedown(event) {
     var draggable = event.findElement('[ui:draggable="true"]');

     if (draggable) {
       // prevent default browser action
       event.stop();
       currentDraggable = draggable;
       initPointer = event.pointer();

       document.observe("mousemove", onMousemove)
               .observe("mouseup",   onMouseup);
     }
   };

   function onMousemove(event) {
     event.stop();

     if (dragging)
       fire('drag:updated', event);
     else {
       dragging = true;
       fire('drag:started', event);
     }
   };

   function onMouseup(event) {
     document.stopObserving('mousemove', onMousemove)
             .stopObserving('mouseup',   onMouseup);

     if (dragging) {
       dragging = false;
       fire('drag:ended', event);
     }
   };

   function fire(eventName, mouseEvent) {
     var pointer = mouseEvent.pointer();

     currentDraggable.fire(eventName, {
       dx: pointer.x - initPointer.x,
       dy: pointer.y - initPointer.y,
       mouseEvent: mouseEvent
     })
   };

   Element.addMethods({
     enableDrag: function(element) {
       element = $(element);
       element.writeAttribute('ui:draggable', 'true');
       return element;
     },

     disableDrag: function(element){
       element = $(element);
       element.writeAttribute('ui:draggable', null);
       return element;
     },

     isDraggable: function(element) {
       return $(element).readAttribute('ui:draggable') == 'true';
     }
   });
 })();