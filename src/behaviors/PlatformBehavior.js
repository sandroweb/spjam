module.exports = function PlatformBehavior(container, properties) {

	var view = new PIXI.DisplayObjectContainer();
	view.position.x = properties.x;
	view.position.y = properties.y;

	container.addChild(view);

	setupSkin();

	function setupSkin()
	{
		var w = 40;
		var h = 40;
		var cols = Math.floor(properties.width/w);
		var rows = Math.floor(properties.height/h);
		var amount = cols*rows;
		var px = 0;
		var py = 0;
		

		for (var i = 0; i < amount; i++)
		{
			px = i%cols;
			py = Math.floor(i/cols);
			var textureName = py == 0 ? "tileWood01.png" : "tileWood02.png";
			var texture = PIXI.Texture.fromImage(textureName);
			var tile = new PIXI.Sprite(texture);
			tile.position.x = px*w;
			tile.position.y = py*h;
			view.addChild(tile);
		}	
	}

	

	this.update = function()
	{

	}

	this.view = view;
}
