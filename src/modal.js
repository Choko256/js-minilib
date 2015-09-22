"use strict";
/**
 * Modal
 * 
 * Simple Modal window utility
 * Find docs on https://github.com/Choko256/js-minilib
 *
 * @license MIT License
 */
var _ev_mode = false;
if(EventThrower) {
	_ev_mode = true;
}

var ModalWindow = function() {
	if(_ev_mode) {
		EventThrower.call(this);
	}

	this.init = function(container) {
		this._container = document.getElementById(container);
		this._container.style.display = 'none';

		this._return_value = null;

		if(_ev_mode) {
			this.trigger('init', [{'target': this._container}]);
		}
	};

	this.show = function() {
		if(this.backdrop) {
			var _backdrop = document.getElementById('modal-backdrop');
			if(!_backdrop) {
				var _body = document.getElementsByTagName("body")[0];
				_backdrop = document.createElement("div");
				_backdrop.setAttribute("id", "modal-backdrop");
				_backdrop.style.zIndex = "10";
				_backdrop.style.backgroundColor = "rgba(25, 25, 25, 0.4)";
				_backdrop.style.width = "100%";
				_backdrop.style.height = "100%";
				_backdrop.style.top = "0";
				_backdrop.style.left = "0";
				_backdrop.style.position = "absolute";
				if(this.backdrop === 'clickable') {
					var self = this;
					_backdrop.onclick = function(ev) {
						ev.preventDefault();
						self.hide();
					};
				}
				_body.appendChild(_backdrop);
			} else {
				_backdrop.style.display = 'block';
			}
		}
		if(this._container) {
			if(this.width) {
				this._container.style.width = this.width;
			} else {
				this._container.style.width = "60%";
			}
			if(this.height) {
				this._container.style.height = this.height;
			} else {
				this._container.style.height = "40%";
			}
			this._container.style.position = 'absolute';
			this._container.style.display = 'block';
			this._container.style.zIndex = '100';
			this._container.style.margin = "0 auto";
			this._container.style.overflow = "hidden";
			this._container.style.left = "0";
			this._container.style.right = "0";
			if(_ev_mode) {
				this.trigger('shown', [{'target': this._container}]);
			}
		}
	};

	this.hide = function() {
		if(this.backdrop) {
			var _backdrop = document.getElementById('modal-backdrop');
			if(_backdrop) {
				_backdrop.style.display = 'none';
			}
		}
		if(this._container) {
			this._container.style.display = 'none';
			if(_ev_mode) {
				this.trigger('hidden', [{'target': this._container, 'value': this._return_value}]);
			}
		}
	};

	this.setValue = function(value) {
		this._return_value = value;
	};
	this.getValue = function() {
		return this._return_value;
	};
};
ModalWindow.prototype = Object.create(EventThrower.prototype);
ModalWindow.prototype.constructor = ModalWindow;

var Modal = (function() {
	var self = {};
	if(_ev_mode) {
		self = Object.create(EventThrower);
	}

	/**
	 * Possible options:
	 * 		width: Force modal width in pixels (default: null)
	 *		height: Force modal height in pixels (default: null)
	 *		backdrop: Determine if there is a backdrop behind the modal (default: false)
	 */
	self.init = function(container, options) {
		var mw = new ModalWindow();
		mw.init(container);
		for(var k in options) {
			if(!(k in mw)) {
				mw[k] = options[k];
			}
		}
		return mw;
	};

	return self;
})();
