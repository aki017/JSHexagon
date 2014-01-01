SuperHexagon = function(canvas){
  this.stage = new createjs.Stage(canvas);
  this.resize();
  this.center = {
    "x" : this.stage.canvas.width/2,
    "y" : this.stage.canvas.height/2
  }
  this.initCenter();
  this.initChara();
  this.initWall();
  this.initBar();
  this.initBar2();
  this.input = new InputManager();
  this.frame = 0;
  createjs.Sound.addEventListener("loadComplete", createjs.proxy(this.handleLoad,this)); // add an event listener for when load is completed
  createjs.Sound.registerSound("music/music.ogg");
}
SuperHexagon.prototype = {
  resize : function(){
    this.stage.canvas.width = window.innerWidth;
    this.stage.canvas.height = window.innerHeight;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addListener(this);
  }, 
  initWall : function (){
    this.wall = [];
    for(var i = 0;i < 10;i++){
      // var shape = this.genWall(Math.random()*100+5);
      // shape.scaleX = i*3;
      // shape.scaleY = i*3;
      // this.wall[i] = shape;
      // this.stage.addChild(shape);
      this.wall[i] = null;
    }
  }, 
  initBar2 : function (){
    this.bar2 = [];
    for(var i = 0;i < 8;i++){
      var shape = new createjs.Shape();

      shape.graphics.beginFill("hsl("+(i/8*360)+", 100%, 50%)");
      shape.graphics.drawRect(0,  0,  10,  100);
      shape.compositeOperation = "lighter";
      shape.isUseObject = true;
      shape.x = this.stage.canvas.width;
      shape.y = i*100; 


      var blurFilter = new createjs.BoxBlurFilter(2,  1,  5);
      shape.filters = [blurFilter];
      var margins = blurFilter.getBounds();
      shape.cache(-10+margins.x-7,  -100+margins.y-7,  10*2+margins.width+14,  100*2+margins.height+14);


      this.bar2[i] = shape;
      this.stage.addChild(shape);
    }
  }, 
  initBar : function (){
    this.bar = [];
    for(var i = 0;i < 128;i++){
      var shape = new createjs.Shape();

      shape.graphics.beginFill("hsl("+(i/128*360)+", 100%, 50%)");
      shape.graphics.drawRect(0,  0,  10,  10);
      shape.compositeOperation = "lighter";
      shape.isUseObject = true;
      shape.x = 0;
      shape.y = i*10; 


      var blurFilter = new createjs.BoxBlurFilter(1,  0,  5);
      shape.filters = [blurFilter];
      var margins = blurFilter.getBounds();
      shape.cache(-10+margins.x-7,  -10+margins.y-7,  10*2+margins.width+14,  10*2+margins.height+14);


      this.bar[i] = shape;
      this.stage.addChild(shape);
    }
  }, 
  genWall : function (size){
    var shape = new createjs.Shape();
    var pos = ~~(Math.random()*6) / 6;
    shape.graphics.setStrokeStyle(size)
      .beginStroke("#333")
      .arc(0, 0, 100, Math.PI*pos, Math.PI*(pos + 2/6), true);
    shape.compositeOperation = "lighter";
    shape.isUseObject = true; 
    shape.x = this.center.x;
    shape.y = this.center.y;
    shape.scaleX = 7;
    shape.scaleY = 7;
    shape.alpha = 0;
    size = 100;


    var blurFilter = new createjs.BoxBlurFilter(1,  1,  5);
    shape.filters = [blurFilter];
    var margins = blurFilter.getBounds();
    shape.cache(-size+margins.x-7,  -size+margins.y-7,  size*2+margins.width+14,  size*2+margins.height+14);
    
    
    return shape;
  }, 

  initChara : function(){
    var shape = new createjs.Shape();
    var size = 10;
    shape.graphics.beginFill("hsl(1, 50%, 50%)"); 
    shape.graphics.drawCircle(0, 0, size);
    shape.compositeOperation = "lighter";
    shape.isUseObject = true;
    shape.x = this.center.x;
    shape.y = this.center.y;

    // Blur
    var blurFilter = new createjs.BoxBlurFilter(1,  1,  2);
    shape.filters = [blurFilter];
    var margins = blurFilter.getBounds();
    shape.cache(-size+margins.x-7,  -size+margins.y-7,  size*2+margins.width+14,  size*2+margins.height+14);

    this.rot = 0;
    this.chara = shape;
    this.stage.addChild(shape);
  }, 
  initCenter : function(){
    var shape = new createjs.Shape();
    var size = 50;
    shape.graphics.beginFill("hsl(0, 100%, 50%)");
    shape.graphics.drawCircle(0, 0, size);
    shape.compositeOperation = "lighter";
    shape.isUseObject = true;
    shape.x = this.center.x;
    shape.y = this.center.y;

    // Blur
    var blurFilter = new createjs.BoxBlurFilter(1,  1,  2);
    shape.filters = [blurFilter];
    var margins = blurFilter.getBounds();
    shape.cache(-size+margins.x-7,  -size+margins.y-7,  size*2+margins.width+14,  size*2+margins.height+14);

    this.center = shape;
    this.stage.addChild(shape);
  }, 
  tick : function() {
    this.frame++;
    this.input.update();
    //this.initCenter(); 
    this.updateCenter();
    this.updateChara(); 
    this.updateWall(); 
    this.updateMusic();
    this.rotateScreen();
    this.stage.update(); 
  }, 
  updateCenter : function (){
    var size = Math.sin(this.frame/3);
    this.center.scaleX = (size > 0.8)?(size-0.8)+1:1;
    this.center.scaleY = (size > 0.8)?(size-0.8)+1:1;
  }, 
  updateChara : function (){
    if(this.input.ispushed(KEY_RIGHT)){
      this.rot += 0.2;
    }else if(this.input.ispushed(KEY_LEFT)){
      this.rot -= 0.2;
    }

    this.chara.x = this.center.x + Math.sin(this.rot+this.frame/160 * Math.PI +Math.PI/2)*70;
    this.chara.y = this.center.y + Math.sin(this.rot+this.frame/160 * Math.PI)*70;
  }, 
  updateWall : function (){
    var wall = this.wall;
    for(var i = 0, length = this.wall.length; i < length ; i++){
      if(wall[i] === null)continue;
      wall[i].rotation = this.frame % 360; 
      wall[i].scaleX -= 0.06;
      wall[i].scaleY -= 0.06;
      if(wall[i].scaleX > 5){
        wall[i].alpha = (wall[i].scaleX >7) ? 0 : (7 - wall[i].scaleX) /2 ;
      }
      if(wall[i].scaleX < 0.5){
        this.stage.removeChild(wall[i]);
        wall[i] = null;
      }
    }
  }, 
  setFreeWall : function (item){
    for(var i = 0; i < 100 ; i++){
      if(this.wall[i] === null)
      {
        this.wall[i] = item;
        return item;
        break;
      }
    }
  }, 
  rotateScreen : function (){
    var num = this.stage.getNumChildren ();
    for(var i = 0;i<num;++i){
      //this.stage.getChildAt(i).rotation = this.frame % 360; 
    }
  }, 
  handleLoad : function (evt) {

    var FFTSIZE = 256;      // number of samples for the analyser node FFT
    var TICK_FREQ = 20;     // how often to run the tick function, in milliseconds
    var context = createjs.WebAudioPlugin.context;

    this.analyserNode = context.createAnalyser();
    this.analyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
    this.analyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
    this.analyserNode.connect(context.destination);  // connect to the context.destination, which outputs the audio

    var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
    dynamicsNode.disconnect();  // disconnect from destination
    dynamicsNode.connect(this.analyserNode);

    this.timeByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.startPlayback();
  }, 
  startPlayback : function(){
    soundInstance = createjs.Sound.play("music/music.ogg",  null,  null,  0,  -1);
  }, 
  updateMusic : function(){
    this.analyserNode.getByteFrequencyData(this.timeByteData);
    var len = this.timeByteData.length;
    for(var i=0; i<8; i++) this.bar2[i].scaleX=0;
    for(var i=0; i<len; i++) {
      this.bar[i].scaleX = this.timeByteData[i]/128*10;
      this.bar2[~~(i/128*8)].scaleX -= this.timeByteData[i]/128;
    }
    if(this.frame % 22.5 != 0) return;
    var max = 128;
    var index = 0;
    for(var i=0; i<len; i++) {
      if(this.timeByteData[i] > max){
        max = this.timeByteData[i];
        index = i;
      }
    }

    if (max > 200){ 
      console.log("gen");
      this.stage.addChild(this.setFreeWall(this.genWall(10, ~~(index/len*6))));
    }
  }
}
