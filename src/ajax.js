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
