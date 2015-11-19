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
	var self = this;
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
	self.onProgress = options.onProgress;
	self.onSuccess = options.onSuccess;
	self.onError = options.onError;
	self.onStarted = options.onStarted;
	self.onFinished = options.onFinished;
	self.fileField = options.fileField ? options.fileField : "upfile";
	self.appendData = options.appendData ? options.appendData : {};
	self.requestHeaders = options.requestHeaders ? options.requestHeaders : {};
	self.targetUrl = options.targetUrl;

	self.singleRequest = options.singleRequest ? options.singleRequest : false;

	var files = [];
	var lastFileId = 0;

	self.addFile = function(_file, options, file_field) {
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

	self.addFiles = function(_files, options) {
		for(var k in _files) {
			self.addFile(_files[k], options, k);
		}
	};

	self.removeFile = function(fileid) {
		for(var i = 0; i < files.length; i++) {
			if(files[i].id == fileid) {
				return files.splice(i, 1);
			}
		}
		return null;
	};

	self.finish = function(nSuccess, nError, nTreated) {
		if(self.onFinished) {
			self.onFinished({
				total: nTreated,
				succeed: nSuccess,
				failed: nError
			});
		}
	};

	self.setSingleRequest = function(flag) {
		self.singleRequest = flag;
	};

	var uploadSingleRequest = function() {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		if(self.onStarted) {
			self.onStarted(null, xhr);
		}
		xhr.upload.items = [];
		for(var k in self.requestHeaders) {
			xhr.setRequestHeader(k, self.requestHeaders[k]);
		}
		for(var i = 0; i < files.length; i++) {
			xhr.upload.items.push(files[i]);
			formData.append(files[i].fileField ? files[i].fileField : (self.fileField+i), files[i].file);
		}
		for(var k in self.appendData) {
			formData.append(k, self.appendData[k]);
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
		for(var i = 0; i < files.length; i++) {
			var item = files[i];
			var xhr = new XMLHttpRequest();
			if(self.onStarted) {
				self.onStarted(item, xhr);
			}
			xhr.upload.item = item;
			for(var k in self.requestHeaders) {
				xhr.setRequestHeader(k, self.requestHeaders[k]);
			}
			var formData = new FormData();
			formData.append(self.fileField, item.file);
			for(var k in self.appendData) {
				formData.append(k, self.appendData[k]);
			}
			xhr.upload.addEventListener('progress', function(ev) {
				if(ev.lengthComputable) {
					if(self.onProgress) {
						self.onProgress(self.item, ev.loaded, ev.total);
					}
				} else {
					if(self.onProgress) {
						self.onProgress(self.item);
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

	self.upload = function() {
		if(!self.singleRequest) {
			uploadMultiRequest();
		} else {
			uploadSingleRequest();
		}
	};

	self.clear = function() {
		files = [];
	};
};
