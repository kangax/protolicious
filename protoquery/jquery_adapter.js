$Q.addMethods({
  width: function(value) {
    return Object.isUndefined(value)
      ? this.first().getWidth()
      : this.setStyle({ width: value + 'px' });
  },
  height: function(value) {
    return Object.isUndefined(value)
      ? this.first().getHeight()
      : this.setStyle({ height: value + 'px' });
  },
  offset: function() {
    return this.first().cumulativeOffset();
  },
  css: function(name, value) {
    if (!Object.isUndefined(value))
      return this.setStyle({ name: value }); // set single name/value
    else
      return Object.isString(name)
        ? this.first().getStyle(name) // get value
        : this.setStyle(name); // set object
  }
})