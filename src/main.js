var Game = require('./Game'),
    Tweenable = require('./vendor/shifty');

// http://cubic-bezier.com/#.92,.34,.6,.8
Tweenable.setBezierFunction("customBezier", .92,.34,.6,.8);
// var tweenable = new Tweenable();
// tweenable.tween({
//   from: { x: 0,  y: 50  },
//   to:   { x: 10, y: -30 },
//   duration: 1500,
//   easing: 'customBezier',
//   start: function () { console.log('Off I go!'); },
//   finish: function () { console.log('And I\'m done!'); }
// });

// Init
var game = new Game();
