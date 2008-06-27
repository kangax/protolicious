var Canvas = window.Canvas || {};

(function () {

	/**
	 * Img (Image) Element Class
	 *
	 * @namespace Canvas.Img
	 * @class Element
	 * @constructor
	 * @param el {HTMLElement | String} Container element for the canvas.
	 */
	Canvas.Img = function(el, oConfig) {
		/// this.rotateImage = new YAHOO.util.CustomEvent('rotateImage', this);
		this._initElement(el);
		this._initConfig(oConfig);
		this.setImageCoords();
	};
	
	/**
	 * Constant for the default CSS class name that represents a Canvas
     * @property Canvas.Img.CSS_CANVAS
     * @static
     * @final
     * @type String
     */
    Canvas.Img.CSS_CANVAS = "canvas-img";
	
	/**
     * Constant representing the Module's configuration properties
     * @property DEFAULT_CONFIG
     * @private
     * @final
     * @type Object
     */
     var DEFAULT_CONFIG = {

		"TOP": { 
		    key: "top", 
		    value: 10 
		},

		"LEFT": { 
		    key: "left", 
		    value: 10
		},

		"ANGLE": { 
		    key: "angle", 
		    value: 0  
		},

		"SCALE-X": { 
		    key: "scalex", 
		    value: 1
		},
		
		"SCALE-Y": { 
		    key: "scaley", 
		    value: 1
		},
		"CORNERSIZE": { 
		    key: "cornersize", 
		    value: 25
		},
		"BORDERWIDTH": { 
		    key: "borderwidth", 
		    value: 10
		},
		"POLAROIDHEIGHT": {
			key: "polaroidheight",
			value: 40
		},
		"RANDOMPOSITION": {
			key: "randomposition",
			value: true
		}
     };
	
	/**
     * The main element that contains the canvas
     * @property _oElement
     * @type object
     */
	Canvas.Img.prototype._oElement = null;

	/**
     * The object literal containing config parameters
     * @property oConfig
     * @type object
     */
	
	Canvas.Img.prototype.top = null;
	Canvas.Img.prototype.left = null;
	Canvas.Img.prototype.maxwidth = null;
	Canvas.Img.prototype.maxheight = null;
	Canvas.Img.prototype.oCoords = null;
	Canvas.Img.prototype.angle = null;
	Canvas.Img.prototype.theta = null;
	Canvas.Img.prototype.scalex = null;
	Canvas.Img.prototype.scaley = null;
	Canvas.Img.prototype.cornersize = null;
	Canvas.Img.prototype.polaroidheight = null;
	Canvas.Img.prototype.randomposition = null;
	
	Canvas.Img.prototype.selected = false;
	Canvas.Img.prototype.bordervisibility = false;
	Canvas.Img.prototype.cornervisibility = false;
	
	/**
     * The Image class's initialization method. This method is automatically 
     * called by the constructor.
     * @method _initElement
     * @param {HTMLElement | String} el The element representing the image
     */
	Canvas.Img.prototype._initElement = function(el) {
		this._oElement = $(el);
		this._oElement.addClassName(Canvas.Img.CSS_CANVAS)
	};

	/**
     * For now we use an object literal without methods to store the config params
	 * It checks if the user has passed any values through oConfig. Otherwise,
	 * it sets the values defined in DEFAULT_CONFIG
     * @method _initConfig
     * @param {Object} userConfig The configuration Object literal 
     * containing the configuration that should be set for this module. 
     * See configuration documentation for more details.
     */
	Canvas.Img.prototype._initConfig = function(oConfig) {
		var sKey;
		for (sKey in DEFAULT_CONFIG) {
			var defaultKey = DEFAULT_CONFIG[sKey].key;
			if (!oConfig.hasOwnProperty(defaultKey)) { // = !(defaultKey in oConfig)
				this[defaultKey] = DEFAULT_CONFIG[sKey].value;
			}
			else {
				this[defaultKey] = oConfig[defaultKey];
			}
		}
		
		if (this.bordervisibility) {
			this.currentBorder = this.borderwidth;
		}
		else {
			this.currentBorder = 0;
		}
		
		var normalizedSize = this.getNormalizedSize(this._oElement, parseInt(oConfig.maxwidth), parseInt(oConfig.maxheight));
		this._oElement.width = normalizedSize.width;
		this._oElement.height = normalizedSize.height;
		this.width = normalizedSize.width + (2 * this.currentBorder);
		this.height = normalizedSize.height + (2 * this.currentBorder);
		
		// set initial random position and angle if user hasnt specified them
		if (this.randomposition) {
			this._setRandomProperties(oConfig);
		}
		
		this.theta = this.angle * (Math.PI/180);
		
	};

	/**
	 * Method that resizes an image depending on whether maxwidth and maxheight are set up.
	 * Width and height have to mantain the same proportion in the final image as it was in the 
	 * initial one.
     * @method getNormalizedSize
     * @param {Object} userConfig The configuration Object literal 
     * @param {Integer} maximum width of the image in px 
     * @param {Integer} maximum height of the image in px 
     */	
	Canvas.Img.prototype.getNormalizedSize = function(oImg, maxwidth, maxheight) {
		if (maxheight && maxwidth && (oImg.width > oImg.height && (oImg.width / oImg.height) < (maxwidth / maxheight))) {
			// console.log('cas 2');
			// height is the constraining dimension.
			normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
			normalizedHeight = maxheight;
		}
		else if (maxheight && ((oImg.height == oImg.width) || (oImg.height > oImg.width) || (oImg.height > maxheight))) {
			// console.log('cas 1'); 
			// height is the constraining dimension.
			normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
			normalizedHeight = maxheight;
		}
		
		else if (maxwidth && (maxwidth < oImg.width)){ 
			// console.log('cas 3');
			// width is the constraining dimension.
			normalizedHeight = Math.floor((oImg.height * maxwidth) / oImg.width);
			normalizedWidth = maxwidth;
		}
		else {
			// console.log('cas 4');
			normalizedWidth = oImg.width;
			normalizedHeight = oImg.height;			
		}
		// console.log(normalizedWidth+":"+normalizedHeight);
		return { width: normalizedWidth, height: normalizedHeight }
	},
	
	Canvas.Img.prototype.getOriginalSize = function() {
		return { width: this._oElement.width, height: this._oElement.height }
	};
	
	/**
	 * Sets random angle, top and left of the image if the user hasnt specified
	 * specific ones.
     * @method _setRandomProperties
     * @param oConfig {Object} userConfig The configuration Object literal 
     * containing the configuration that should be set for this module. 
     * See configuration documentation for more details.
     */
	Canvas.Img.prototype._setRandomProperties = function(oConfig) {
		if (oConfig.angle == null) { // use YUI.lang
			this.angle = (Math.random() * 40) - 20;
		}
		
		if (oConfig.top == null) {
			this.top = this.height / 2 + Math.random() * 100;
		}
		
		if (oConfig.left == null) {
			this.left = this.width / 2 + Math.random() * 100;
		}
	};
	
	Canvas.Img.prototype.setBorderVisibility = function(showBorder) {
		// reset values
		this.width = this._oElement.width;
		this.height = this._oElement.height;
	
		if (showBorder) {
			this.currentBorder = this.borderwidth;
			this.width += (2 * this.currentBorder);
			this.height += (2 * this.currentBorder);
		}
		else {
			this.currentBorder = 0;
		}
		
		this.setImageCoords();
	};
	
	Canvas.Img.prototype.setCornersVisibility = function(visible) {
		this.cornervisibility = visible;
	};
	
	Canvas.Img.prototype.setPolaroidVisibility = function(showPolaroidFooter) {
		// reset values
		this.width = this._oElement.width;
		this.height = this._oElement.height;
		
		if (showPolaroidFooter) {
			// add borders and polaroid padding
			this.currentBorder = this.borderwidth;
			this.width += (2 * this.currentBorder);
			this.height += this.currentBorder + this.polaroidheight;
		}
		
		this.setImageCoords();
	};
	
	/**
     * It sets image corner position coordinates based on current angle,
	 * width and height.
     * @method setImageCoords
     */
	Canvas.Img.prototype.setImageCoords = function() {
		this.left = parseInt(this.left);
		this.top = parseInt(this.top);
		
		this.currentWidth = parseInt(this.width) * this.scalex;
		this.currentHeight = parseInt(this.height) * this.scalex;
		this._hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2));
		this._angle = Math.atan(this.currentHeight / this.currentWidth);
		
		// offset added for rotate and scale actions
		var offsetX = Math.cos(this._angle + this.theta) * this._hypotenuse;
		var offsetY = Math.sin(this._angle + this.theta) * this._hypotenuse;
		var theta = this.theta;
		var sinTh = Math.sin(theta);
		var cosTh = Math.cos(theta);
		
		var tl = {
			x: this.left - offsetX,
			y: this.top - offsetY
		};
		var tr = {
			x: tl.x + (this.currentWidth * cosTh),
			y: tl.y + (this.currentWidth * sinTh)
		};
		var br = {
			x: tr.x - (this.currentHeight * sinTh),
			y: tr.y + (this.currentHeight * cosTh)
		};
		var bl = {
			x: tl.x - (this.currentHeight * sinTh),
			y: tl.y + (this.currentHeight * cosTh)
		};
		// clockwise
		this.oCoords = { tl: tl, tr: tr, br: br, bl: bl };
		
		// set coordinates of the draggable boxes in the corners used to scale/rotate the image
		this.setCornerCoords();			
	};

	/**
     * It sets the coordinates of the draggable boxes in the corners of
	 * the image used to scale/rotate it.
     * @method setCornerCoords
     */	
	Canvas.Img.prototype.setCornerCoords = function() {
		// Calculate the rotate boxes.
		var coords = this.oCoords;
		var theta = this.theta;
		var cosOffset = this.cornersize * this.scalex * Math.cos(theta);
		var sinOffset = this.cornersize * this.scalex * Math.sin(theta);
		coords.tl.corner = {
			tl: {
				x: coords.tl.x,
				y: coords.tl.y
			},
			tr: {
				x: coords.tl.x + cosOffset,
				y: coords.tl.y + sinOffset
			},
			bl: {
				x: coords.tl.x - sinOffset,
				y: coords.tl.y + cosOffset
			}
		};
		coords.tl.corner.br = {
			x: coords.tl.corner.tr.x - sinOffset,
			y: coords.tl.corner.tr.y + cosOffset
		};
		
		coords.tr.corner = {
			tl: {
				x: coords.tr.x - cosOffset,
				y: coords.tr.y - sinOffset
			},
			tr: {
				x: coords.tr.x,
				y: coords.tr.y
			},
			br: {
				x: coords.tr.x - sinOffset,
				y: coords.tr.y + cosOffset
			}
		};
		coords.tr.corner.bl = {
			x: coords.tr.corner.tl.x - sinOffset,
			y: coords.tr.corner.tl.y + cosOffset
		};
		
		coords.bl.corner = {
			tl: {
				x: coords.bl.x + sinOffset,
				y: coords.bl.y - cosOffset
			},
			bl: {
				x: coords.bl.x,
				y: coords.bl.y
			},
			br: {
				x: coords.bl.x + cosOffset,
				y: coords.bl.y + sinOffset
			}
		};
		coords.bl.corner.tr = {
			x: coords.bl.corner.br.x + sinOffset,
			y: coords.bl.corner.br.y - cosOffset
		};
		
		coords.br.corner = {
			tr: {
				x: coords.br.x + sinOffset,
				y: coords.br.y - cosOffset
			},
			bl: {
				x: coords.br.x - cosOffset,
				y: coords.br.y - sinOffset
			},
			br: {
				x: coords.br.x,
				y: coords.br.y
			}
		};
		coords.br.corner.tl = {
			x: coords.br.corner.bl.x + sinOffset,
			y: coords.br.corner.bl.y - cosOffset
		};
	};
}());