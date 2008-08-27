Region = Class.create({
  initialize: function(bounds) {
    Object.extend(this, bounds);
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

Element.Region = Class.create(Region, {
  initialize: function($super, element) {
    this.element = $(element);
    var offset = this.element.cumulativeOffset();
    var dim = this.element.getDimensions();
    return $super({
      top: offset.top,
      left: offset.left,
      bottom: offset.top + dim.height,
      right: offset.left + dim.width
    })
  }
});