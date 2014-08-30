default: build

build:
	./node_modules/browserify/bin/cmd.js src/main.js -o build.js

watch:
	./node_modules/watchify/bin/cmd.js src/main.js --debug -o build.js
