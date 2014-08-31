var ParticleSystem = require('./components/ParticleSystem.js');

module.exports = function Begin(game) {
  window.game = game;

  var self = this;
  var view = new PIXI.DisplayObjectContainer();
  var overlap = null;
  var car = null;
  var logo = null;
  var logoDark = null;
  var btnStart = null;
  var particles = null;
  var count = 0;

  this.view = view;
  this.show = show;
  this.hide = hide;
  this.update = update;

  init();

  function init()
  {
    view.visible = false;
    game.stage.addChild(view);

    var bg = PIXI.Sprite.fromFrame("Scenario.png");
    view.addChild(bg);

    logoDark = PIXI.Sprite.fromFrame("DarkLightLogo.png");
    view.addChild(logoDark);
    logoDark.alpha = 0.5;
    logoDark.anchor.x = 0.5;
    logoDark.anchor.y = 0.5;
    logoDark.position.x = screenWidth/2;
    logoDark.position.y = screenHeight/2;

    var guardrailDark = PIXI.Sprite.fromFrame("GuardRail.png");
    view.addChild(guardrailDark);
    guardrailDark.position.y = 550;
    guardrailDark.alpha = 0.5;

    var front = new PIXI.DisplayObjectContainer();
    view.addChild(front);

    var forest = PIXI.Sprite.fromFrame("ForestLight.png");
    front.addChild(forest);
    forest.position.y = 102;

    logo = PIXI.Sprite.fromFrame("DarkLightLogo.png");
    front.addChild(logo);
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    logo.position.x = logoDark.position.x;
    logo.position.y = logoDark.position.y;

    var guardrail = PIXI.Sprite.fromFrame("GuardRail.png");
    front.addChild(guardrail);
    guardrail.position.y = guardrailDark.position.y;

    overlap = createOverlap();
    view.addChild(overlap);
    overlap.position.x = screenWidth - 100;
    overlap.position.y = -100;

    front.mask = overlap;

    btnStart = PIXI.Sprite.fromFrame("Start.png");
    btnStart.anchor.x = 0.5;
    btnStart.anchor.y = 0.5;
    btnStart.setInteractive(true);
    btnStart.click = startGame;
    view.addChild(btnStart);
    btnStart.position.x = screenWidth/2;
    btnStart.position.y = screenHeight/2 + 130;

    car = PIXI.Sprite.fromFrame("Car.png");
    view.addChild(car);
    car.position.x = -3000;
    car.position.y = guardrailDark.position.y - 75;
    car.passed = false;

    particles = new ParticleSystem(
    {
        "images":["smoke.png"],
        "numParticles":500,
        "emissionsPerUpdate":3,
        "emissionsInterval":1,
        "alpha":1,
        "properties":
        {
          "randomSpawnX":20,
          "randomSpawnY":3,
          "life":20,
          "randomLife":100,
          "forceX":0,
          "forceY":-0.01,
          "randomForceX":0.01,
          "randomForceY":0.01,
          "velocityX":0,
          "velocityY":0,
          "randomVelocityX":0.1,
          "randomVelocityY":0.1,
          "scale":1,
          "growth":0.1,
          "randomScale":0.5,
          "alphaStart":0,
          "alphaFinish":0,
          "alphaRatio":0.2,
          "torque":0,
          "randomTorque":0
        }
    });
    view.addChild(particles.view);
    particles.view.alpha = 0.25;
  }

  function createOverlap()
  {
    var numShafts = 8;
    var openRate = 0.2;
    var radius = 2000;
    var graph = new PIXI.Graphics();

    graph.beginFill(0xFFFFFF);
    graph.moveTo(0, 0);

    for (var i = 0; i < numShafts; i++)
    {
      var a = Math.PI*2/numShafts*i;
      graph.lineTo(Math.cos(a - openRate)*radius, Math.sin(a - openRate)*radius);
      graph.lineTo(Math.cos(a + openRate)*radius, Math.sin(a + openRate)*radius);
      graph.lineTo(0, 0);
    }

    graph.endFill();
    return graph;

  }

  function show()
  {
    view.visible = true;
  }

  function hide()
  {
    view.visible = false;
  }

  function update()
  {
    if (!view.visible) return;
    overlap.rotation += 0.001;
    car.position.x += 20;
    car.scale.x = 1;
    if (car.position.x > 7000) {
      car.position.x = -3000;
      car.passed = false;
    }

    if (car.passed === false && car.position.x > -1400) {
      car.passed = true;
      game.resources.carPass.play();
    }

    particles.properties.centerX = car.position.x;
    particles.properties.centerY = car.position.y + 100;
    particles.update();

    logo.scale.x = 0.99 + Math.sin(count)*0.02;
    logo.scale.y = 0.99 + Math.cos(count*0.3)*0.02;

    logoDark.scale.x = 0.99 + Math.cos(count)*0.02;
    logoDark.scale.y = 0.99 + Math.sin(count*0.3)*0.02;

    btnStart.alpha = 0.75 + Math.cos(count*15)*0.25;

    count += 0.01;
  }

  function startGame()
  {
    game.resources.buttonClick.play()
    hide();
    game.loadLevel(6);
  }
};
