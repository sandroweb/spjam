module.exports = function ParticleSystem(particlesConfig)
{
	var view = null;
	var properties = null;
	var firstParticle = null;
	var lastParticle = null;
	var nextParticle = 0;
	var count = 0;
	var numParticles = 20;
	var images = [];
	var self = this;
	var paused = false;

	self.emissionsInterval = 1;
	self.emissionsPerUpdate = 1;

	Math.randomRange = function(min, max, rounded)
	{
		var diff = max - min;
		var result = min + diff*Math.random();
		if (rounded) result = Math.round(result);
		return result;
	}

	init();

	function init()
	{
		view = new PIXI.DisplayObjectContainer();
		properties = new ParticleProperties();
		setup(particlesConfig);
	}

	function setup(config)
	{
		clear();

		if (config.numParticles != null) numParticles = config.numParticles;
		if (config.images != null) images = config.images;
		if (config.emissionsInterval != null) self.emissionsInterval = config.emissionsInterval;
		if (config.emissionsPerUpdate != null) self.emissionsPerUpdate = config.emissionsPerUpdate;
		if (config.alpha != null) view.alpha = config.alpha;

		if (config.properties != null) {
			for (var field in config.properties) {
				properties[field] = config.properties[field];
			}	
		}

		var j = 0;
		for (var i = 0; i < numParticles; i++) {
			var p = new Particle(images[j]);
			view.addChild(p.view);
			if (firstParticle == null) firstParticle = p;
			if (lastParticle != null) lastParticle.next = p;
			lastParticle = p;
			j++;
			if (j >= images.length) j = 0;
		}

		nextParticle = firstParticle;
	}

	function clear()
	{
		var p = firstParticle;
		while (p != null) {
			p.dispose();
			p = p.next;
		}

		firstParticle = null;
		lastParticle = null;
		nextParticle = null;
	}

	function update(timestamp)
	{
		if (count == 0 && !paused) emit(self.emissionsPerUpdate);
		count++;
		if (count == self.emissionsInterval) count = 0;

		var p = firstParticle;
		while (p != null) {
			if (p.living) {
				p.update(timestamp);
			}
			p = p.next;
		}
	}

	function emit(amount)
	{
		while (amount--) {
			var p = nextParticle;
			if (p == null) p = firstParticle;
			p.spawn(properties);	
			nextParticle = p.next;
		}
	}

	function getCount()
	{
		return count;
	}

	function pauseEmissions()
	{
		paused = true;
	}

	function resumeEmissions()
	{
		paused = false;
	}

	function dispose()
	{
		clear();
		if (view && view.parent) view.parent.removeChild(view);
		view = null;
	}

	this.setup = setup;
	this.properties = properties;
	this.view = view;
	this.update = update;
	this.emit = emit;
	this.getCount = getCount;
	this.pauseEmissions = pauseEmissions;
	this.resumeEmissions = resumeEmissions;
	this.dispose = dispose;

}

	// INTERNAL CLASSES -----------------------------------------------------------------------

	Particle = function(image)
	{
		var view = null;
		var properties = null;
		var params = null;
		var self = this;

		init();

		function init()
		{
			view = PIXI.Sprite.fromFrame(image);
			view.anchor.x = 0.5;
			view.anchor.y = 0.5;
			properties = new ParticleProperties();
			view.visible = false;

			params = {};
			params.lifeCount = 0;
			params.lifeTotal = 0;
			params.alphaTime = 0.0;
			params.fadeInEvolution = 0.0;
			params.fadeOutEvolution = 0.0;
			params.stepToStartFadeOut = 0;

			properties = {};
		}

		this.living = false;
		this.next = null;
		this.view = view;
		this.properties = properties;
		this.params = params;
	}

	Particle.prototype.spawn = function(newProperties)
	{
		var self = this;
		var properties = this.properties;
		var params = this.params;
		var view = this.view;

		for (var field in newProperties) {
			properties[field] = newProperties[field];
		}

		this.living = true;

		params.lifeCount = properties.life + Math.round(Math.random()*properties.randomLife);
		params.lifeTotal = params.lifeCount;

		view.visible = true;
		view.position.x = properties.centerX + Math.randomRange(-properties.randomSpawnX, properties.randomSpawnX);
		view.position.y = properties.centerY + Math.randomRange(-properties.randomSpawnY, properties.randomSpawnY);
		view.scale.x = view.scale.y = properties.scale;
		view.alpha = properties.alphaStart;

		if (properties.randomVelocityX != 0) {
			properties.velocityX += Math.randomRange(-properties.randomVelocityX, properties.randomVelocityX);
		}

		if (properties.randomVelocityY != 0) {
			properties.velocityY += Math.randomRange(-properties.randomVelocityY, properties.randomVelocityY);
		}

		if (properties.randomForceX != 0) {
			properties.forceX += Math.randomRange(-properties.randomForceX, properties.randomForceX);
		}

		if (properties.randomForceY != 0) {
			properties.forceY += Math.randomRange(-properties.randomForceY, properties.randomForceY);
		}

		if (properties.randomScale != 0) {
			view.scale.x = view.scale.y = properties.scale + Math.randomRange(-properties.randomScale, properties.randomScale);
		}

		if (properties.randomTorque != 0) {
			properties.torque += Math.randomRange(-properties.randomTorque, properties.randomTorque);
		}

		params.alphaTime = Math.round(params.lifeCount*properties.alphaRatio);
		params.fadeInEvolution = (1.0 - properties.alphaStart)/params.alphaTime;
		params.fadeOutEvolution = (1.0 - properties.alphaFinish)/params.alphaTime;
		params.stepToStartFadeOut = params.alphaTime;
	}

	Particle.prototype.update = function(timestamp)
	{
		var self = this;
		var properties = this.properties;
		var params = this.params;
		var view = this.view;

		if (!self.living) return;

		view.position.x += properties.velocityX;
		view.position.y += properties.velocityY;
		view.rotation += properties.torque;
		properties.velocityX += properties.forceX;
		properties.velocityY += properties.forceY;

		if (params.lifeCount > params.lifeTotal - params.alphaTime) {
	    	view.alpha += params.fadeInEvolution;
	    	if (view.alpha > 1) view.alpha = 1;
	    }

	    if (params.lifeCount <= params.alphaTime) {
	    	view.alpha -= params.fadeOutEvolution;
	    	if (view.alpha < 0) view.alpha = 0;
	    }

	    if (properties.growth != 0) {
	    	view.scale.x = view.scale.y = (view.scale.x + properties.growth);
	    }

		params.lifeCount--;
		if (params.lifeCount <= 0) this.die();
	}

	Particle.prototype.die = function()
	{
		this.living = false;
		this.view.visible = false;
		this.view.alpha = 0;
	}

	Particle.prototype.dispose = function()
	{
		if (this.view == null) return;
		if (this.view.parent) this.view.parent.removeChild(this.view);
		
		this.living = false;
		this.next = null;
		this.view = null;
		this.properties = null;
		this.params = null;
	}

	//---------------------------------------------------------------------------------------------------------------------------

	ParticleProperties = function()
	{
		this.randomSpawnX = 0;
		this.randomSpawnY = 0;
		this.life = 60;
		this.randomLife = 0;
		this.centerX = 0;
		this.centerY = 0;
		this.forceX = 0;
		this.forceY = 0;
		this.randomForceX = 0;
		this.randomForceY = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.randomVelocityX = 0;
		this.randomVelocityY = 0;
		this.scale = 1;
		this.growth = 0.0;
		this.randomScale = 0;
		this.alphaStart = 0;
		this.alphaFinish = 0;
		this.alphaRatio = 0.1;
		this.torque = 0;
		this.randomTorque = 0;
	}
