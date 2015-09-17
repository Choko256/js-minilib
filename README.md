# JS Minilib

Minimalist modular library for Javascript developers. Each module can be included separately in your HTML files. If you need all the modules, you can include `minilib-full.js`.

## Ajax HTTP

A basic Ajax singleton object which can be called from everywhere. **This module needs jQuery 1.6+.**

### GET Requests

To send a GET request, you must use the `get` function of the HTTP object.

```javascript
var request = HTTP.get('someurl');
request.success(function(response) {
   ...
});
request.error(function(status, error) {
   ...
});
```

Every function of the `request` object returns itself, so you can nest the calls.

```javascript
HTTP.get('someurl')
.success(function(response) {
...
})
.error(function(status, error) {
...
});
```

If you want to add some parameters in your GET request :

```javascript
HTTP.get('someurl?p1=v1&p2=v2')
```

You can also add parameters in the second argument of the method function :
```javascript
HTTP.get('someurl', {
   p1: 'v1',
   p2: 'v2'
});
```

The request will be exactly the same.


### POST Requests

To send a POST request, you must use the `post` function of the HTTP object.
```javascript
HTTP.post('someurl')
```

As in the GET requests, you can add parameters and nest the results callbacks.
```javascript
HTTP.post('someurl', {
	p1: 'v1',
    p2: 'v2'
}).success(function(response) {
    // Here is my callback
}).error(function(status, error) {
	// Here is my error callback
});
```


### Callbacks

 * `success(callback)`

The callback is triggered when the status of the response is HTTP 200. The callback is called with the text response in argument.

 * `error(callback)`

The callback is triggered when the status of the response is not HTTP 200. The callback is called with the HTTP status code and the HTTP error text. If there is an error on the server and did not respond to the request, for example with a 500 Internal Server Error, the callback will be called with the code 500 and the text "Internal Server Error".


## Uploady

Uploady is a minimalist module for asynchronous file upload in pure Javascript.

```javascript
var uploady = new Uploady();
```

There is no visual components in this library, but only the backend process of sending files to a specified URL.

### Configuration

```javascript
var uploady = new Uploady({
	/*
    	fileField: Name of the POST parameter sent to server 
    	where the file will be sent.
        If `singleRequest` is `true`, an index integer will be appended
        for each file sent.
    */
    fileField: "filename",
    /*
    	singleRequest: By default, Uploady will sent one request
        per file. You can override this behaviour by setting
        `singleRequest` to `true`
    */
    singleRequest: false,
    /*
    	requestHeaders: Additional custom HTTP headers to add
        to the request
    */
    requestHeaders: {},
    /*
    	targetUrl: URL of the server where Uploady will send the file(s)
    */
    targetUrl: "someurl.example.com",
    /*
    	appendData: Additional data to send with the file in the POST request
    */
    appendData: {
    	p1: 'v1',
        p2: 'v2',
    },
    /*
    	onSuccess: Function called each time a file has been uploaded
        successfully
        	- data: object containg response information
        		- response: Text response of the request
        		- file: File object (null in case of single request)
    */
    onSuccess: function(data) {
    	console.log("File " + data.file.name + " sent !");
    },
    /*
    	onError: Function called each time a file request get an
        error response
        	- data: object containing response information
        		- status: Status code of the HTTP response
        		- file: File object (null in case of single request)
    */
    onError: function(data) {
    	console.log("File " + data.file.name + " error " + data.status);
    },
    /*
    	onProgress: Function called when upload progress changed
        	- item: File Item (null in case of single request)
        	- current: Current bytes sent
        	- total: Total bytes to send
        If `singleRequest` is `true`, `total` will be the sum of all the files sizes
    */
    onProgress: function(item, current, total) {
    	console.log("File " + item.fileName() + " - " + current + "/" + total + " bytes sent");
    },
    /*
    	onStarted: Function called for each file when Uploady
        starts to upload it
        	- item: File Item (null in case of single request)
        	- xhr: Associated XMLHTTPRequest object
    */
    onStarted: function(item, xhr) {
    	console.log("File " + item.fileName() + " started !");
    },
    /*
    	onFinished: Function called when there is no more files in
        the queue.
        /!\ This function is called even if a file request returns an error !
        	- data: object containing uploading information
        		- total: Total files count
        		- succeed: Successful requests count
        		- failed: Failed requests count
    */
    onFinished: function(data) {
    	console.log("Finished! " + data.succeed + " success, " + data.failed + " failed");
    }
});
```

When you have configured your Uploady instance, you can add files to it :

```javascript
uploady.addFile(file, options);
```

You can add everything you want in the options object, you can retreive them in the different callbacks when the File Item is returned.
The `file` argument is an instance of the [object File](https://developer.mozilla.org/en-US/docs/Web/API/File) of the Web API.

### Sending files

When you have added your files to your `Uploady` instance, you just have to send them :

```javascript
uploady.upload();
```


## License

Minilib is under the terms specified in the [LICENSE](/LICENSE) file.

## About

The minilib javascript library is maintained by Michael Chacaton.
