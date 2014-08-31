

module.exports = 
{
	getTextures:  function(prefix, numFrames, sufix)
	{
		if (sufix == null) sufix = "";
		var textures = [];
		var i = numFrames;
		while (i > 0) 
		{
			var id = this.intToString(i, 2);
			var texture = PIXI.Texture.fromFrame(prefix+id+sufix);
			textures.push(texture);
			i--;
		}

		textures.reverse();
	    return textures;
	},

	intToString: function(value, length)
	{
		var str = value.toString();
		var strlen = str.length;
		var i = length - strlen;
		while (i--) str = "0" + str; 
		return str;
	}
}