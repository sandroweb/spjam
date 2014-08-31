module.exports = function Begin(game) {
  window.game = game;
  
  var self = this;
  var view = new PIXI.DisplayObjectContainer();
  var overlap = null;
  var car = null;
  var logo = null;
  var logoDark = null;
  var btnSTart = null;
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
    guardrailDark.position.y = 500;
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
    car.position.y = 450;
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
    car.position.x += 30;
    car.scale.x = 1;
    if (car.position.x > 7000) car.position.x = -300;

    logo.scale.x = 0.98 + Math.sin(count)*0.04;
    logo.scale.y = 0.98 + Math.cos(count*0.3)*0.04;

    logoDark.scale.x = 0.98 + Math.cos(count)*0.04;
    logoDark.scale.y = 0.98 + Math.sin(count*0.3)*0.04;

    btnStart.alpha = 0.75 + Math.cos(count*15)*0.25;

    count += 0.01;
  }

  function startGame()
  {
    game.resources.buttonClick.play()
    hide();
    game.loadLevel(1);
  }
};
