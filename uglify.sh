#!/bin/bash

MODULES="ajax event modal uploady"

for mod in $MODULES
do
	uglifyjs --output dist/$mod.min.js src/$mod.js --compress --mangle --comments
done
uglifyjs --output dist/minilib-full.min.js src/minilib-full.js --compress --mangle --comments