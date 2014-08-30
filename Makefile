default: build

build:
	cat src/vendor/pixi.dev.js \
		src/main.js > app/App/index.js
