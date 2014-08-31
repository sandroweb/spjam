var Game = require('./Game'),
    Tweenable = require('./vendor/shifty'),
    EventEmitter2 = require('./vendor/EventEmitter2').EventEmitter2,
    game;

// http://cubic-bezier.com/#.92,.34,.6,.8
Tweenable.setBezierFunction("customBezier", .92,.34,.6,.8);

// Event between objects
window.emitter = new EventEmitter2();

// Init
WebFontConfig = {
google: {
  families: ['Rokkitt']
},

active: function() {
  // do something
  game = Game.instance = new Game();
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
