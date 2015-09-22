"use strict";
/**
 * Event
 *
 * Event generic manager
 * Find docs on https://github.com/Choko256/js-minilib
 *
 * @license MIT License
 */
var EventThrower = function() {
	var Event = function(name, callback) {
		this.name = name;
		this.callback = callback;
	};
	var _events = {};

	this.on = function(event, callback) {
		if(!(event in _events)) {
			_events[event] = [];
		}
		_events[event].push(new Event(event, callback));
		return this;
	};

	this.off = function(event) {
		delete _events[event];
		return this;
	};

	this.trigger = function(event, args) {
		if(event in _events) {
			for(var i = 0; i < _events[event].length; i++) {
				var _ev = _events[event][i];
				if(_ev.callback) {
					_ev.callback.apply(args);
				}
			}
		}
		return this;
	};
};
