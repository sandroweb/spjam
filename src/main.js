var Game = require('./Game'),
    Tweenable = require('./vendor/shifty'),
    game;

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

WebFontConfig = {
google: {
  families: ['Trade Winds']
},

active: function() {
  // do something
  game = new Game();
}
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();