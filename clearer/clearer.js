function Clearer(elInput) {
  this.elInput = elInput;
  this.init();
}

Clearer.prototype = {
  init: function() {
    // attach ev. handlers
    this.elInput.onfocus = 
    this.elInput.onblur = 
    this.elInput.onkeyup = 
      (function(_this){ // quick and dirty bind
        return function(e) {
          _this.evHandler(e);
        }
      })(this);
    this.buildElements();
  },
  buildElements: function() {
    
    // create clearer element
    this.elClearer = document.createElement('span');
    this.elClearer.innerHTML = 'x';
    this.elClearer.className = 'clearer';
    
    // initialize clearer visibility
    this.elClearer.style.display = this.elInput.value ? '' : 'none';
    
    // init clearer behavior
    this.elClearer.onmousedown = (function(elInput) {
      return function(e) {
        e = e || window.event;
        elInput.value = '';
        window.setTimeout(function(){
          elInput.focus();
        }, 10);
      }
    })(this.elInput);
    
    // append remover to input
    var elWrapper = document.createElement('div');
    elWrapper.style.position = 'relative';
    wrapPreserve(this.elInput, elWrapper);
    elWrapper.appendChild(this.elClearer);
  },
  show: function() {
    if (this.elInput.value) {
      this.elClearer.style.display = '';
    }
  },
  hide: function() {
    this.elClearer.style.display = 'none';
  },
  evHandler: function(e) {
    if (e.type === 'keyup' && e.keyCode === 27 /*ESC*/) {
      this.elInput.value = '';
    }
    this[this.elInput.value ? 'show' : 'hide']();
  }
}