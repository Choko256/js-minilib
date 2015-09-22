all:
	rm -f src/minilib-full.js
	cat src/*.js > ./minilib-full.js
	mv ./minilib-full.js src/minilib-full.js
	./uglify.sh
