Element.Region = Class.create({
  initialize: function(element) {
    this.element = $(element);
    var offset = this.element.cumulativeOffset();
    var dim = this.element.getDimensions();
    this.top = offset.top;
    this.left = offset.left;
    this.bottom = this.top + dim.height;
    this.right = this.left + dim.width;
  },
  contains: function(other) {
    return other.left >= this.left && 
      other.right <= this.right &&
      other.top >= this.top &&
      other.bottom <= this.bottom;
  },
  intersectsWith: function(other) {
    return ((other.left >= this.left && other.left <= this.right) ||
      (other.right >= this.left && other.right <= this.right)) && 
      ((other.top >= this.top && other.top <= this.bottom) ||
      (other.bottom >= this.top && other.bottom <= this.bottom));
  }
});