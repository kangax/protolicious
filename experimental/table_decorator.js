var TableDecorator = Class.create({
  initialize: function(element) {
    this.element = $(element);
  },
  toElement: function() {
    return this.element;
  },
  getHeadRows: function() {
    return $A(this.element.tHead.rows);
  },
  getBodyRows: function() {
    return $A(this.element.tBodies[0].rows);
  },
  getHeadCells: function(index) {
    return this.getHeadRows().map(function(row) {
      return $A(row.cells)[index];
    })
  },
  getBodyCells: function(index) {
    return this.getBodyRows().map(function(row) {
      return $A(row.cells)[index];
    })
  }
})