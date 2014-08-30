default: build

build:
	./node_modules/browserify/bin/cmd.js src/main.js  -o build.js
	cat src/vendor/pixi.dev.js > app/App/pixi.dev.js
	./node_modules/browserify/bin/cmd.js src/main.js  -o app/App/build.js

watch:
	./node_modules/watchify/bin/cmd.js src/main.js --debug -o build.js
