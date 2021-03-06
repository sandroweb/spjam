default: build

build:
	./node_modules/browserify/bin/cmd.js src/main.js  -o build.js
	cp -R level app/App/
	cp -R img app/App/
	cat src/vendor/pixi.dev.js > app/App/pixi.dev.js
	cat src/vendor/howler.min.js > app/App/howler.min.js
	./node_modules/browserify/bin/cmd.js src/main.js  -o app/App/build.js

watch:
	./node_modules/watchify/bin/cmd.js src/main.js --debug -o build.js
