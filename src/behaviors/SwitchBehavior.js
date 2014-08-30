var Tweenable = require('../vendor/shifty');

module.exports = function SwitchBehavior(data) {
	var self = this,
      gridSize = data.height,
      moveX = data.properties.move * gridSize;

  this.trigger = function() {

    var tweenable = new Tweenable();
    tweenable.tween({
      from: light.position,
      to:   { x: light.position.x + moveX },
      duration: 4000,
      easing: 'easeOutCubic',
      start: function () { console.log('Off I go!'); },
      finish: function () {
        // infinite
        self.trigger();
      }
    });

    // future trigger will invert movement.
    moveX *= -1;
  }

  this.trigger();
}
