function wrapPreserve(element, wrapper) {
  function wrap(element, wrapper) {
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
  }
  function copyPositionStyles(element, other) {
    var view = document.defaultView;
    var currentStyle = (view && view.getComputedStyle)
      ? view.getComputedStyle(element, '')
      : element.currentStyle;

    // copy display
    other.style.display = currentStyle.display;

    // copy position (only if non-static)
    if (currentStyle.position !== 'static') {
      other.style.position = currentStyle.position;
    }

    // copy top/left only if {relative|absolute}
    if (/^(?:relative|absolute)$/.test(currentStyle.position)) {
      other.style.left = currentStyle.left;
      other.style.top = currentStyle.top;
      // remove from element itself
      element.style.left = '0';
      element.style.top = '0';
    }

    if (currentStyle.styleFloat !== 'none') {
      other.style.styleFloat = currentStyle.styleFloat;
    }

    // copy margin values
    other.style.marginLeft = currentStyle.marginLeft;
    other.style.marginTop = currentStyle.marginTop;

    // only clear margin values if they are non-0
    if (parseInt(currentStyle.marginLeft, 10)) {
      element.style.marginLeft = '0';
    }
    if (parseInt(currentStyle.marginTop, 10)) {
      element.style.marginTop = '0';
    }
  }
  copyPositionStyles(element, wrapper);
  wrap(element, wrapper);
}