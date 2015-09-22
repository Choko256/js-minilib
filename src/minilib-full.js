"use strict";
/**
 * Ajax HTTP
 * 
 * Ajax asynchronous singleton object
 * Find docs on https://github.com/Choko256/js-minilib
 * 
 * @license MIT License
 */

var HTTP = (function() {
	var HTTPRequest = function(method, url, params, headers) {
		var self = this;
		self._method = method;
		self._url = url;
		self._params = params ? params : {};
		self._headers = headers;

		self.run = function(success, failure) {
			$.ajax({
				url: self._url,
				type: self._method,
				data: self._params,
				headers: self._headers
			}).done(function(response, status, xhr) {
				success(response);
			}).fail(function(xhr, status, error) {
				failure(status, error);
			});
		};
	};

	var self = {};
	var promise = null;

	self.get = function(url, params, headers) {
		promise = new Promise(function(resolve, reject) {
			var _r = new HTTPRequest('GET', url, params, headers);
			_r.run(resolve, reject);
		});
		return self;
	};

	self.post = function(url, params, headers) {
		promise = new Promise(function (resolve, reject) {
			var _r = new HTTPRequest('POST', url, params, headers);
			_r.run(resolve, reject);
		});
		return self;
	};

	self.success = function(callback) {
		promise.then(callback);
		return self;
	};

	self.error = function(callback) {
		promise.catch(callback);
		return self;
	};

	return self;
})();
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
"use strict";
/**
 * Uploady v1.0
 * 
 * File upload manager in pure Javascript
 * Find docs on https://github.com/Choko256/js-minilib
 * 
 * @license MIT License
 */

var Uploady = function(options) {

	var UploadyFile = function(fileid, file, file_field) {
		this.id = fileid;
		this.file = file;
		this.fileField = file_field;
		
		this.fileName = function() {
			return this.file.name;
		};
	};

	if(typeof(options) !== 'object') {
		options = {};
	}
	this.onProgress = options.onProgress;
	this.onSuccess = options.onSuccess;
	this.onError = options.onError;
	this.onStarted = options.onStarted;
	this.onFinished = options.onFinished;
	this.fileField = options.fileField ? options.fileField : "upfile";
	this.appendData = options.appendData ? options.appendData : {};
	this.requestHeaders = options.requestHeaders ? options.requestHeaders : {};
	this.targetUrl = options.targetUrl;

	this.singleRequest = options.singleRequest ? options.singleRequest : false;

	var files = [];
	var lastFileId = 0;

	this.addFile = function(_file, options, file_field) {
		var item = new UploadyFile(lastFileId, _file);
		if(file_field) {
			item.fileField = file_field;
		}
		for(var k in options) {
			item[k] = options[k];
		}
		files.push(item);
		lastFileId++;
		return item;
	};

	this.addFiles = function(_files, options) {
		for(var k in _files) {
			this.addFile(_files[k], options, k);
		}
	};

	this.removeFile = function(fileid) {
		for(var i = 0; i < files.length; i++) {
			if(files[i].id == fileid) {
				return files.splice(i, 1);
			}
		}
		return null;
	};

	this.finish = function(nSuccess, nError, nTreated) {
		if(this.onFinished) {
			this.onFinished({
				total: nTreated,
				succeed: nSuccess,
				failed: nError
			});
		}
	};

	this.setSingleRequest = function(flag) {
		this.singleRequest = flag;
	};

	var uploadSingleRequest = function() {
		var self = this;
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		if(this.onStarted) {
			this.onStarted(null, xhr);
		}
		xhr.upload.items = [];
		for(var k in this.requestHeaders) {
			xhr.setRequestHeader(k, this.requestHeaders[k]);
		}
		for(var i = 0; i < files.length; i++) {
			xhr.upload.items.push(files[i]);
			formData.append(files[i].fileField ? files[i].fileField : (self.fileField+i), files[i].file);
		}
		for(var k in this.appendData) {
			formData.append(k, this.appendData[k]);
		}

		xhr.upload.addEventListener('progress', function(ev) {
			if(ev.lengthComputable) {
				if(self.onProgress) {
					self.onProgress(null, ev.loaded, ev.total);
				}
			} else {
				if(self.onProgress) {
					self.onProgress(null);
				}
			}
		});
		xhr.addEventListener('readystatechange', function(ev) {
			if(this.readyState === 4) {
				if(this.status !== 200) {
					this.abort();
					if(self.onError) {
						self.onError({
							status: this.status,
							file: null
						});
					}
				} else {
					if(self.onSuccess) {
						self.onSuccess({
							response: this.responseText,
							file: null
						});
					}
				}
				self.finish();
			}
		});
		xhr.upload.addEventListener('error', function(ev) {
			if(self.onError) {
				self.onError({
					status: ev.target.status,
					file: null
				});
			}
			self.finish();
		});
		xhr.open('post', self.targetUrl, true);
		xhr.send(formData);
	};

	var uploadMultiRequest = function() {
		var nSuccess = 0, nError = 0, nTreated = 0;
		var self = this;
		for(var i = 0; i < files.length; i++) {
			var item = files[i];
			var xhr = new XMLHttpRequest();
			if(this.onStarted) {
				this.onStarted(item, xhr);
			}
			xhr.upload.item = item;
			for(var k in this.requestHeaders) {
				xhr.setRequestHeader(k, this.requestHeaders[k]);
			}
			var formData = new FormData();
			formData.append(this.fileField, item.file);
			for(var k in this.appendData) {
				formData.append(k, this.appendData[k]);
			}
			xhr.upload.addEventListener('progress', function(ev) {
				if(ev.lengthComputable) {
					if(self.onProgress) {
						self.onProgress(this.item, ev.loaded, ev.total);
					}
				} else {
					if(self.onProgress) {
						self.onProgress(this.item);
					}
				}
			});
			xhr.addEventListener('readystatechange', function(ev) {
				if(this.readyState === 4) {
					if(this.status !== 200) {
						this.abort();
						nError++;
						if(self.onError) {
							self.onError({
								status: this.status,
								file: this.upload.item.file
							});
						}
					} else {
						nSuccess++;
						if(self.onSuccess) {
							self.onSuccess({
								file: this.upload.item.file,
								response: this.responseText
							});
						}
					}
					nTreated++;
					if(nTreated == files.length) {
						self.finish();
					}
				}
			});
			xhr.upload.addEventListener('error', function(ev) {
				nError++;
				nTreated++;
				if(self.onError) {
					self.onError({
						status: ev.target.status,
						file: this.item.file
					});
				}
				if(nTreated == files.length) {
					self.finish();
				}
			});

			xhr.open('post', self.targetUrl, true);
			xhr.send(formData);
		}
	};

	this.upload = function() {
		if(!this.singleRequest) {
			uploadMultiRequest();
		} else {
			uploadSingleRequest();
		}
	};

	this.clear = function() {
		files = [];
	};
};
