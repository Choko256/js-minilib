all:
	rm -f src/minilib-full.js
	cat src/*.js > ./minilib-full.js
	mv ./minilib-full.js src/minilib-full.js
	uglifyjs --output dist/ajax.min.js src/ajax.js --compress --mangle --comments
	uglifyjs --output dist/uploady.min.js src/uploady.js --compress --mangle --comments 
	uglifyjs --output dist/minilib-full.min.js src/minilib-full.js --compress --mangle --comments
