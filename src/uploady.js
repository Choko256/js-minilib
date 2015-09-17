/**
 * Uploady v1.0
 * 
 * File upload manager in pure Javascript
 * Find docs on https://github.com/Choko256/uploady
 * 
 * MIT License
 */

var Uploady = function(options) {

	var UploadyFile = function(fileid, file, options) {
		this.id = fileid;
		this.file = file;
		
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

	this.addFile = function(_file, options) {
		var item = new UploadyFile(lastFileId, _file);
		for(var k in options) {
			item[k] = options[k];
		}
		files.push(item);
		lastFileId++;
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
			formData.append(this.fileField + i, files[i].file);
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