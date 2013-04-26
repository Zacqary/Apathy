// Declare global sprites
var redBtn;
var bluBtn;
var exit;
var pause;
var fax;
var goalSign;
var okFaxBtn;
var supportSprites = [];

Voter.prototype.sprite = Draw2DSprite.create(Sprites.voter);
Voter.prototype.actionBubble = null;
Voter.prototype.animation = null;
Voter.prototype.displayAction = function displayAction(origin, destination){
	this.actionBubble = new ActionBubble(origin, destination, this.isPlayer);
}

District.prototype.tv = null;
District.prototype.tvDial = null;
District.prototype.tvSupport = null;

Rep.prototype.sprite = null;
Rep.prototype.animation = null;
Rep.prototype.noise = null;
Rep.prototype.podiumVote = null;

var ActionBubble = function(origin, destination, isPlayer){
	this.sprite = Draw2DSprite.create(Sprites.actionBubble);
	if (isPlayer) this.sprite = Draw2DSprite.create(Sprites.actionBubblePlayer);
	this.destination = destination;
	this.origin = origin;
	this.sprite.x = this.origin[0];
	this.sprite.y = this.origin[1];
	this.timer = 0;
	this.timeout = 0;
	this.rate = 0.03;
	this.speed = 16;
	if (isPlayer) this.speed = 32;
	this.animation = null;
	this.move = function(){
		if (!paused){
			var xDiff = (destination[0] - origin[0]);
			var yDiff = (destination[1] - origin[1]);
			var xPercent = Math.abs(this.sprite.x - destination[0]) / Math.abs(xDiff);
			var yPercent = Math.abs(this.sprite.y - destination[1]) / Math.abs(yDiff);
			var xFactor =  1-(1-xPercent)*0.5;
			var yFactor =  1-(1-yPercent)*0.5;
			var xSpeed = this.speed*xFactor;
			var ySpeed = this.speed*yFactor;
	
			if( (TurbulenzEngine.time - this.timer) >= this.rate) {
				this.timer = TurbulenzEngine.time;
				this.timeout += (currentTime - previousFrameTime);
			
				if (xDiff < 0) {
					this.sprite.x -= xSpeed;
					if (this.sprite.x <= destination[0]) this.sprite.x = destination[0];
				}
				else {
				
					this.sprite.x += xSpeed;
					if (this.sprite.x >= destination[0]) this.sprite.x = destination[0];
				}
			
				if (yDiff < 0) {
					this.sprite.y -= ySpeed;
					if (this.sprite.y <= destination[1]) this.sprite.y = destination[1];
				}
				else {
					this.sprite.y += ySpeed;
					if (this.sprite.y >= destination[1]) this.sprite.y = destination[1];
				}
			
			
			}
		
			var scaleFactor;
			if (xPercent < yPercent){
				scaleFactor = 1.25 - ( Math.abs(0.5 - yPercent)*2 );
			}
			else{
				scaleFactor = 1.25 - ( Math.abs(0.5 - xPercent)*2 );
			}
			if (scaleFactor < 0.8) scaleFactor = 0.8;
		
			if ((xPercent <= 0.2) && (yPercent <= 0.2)){
				scaleFactor = 0.5;
			}
			this.sprite.setScale([scaleFactor,scaleFactor]);
		
		
			if ( (Math.abs(this.sprite.x - destination[0]) < 2) && (Math.abs(this.sprite.y - destination[1]) < 2) ) {
				return "done";
			}
			else if (this.timeout > 3) return "done";
		}
	}
}
ActionBubble.prototype = new GameObj();
ActionBubble.prototype.constructor = ActionBubble;

var TableFlash = function(){
	this.sprite = null;
	this.frames = {
		fail: [
			[0,0,560,160],
			[0,160,560,320],
			[0,320,560,480],
			[0,320,560,480],
			[0,160,560,320],
			[0,0,560,160],
		],
		pass: [
			[0,480,560,640],
			[0,640,560,800],
			[0,800,560,960],
			[0,800,560,960],
			[0,640,560,800],
			[0,480,559,640],
		]
	};
	this.animation = null;
	this.flash = function flashTable(passed, player){
		var frames = [];
		var rects;
		if (passed) {
			rects = this.frames.pass;
			if (player) Sound.play("pass");
			else Sound.play("passQuiet");
		}
		else {
			rects = this.frames.fail;
			if (player) Sound.play("fail");
			else Sound.play("failQuiet");
		}
		for(var i in rects){
			var sprite = Draw2DSprite.create(Sprites.tablePassFail);
			sprite.setTextureRectangle(rects[i]);
			frames.push(sprite);
		}
		this.animation = new Animation(frames, 0.08);
	}
}
TableFlash.prototype = new GameObj();
TableFlash.prototype.constructor = TableFlash;

var tableFlash = new TableFlash();
var drawNext = 0;
var drawRate = 0.016;
var draw2D;
var prevGameState;
var menuFlicker = 0;
var menuState = 0;

var Animation = function Animation(frames, rate, audioFrames){
	this.frames = frames;
	this.audioFrames = audioFrames;
	this.counter = 0;
	this.start = currentTime;
	this.rate = rate;
}

var Graphics = {
	
	buffer: [],
	fontShader: null,
	clipSpace: null,
	timers: [],
	
	drawCursor: function drawCursor(){
		draw2D.begin("alpha");
		var cursor = Draw2DSprite.create(Sprites.cursor);
		cursor.x = mousePosition.x+16;
		cursor.y = mousePosition.y+16;
		draw2D.drawSprite(cursor);
		draw2D.end();
	},
	
	drawMenu: function drawMenu(){
		initTextures();
		Graphics.initGameSprites();
		currentTime = TurbulenzEngine.time;
		if(currentTime >= drawNext){
			var tv = Draw2DSprite.create(Sprites.menuTV);
			if (randomNumber(0,128) == 8){
				menuFlicker = randomNumber(1,240);
			}
			
			draw2D.setBackBuffer();
			draw2D.clear([0.0,0.0,0.2,1.0]);
			
			Graphics.writeFont("APATHY",1,520,180+menuFlicker,1,[0.8,0.8,1,1]);
			Graphics.writeFont("A game by Zacqary Adam Green",0.3,520,250+menuFlicker,1,[0.8,0.8,1,1]);
			Graphics.writeFont("Featuring music by Andrey Avkhimovich",0.2,520,280+menuFlicker,1,[0.8,0.8,1,1]);
			
			Graphics.writeFont("CC0 Public Domain",0.2,520,620+menuFlicker,1,[0.8,0.8,1,1]);
			Graphics.writeFont("Please copy with reckless abandon",0.16,520,640+menuFlicker,1,[0.8,0.8,1,1]);
			Graphics.writeFont("Powered by Turbulenz",0.15,520,670+menuFlicker,1,[0.8,0.8,1,1]);
			
			var startText = "- Start Game -";
			var startColor = [0.8,0.8,1,1];
			if (mousePosition.y <= 390) {
				startText = "> Start Game <";
				startColor = [1,1,1,1];
				menuState = 0;
			}
			if (randomSeed) tutorial = false;
			var tutorialText = "- Tutorial: On -";
			if (!tutorial) tutorialText = "- Tutorial: Off -";
			var tutorialColor = [0.8,0.8,1,1];
			if ( (mousePosition.y > 390) && (mousePosition.y <= 430)) {
				tutorialText = "> Tutorial: On <";
				if (!tutorial) tutorialText = "> Tutorial: Off <";
				tutorialColor = [1,1,1,1];
				menuState = 2;
			}
			var colorBlindText = "- Color Blind Mode: Off -";
			if (colorBlind) colorBlindText = "Color Blind Mode: On";
			var colorBlindColor = [0.8,0.8,1,1];
			if ( (mousePosition.y > 430) && (mousePosition.y <= 460)) {
				colorBlindText = "> Color Blind Mode: Off <";
				if (colorBlind) colorBlindText = "> Color Blind Mode: On <";
				colorBlindColor = [1,1,1,1];
				menuState = 3;
			}
			
			Graphics.writeFont(startText,0.4,520,360+menuFlicker,1,startColor);
			Graphics.writeFont(tutorialText,0.3,520,410+menuFlicker,1,tutorialColor);
			Graphics.writeFont(colorBlindText,0.3,520,440+menuFlicker,1,colorBlindColor);
			
			if (!showAdvanced) {
				var advancedText = "- Advanced Options -";
				var advancedColor = [0.8,0.8,1,1];
				if (mousePosition.y > 460) {
					advancedText = "> Advanced Options <";
					advancedColor = [1,1,1,1];
					menuState = 4;
				}
				Graphics.writeFont(advancedText,0.3,520,470+menuFlicker,1,advancedColor);
			}
			else {
				var skipText = "- Auto-Skip Faxes: Off -";
				if (skipFaxes) skipText = "- Auto-Skip Faxes: On -";
				var skipColor = [0.8,0.8,1,1];
				if ( (mousePosition.y > 460) && (mousePosition.y <= 490) ) {
					skipText = "> Auto-Skip Faxes: Off <";
					if (skipFaxes) skipText = "> Auto-Skip Faxes: On <";
					skipColor = [1,1,1,1];
					menuState = 5;
				}
				
				var randomText = "- Custom Random Seed: Off -";
				if (randomSeed) randomText = "- Custom Random Seed: On -";
				var randomColor = [0.8,0.8,1,1];
				if (mousePosition.y > 490) {
					randomText = "> Custom Random Seed: Off <";
					if (randomSeed) randomText = "> Custom Random Seed: On <";
					randomColor = [1,1,1,1];
					menuState = 6;
				}
				
				Graphics.writeFont(skipText,0.3,520,470+menuFlicker,1,skipColor);
				Graphics.writeFont(randomText,0.3,520,500+menuFlicker,1,randomColor);
				var randomCursor = " ";
				if ( (Math.floor(TurbulenzEngine.time) % 2) && (mousePosition.y > 490) ) randomCursor = "_";
				if (randomSeed)
					Graphics.writeFont(randomSeed+randomCursor,0.25,520,530+menuFlicker,1,randomColor);
				else Graphics.writeFont(randomCursor,0.25,520,530+menuFlicker,1,randomColor);
			}
			
			var noise = Draw2DSprite.create(Sprites.menuTV);
			noise.setTexture(textures["menuNoiseLite"]);
			var noiseX = randomNumber(0,768);
			var noiseY = randomNumber(0,1328);
			noise.setTextureRectangle([noiseX,noiseY,noiseX+1280,noiseY+720]);
			
			draw2D.begin("alpha","texture");
			draw2D.drawSprite(noise);
			if (menuFlicker) { 
				draw2D.drawSprite(noise);
				draw2D.drawSprite(noise);
				draw2D.drawSprite(noise);
				menuFlicker = Math.floor(menuFlicker / 2);
				if (menuFlicker < 1) menuFlicker = 0;
			}
			Graphics.drawScanLines();
			draw2D.drawSprite(tv);
			draw2D.end();
			
			drawNext += drawRate;
		}	
	},
	
	drawIntro: function drawIntro(){
		initTextures();
		Graphics.initGameSprites();
		currentTime = TurbulenzEngine.time;
		if(currentTime >= drawNext){
			var tv = Draw2DSprite.create(Sprites.menuTV);
			if (randomNumber(0,24) == 8){
				menuFlicker = randomNumber(32,72);
			}
			draw2D.clear([0.0,0.0,0.2,1.0]);
			
			if (transitionTimer > 0.016) {
				Graphics.writeFont(wordwrap(introText,36,"\n\n"),0.35,520,180+menuFlicker,1,[0.8,0.8,1,1]);
				Graphics.writeFont("-- Aaron Swartz",0.35,900,500+menuFlicker,2,[0.8,0.8,1,1]);
			
				var noise = Draw2DSprite.create(Sprites.menuTV);
				noise.setTexture(textures["menuNoiseLite"]);
				var noiseX = randomNumber(0,768);
				var noiseY = randomNumber(0,1328);
				noise.setTextureRectangle([noiseX,noiseY,noiseX+1280,noiseY+720]);
			
				draw2D.setBackBuffer();
				draw2D.begin("alpha","texture");
				draw2D.drawSprite(noise);
				if (menuFlicker) { 
					draw2D.drawSprite(noise);
					draw2D.drawSprite(noise);
					draw2D.drawSprite(noise);
					menuFlicker = Math.floor(menuFlicker / 2);
					if (menuFlicker < 1) menuFlicker = 0;
				}
				Graphics.drawScanLines();
				draw2D.drawSprite(tv);
			}
			else {
				draw2D.setBackBuffer();
				draw2D.begin("alpha","texture");
			}
				
			var fader = Draw2DSprite.create({
				texture: null,
				width: 1280,
				height: 720,
				x: 640,
				y: 360,
				color: [0,0,0,1]
			});
		 	fader.setColor([0,0,0,(1-transitionTimer)]);
			draw2D.drawSprite(fader);
			
			draw2D.end();
			
			drawNext += drawRate;
			if (transitionTimer < 1.01) transitionTimer += drawRate;
		}	
	},
	
	drawOutro: function drawOutro(){
		initTextures();
		Graphics.initGameSprites();
		currentTime = TurbulenzEngine.time;
		if(currentTime >= drawNext){
			var tv = Draw2DSprite.create(Sprites.menuTV);
			if (randomNumber(0,128) == 8){
				menuFlicker = randomNumber(1,240);
			}
			
			
			draw2D.setBackBuffer();
			graphicsDevice.clear([0.0,0.0,0.2,1.0]);
			var outroScore = "You scored "+score+" out of 10.\nYou called your rep "+repCalls+" times. You called your"
			+" friends "+friendCalls+" times. You voted in "+timesVoted+ " out of 4 elections.\n\n";
			
			Graphics.writeFont(wordwrap(outroScore+outroText,54,"\n\n"),0.22,520,60+menuFlicker,1,[0.8,0.8,1,1]);
		
			var liqText = "Liquid democracy";
			var liqColor = [1,0.6,1,1];
			if ( (mousePosition.y > 470) && (mousePosition.y <= 498) ){
				liqColor = [1,1,1,1];
				menuState = 10;
			}
			Graphics.writeFont(liqText,0.22,760,483+menuFlicker,1,liqColor);
			
			var parText = "Participatory politics";
			var parColor = [1,0.6,1,1];
			if ( (mousePosition.y > 498) && (mousePosition.y < 650) && (mousePosition.x < 526) ){
				parColor = [1,1,1,1];
				menuState = 11;
			}
			Graphics.writeFont(parText,0.22,344,510+menuFlicker,1,parColor);

			var socText = "Sociocracy";
			var socColor = [1,0.6,1,1];
			if ( (mousePosition.y > 498) && (mousePosition.y < 650) && (mousePosition.x >= 526) && (mousePosition.x < 700) ){
				socColor = [1,1,1,1];
				menuState = 12;
			}
			Graphics.writeFont(socText,0.22,597,510+menuFlicker,1,socColor);
			
			var conText = "Consensus";
			var conColor = [1,0.6,1,1];
			if ( (mousePosition.y > 498) && (mousePosition.y < 650) && (mousePosition.x >= 700) ){
				conColor = [1,1,1,1];
				menuState = 13;
			}
			Graphics.writeFont(conText,0.22,760,510+menuFlicker,1,conColor);
			
			var menuText = "- Back to Menu -";
			var menuColor = [0.8,0.8,1,1];
			if (mousePosition.y >= 650){
				menuText = "> Back to Menu <";
				menuColor = [1,1,1,1];
				menuState = 14;
			}
			Graphics.writeFont(menuText,0.25,520,660+menuFlicker,1,menuColor);
			
			var noise = Draw2DSprite.create(Sprites.menuTV);
			noise.setTexture(textures["menuNoiseLite"]);
			var noiseX = randomNumber(0,768);
			var noiseY = randomNumber(0,1328);
			noise.setTextureRectangle([noiseX,noiseY,noiseX+1280,noiseY+720]);
			
			draw2D.begin("alpha","texture");
			draw2D.drawSprite(noise);
			if (menuFlicker) { 
				draw2D.drawSprite(noise);
				draw2D.drawSprite(noise);
				draw2D.drawSprite(noise);
				menuFlicker = Math.floor(menuFlicker / 2);
				if (menuFlicker < 1) menuFlicker = 0;
			}
			Graphics.drawScanLines();
			draw2D.drawSprite(tv);
			draw2D.end();
			
			drawNext += drawRate;
		}	
	},
	
	drawScanLines: function drawScanLines(){
		var buffer = [];
		var counter = 0;
		for (var i=0;i<45;i++){
			for(var j=0;j<80;j++){
				var block = Draw2DSprite.create({
					texture: textures["scanLine"],
					width: 16,
					height: 16,
					x: j*16+8,
					y: i*16+8,
					color: [1,1,1,1],
					textureRectangle: [0,0,16,16]
				});
				draw2D.bufferSprite(buffer, block, counter);
				counter++;
			}
		}
		draw2D.drawRaw(textures["scanLine"], buffer);
	},
	
	drawTransition: function drawTransition(inward, dontScale){
		initTextures();
		Graphics.initGameSprites();
		currentTime = TurbulenzEngine.time;
		if(currentTime >= drawNext){
			var tv = Draw2DSprite.create(Sprites.menuTV);
			if (randomNumber(0,128) == 8){
				menuFlicker = randomNumber(1,240);
			}
			
			
			draw2D.setBackBuffer();
			graphicsDevice.clear([0.0,0.0,0.2,1.0]);
			
			var noise = Draw2DSprite.create(Sprites.menuTV);
			noise.setTexture(textures["menuNoise"]);
			var noiseX = randomNumber(0,768);
			var noiseY = randomNumber(0,1328);
			noise.setTextureRectangle([noiseX,noiseY,noiseX+1280,noiseY+720]);
			
			draw2D.begin("alpha","texture");
			draw2D.drawSprite(noise);
			if (menuFlicker) { 
				draw2D.drawSprite(noise);
				draw2D.drawSprite(noise);
				draw2D.drawSprite(noise);
				menuFlicker = Math.floor(menuFlicker / 2);
				if (menuFlicker < 1) menuFlicker = 0;
			}
			
			if (!dontScale) {
				var tvScale = 1.5*transitionTimer;
				var tvMove = 240*transitionTimer;
				tv.setScale([1+tvScale,1+tvScale]);
				tv.x = 640+tvMove;
			}
			draw2D.drawSprite(tv);
			draw2D.end();
			
			drawNext += drawRate;
			if (inward) transitionTimer += drawRate;
			else  transitionTimer -= drawRate;
		}	
	},
	
	drawScene: function drawScene(){
		initTextures();
		Graphics.initGameSprites();
		currentTime = TurbulenzEngine.time;
		if(currentTime >= drawNext){
			
			if  ( (!paused) && (gameState != "results") ) Graphics.randomAnimations();
			
			draw2D.setBackBuffer();
			draw2D.clear();
			
			if (gameState == "results"){
				for(var i in TheReps){
					if (!TheReps[i].animation) {
						TheReps[i].sprite.setColor([0,0,0,1]);
					}
				}
				if (prevGameState == "election"){
					var counter = 0;
					for(var i in TheReps){
						var noSound = true;
						if (counter < 2) noSound = false;
						TheReps[i].staticTransitionTo([], 0.000001, false, noSound);
						counter++;
					}
				}
				prevGameState = "results";
			}
			else if (gameState == "bill"){
				if (prevGameState == "results"){
					var counter = 0;
						for(var i in TheReps){
							counter++;
							var frames = [];
							if(!TheReps[i].district.results["win"]) {
								var myParty = "Red";
								var otherParty = "Blu";
								if (TheReps[i].party) {
									myParty = "Blu";
									otherParty = "Red";
								}
								for (var j=0;j<counter;j++){
									var frame = Draw2DSprite.create(Sprites.rep);
									frame.x = TheReps[i].sprite.x;
									frame.y = TheReps[i].sprite.y;
									frame.setTexture(textures["rep"+otherParty]);
									frames.push(frame);
								}
								for(var j=0;j<3;j++){
									var frame = Draw2DSprite.create(Sprites.rep);
									frame.x = TheReps[i].sprite.x;
									frame.y = TheReps[i].sprite.y;
									frame.setTexture(textures["rep"+otherParty+"2"+myParty+j]);
									frames.push(frame);
								}
							}
							TheReps[i].sprite.setColor([1,1,1,1]);
							var noSound = true;
							if (counter < 3) noSound = false;
							TheReps[i].staticTransitionTo([], 0.05, false, noSound);
						}
				}
				prevGameState = "bill";
			}
			
			draw2D.begin("alpha", "texture");
			
			Graphics.drawBackground();
			Graphics.drawGoalSign();
			Graphics.drawButtonSigns();
			Graphics.drawTVs();
			Graphics.drawVoters();
			Graphics.buffer = [];
			if (gameState == "election") {
				if (prevGameState == "bill"){
					for(var i in electionShade){
						//electionShade[i].fadeIn(3);
					}
				}
				if(!Graphics.timers["election"]) Graphics.timers["election"] = new Graphics.Timer(640,500,6);
				Graphics.timers["election"].sprite.setColor([0,0,0,1]);
				Graphics.timers["election"].draw();
				prevGameState = "election";
			}
			else Graphics.timers["election"] = null;
			
			draw2D.end();
			
			Graphics.writeTable();
			if(tableFlash.animation){
				draw2D.begin("alpha","texture");
				
				tableFlash.animate();
				draw2D.drawSprite(tableFlash.sprite);
				
				draw2D.end();
			}
			Graphics.drawBubbles();
			
			if (gameState == "election"){
				draw2D.begin("alpha","texture");
				Graphics.drawElectionShade();
				TheReps[TheDistricts[5].rep.id].draw();
				TheDistricts[5].drawTV();
				draw2D.end();
			}
			
			else if ( (gameState == "bill") && (ThePlayer.pet == Bills[0]) ){
				draw2D.begin("alpha","texture");
				Graphics.drawElectionShade();
				Graphics.drawGoalSign();
				Graphics.drawTVs();
				draw2D.end();
			}
			
			if (isMouseInBox(goalSign.getBounds())) Graphics.drawGoalPopup();
			
			if ( ( (!tutorial) || (tutorialPopupCounter == 99)) && (!screensaver) ) Graphics.writeFont("Months Left: "+monthsRemaining+" * ",0.27,1100,700,2,[0,0,0,1]);
			Graphics.writeFont("Score: "+score,0.27,1240,700,2,[0,0,0,1]);
			
			if(paused){
				draw2D.begin("alpha", "texture");
				
				Graphics.drawPauseBkg();
				if ( (fax.visible) && (!tableFlash.animation) ) {
					if (gameState == "election") Graphics.drawFax();
					else if ( (!fax.tutorial) || (!TheDistricts[5].rep.animation) ) Graphics.drawFax();
				}
				else {
					draw2D.end();
					Graphics.writeFont("PAUSED",1,640,100,1,[0,0,1,1]);
					Graphics.writeFont("click to continue",0.3,640,170,1,[1,1,1,1]);
				}
			}
			
			if ( (!paused) || (tutorialPopupCounter == 99) ) drawTutorialPopup(tutorialPopupCounter);
			
		
			drawNext += drawRate;
		}
	},
	
	drawPauseBkg: function drawPauseBkg(){
		draw2D.drawSprite(Sprites.pause);
	},
	
	drawElectionShade: function drawElectionShade(){
		var time = TurbulenzEngine.time;
		for(var i in electionShade){
			
			electionShade[i].animate(time);
		}
		for(var i in electionShade){
			draw2D.drawSprite(electionShade[i].sprite);
		}
	},
	
	drawBackground: function drawBackground(){
		for(var i in background){
			draw2D.drawSprite(background[i]);
		}
	},
	
	drawButtonSigns: function drawButtonSigns(){
		pause = Draw2DSprite.create(Sprites.signButton);
		pause.setTexture(textures["btnPause"]);
		
		if (isMouseInBox(pause.getBounds(-4))){
			pause.rotation = 0.1;
			if (mouseFireButtonDown) pause.setColor([0,0,0,1]);
		}
		
		draw2D.drawSprite(pause);
	},
	
	drawGoalSign: function drawGoalSign(){
		var yea = 0;
		var nay = 0;
		var mySupport = ThePlayer.pet.peopleSupport[ThePlayer.id];
		var bkgC = [0.93,0.5,0.5,1];
		var bkgCPass = [0.5,0.93,0.5,1];
		if (colorBlind) bkgCPass = [0.5,0.5,0.93,1];
		for(var i in ThePlayer.pet.repSupport){
			if (ThePlayer.pet.announcedRepSupport[i] !== undefined) {
				if (ThePlayer.pet.announcedRepSupport[i]) yea++;
				else nay++;
			}
		}
		var projection = false;
		if (yea > nay) projection = true;
		if (mySupport) {
			if (projection) bkgC = bkgCPass;
		}
		else if (!projection) bkgC = bkgCPass;
		
		
		goalSign = Draw2DSprite.create(Sprites.goalSign);
		goalSign.setColor(bkgC);
		var rectY = 0;
		if (!ThePlayer.pet.peopleSupport[ThePlayer.id])
			rectY = 256;
			
		var rectX = 0;
		if (voteDate > month)
			rectX = (5 - (voteDate - month) )*84;
		else if (voteDate < month)
			rectX = (5 - ( (voteDate + 12) - month) )*84;
		else if (voteDate == month)
			rectX = 420;
		
		goalSign.setTextureRectangle([rectX, rectY, rectX+84, rectY+256]);
		draw2D.drawSprite(goalSign);
	},
	
	drawGoalPopup: function drawGoalPopup(){
		var yea = 0;
		var nay = 0;
		var mySupport = ThePlayer.pet.peopleSupport[ThePlayer.id];
		var bkgC = [0.93,0.5,0.5,1];
		var bkgCPass = [0.5,0.93,0.5,1];
		if (colorBlind) bkgCPass = [0.5,0.5,0.93,1];
		for(var i in ThePlayer.pet.repSupport){
			if (ThePlayer.pet.announcedRepSupport[i] !== undefined) {
				if (ThePlayer.pet.announcedRepSupport[i]) yea++;
				else nay++;
			}
		}
		var projection;
		if (yea > nay) projection = "PASS";
		else projection = "FAIL";
		if (mySupport) {
			if (projection == "PASS") bkgC = bkgCPass;
		}
		else if (projection == "FAIL") bkgC = bkgCPass;
		
		draw2D.begin("alpha", "texture");
		var bkg = Draw2DSprite.create({
			texture: null,
			width: 600,
			height: 170,
			x: 860,
			y: 152,
			rotation: 0,
			color: [0,0,0,1],
			textureRectangle: [0,0,400,200]
		});
		draw2D.drawSprite(bkg);
		var bkg2 = Draw2DSprite.create({
			texture: null,
			width: 590,
			height: 160,
			x: 862,
			y: 152,
			rotation: 0,
			color: bkgC,
			textureRectangle: [0,0,400,200]
		});
		draw2D.drawSprite(bkg2);
		draw2D.end();
		Graphics.writeFont(ThePlayer.pet.prefix,0.2,862,80,1,[0,0,0,1]);
		Graphics.writeFont(wordwrap(ThePlayer.pet.name, 34),0.265,862,96,1,[0,0,0,1]);
		Graphics.writeFont("Will be voted on in "+monthFullNames[voteDate]
		+"\n\nProjected to "+projection,0.24,862,170,1,[0,0,0,1]);
	},
	
	drawTVs: function drawTVs(){
		for(var i in TheReps){
			TheReps[i].draw();
		}
		for(var i in TheDistricts){
			TheDistricts[i].drawTV();
		}
	},
	
	drawVoters: function drawVoters(){
		var buffer = [];
		supportSprites = [];
		for(var i in ThePeople) {
			if (ThePeople[i].actionBubble) {
				ThePeople[i].sprite.setScale([1.2,1.2]);
			}
			else{
				ThePeople[i].sprite.setScale([1,1]);
			}
			ThePeople[i].draw();
			if (!ThePeople[i].playerFriend) draw2D.bufferSprite(buffer,ThePeople[i].sprite, i);
		}
		draw2D.drawRaw(textures["voter"], buffer);
		buffer = [];
		
		for(var i in ThePlayer.friends){
			var me = ThePlayer.friends[i];
			if (
				(isMouseInBox(me.sprite.getBounds(3)))
				&& (gameState != "election")
				&& (Bills[0] != ThePlayer.pet)
			 ){
				var support = Draw2DSprite.create(Sprites.friendSupport);
				support.x = me.sprite.x + 4;
				support.y = me.sprite.y - 24;
				support.id = me.id;
				var rectX = 0;
				var rectY = 0;
				if (ThePlayer.pet.peopleSupport[me.id]) {
					rectY = 16;
				}
				if (ThePlayer.pet.peopleSupport[ThePlayer.id] == 
					ThePlayer.pet.peopleSupport[me.id]) {
						rectX = 16;
					}
				support.setTextureRectangle([rectX, rectY, rectX+16, rectY+16]);
				supportSprites.push(support);
				
				if ( (!ThePlayer.actionBubble) && (gameState == "bill") )
					me.sprite.setColor([1,1,0,1]);
				else me.sprite.setColor([0.7,0.7,0.5,1]);
				
				if ( (mouseFireButtonDown) && (!ThePlayer.actionBubble) ) {
					me.sprite.setScale([0.8,0.8]);
				}
			}
			
			draw2D.bufferSprite(buffer,me.sprite, i);
			
		}
		draw2D.drawRaw(textures["voter"], buffer);
		for(var i in supportSprites){
			draw2D.drawSprite(supportSprites[i]);
		}
	},
	
	clearBubbles: function clearBubbles(){
		for(var i in ThePeople) {
			ThePeople[i].actionBubble = null;
		}
	},
	drawBubbles: function drawBubbles(){
		draw2D.begin("alpha","texture");
		for(var i in ThePeople) {
			if (ThePeople[i].actionBubble){
				var color = ThePeople[i].sprite.getColor();
				if (  (Bills[0] == ThePlayer.pet) || (gameState == "election") )
					color[3] = 0.3;
				ThePeople[i].actionBubble.sprite.setColor(color);
				draw2D.drawSprite(ThePeople[i].actionBubble.sprite);
				if (ThePeople[i].actionBubble.move() == "done")
					ThePeople[i].actionBubble = null;
				
			}
		}
		draw2D.end();
	},
	
	randomAnimations: function randomAnimations(){
		for(var i in TheReps){
			if(randomNumber(0,1024) == 8){
				TheReps[i].flicker();
			}
		}
	},
	
	drawFax: function drawFax(){
		if (skipFaxes) {
			fax.timer -= drawRate;
			if ( (fax.timer <= 0) && (fax.timer != -999) ) { 
				fax.visible = false;
				paused = false;
			}
		}
		fax.sprite = Draw2DSprite.create(Sprites.fax);
		okFaxBtn = Draw2DSprite.create(Sprites.okButton);
		
		draw2D.drawSprite(fax.sprite);
		if (fax.goal != "tutorial") {
				var goalSymbol = Draw2DSprite.create(Sprites.faxGoal);
				if (fax.goal) goalSymbol.setTexture(textures["faxPass"]);
				draw2D.drawSprite(goalSymbol);
		}
		
		if (isMouseInBox(okFaxBtn.getBounds()))
			okFaxBtn.setTextureRectangle([0,64,128,128]);
		
		if (!skipFaxes) draw2D.drawSprite(okFaxBtn);
		draw2D.end();
		Graphics.writeFont(wordwrap(fax.text,60,"\n\n"), 0.2, 300, 190, 0, [0,0,0,1]);
	
		if (fax.goal != "tutorial") {
			var goalText = "KILL";
			if (fax.goal) goalText = "PASS";
			Graphics.writeFont(goalText+" THIS BILL!", 0.6, 300, 510, 0, [0,0,0,1]);
		}
		if ( (!fax.playedSound) && (monthsRemaining > 1) ){
			fax.playedSound = true;
			Sound.play("fax");
		}
		
	},
	
	writeTable: function writeTable(){
		Graphics.writeFont(months[month], 0.4, 640, 400, 1, [0,0,0,1]);
		if(gameState == "bill") {
			Graphics.writeFont(Bills[0].prefix+"\n"+wordwrap(Bills[0].name,38), 0.168, 640, 488, 1, [0,0,0,1]);
			var yea = 0;
			var nay = 0;
			for (var i in Bills[0].castVotes){
				if (Bills[0].castVotes[i]) {
					me = i;
					if (Bills[0].repSupport[me]) yea++;
					else nay++;
				}
			}
			Graphics.writeFont("YEA:", 0.3, 550, 432, 0, [0,0,0,1]);
			Graphics.writeFont(String(yea), 0.3, 690, 432, 0, [0,0,0,1]);
			Graphics.writeFont("NAY:", 0.3, 550, 463, 0, [0,0,0,1]);
			Graphics.writeFont(String(nay), 0.3, 690, 465, 0, [0,0,0,1]);
		}
		else if(gameState == "election"){
			draw2D.begin("alpha","texture");
			redBtn = Draw2DSprite.create(Sprites.voteButton);
			bluBtn = Draw2DSprite.create(Sprites.voteButton);
			var redTextColor = [1,0,0,1];
			var redTextScale = 0.3;
			var bluTextColor = [0,0,1,1];
			var bluTextScale = 0.3;
			redBtn.x = 552;
			bluBtn.x = 722;
			
			if (ThePlayer.hasVoted){
				rep = ThePlayer.district.rep;
				mySupport = rep.constituentSupport[ThePlayer.id];
				if ( 
					( (mySupport) && (rep.party) )
					|| ( (!mySupport) && (!rep.party) )
				) {
					bluTextColor = [0,0,0,1];
					bluBtn.setColor([0,0,1,1]);
				}
				else if ( 
					( (!mySupport) && (rep.party) )
					|| ( (mySupport) && (!rep.party) )
				) {
					redTextColor = [0,0,0,1];
					redBtn.setColor([1,0,0,1]);
				}
			}
			
			if (isMouseInBox(redBtn.getBounds())) {
				redBtn.setTextureRectangle([0,48,96,96]);
				redTextColor = [1,1,1,1];
				if (mouseFireButtonDown) {
					redTextScale = 0.25;
					redBtn.setScale([0.8,0.8]);
				}
			}
			else if (isMouseInBox(bluBtn.getBounds())) {
				bluBtn.setTextureRectangle([0,48,96,96]);
				bluTextColor = [1,1,1,1];
				if (mouseFireButtonDown) {
					bluTextScale = 0.25;
					bluBtn.setScale([0.8,0.8]);
				}
			}
			
			draw2D.drawSprite(redBtn);
			draw2D.drawSprite(bluBtn);
			draw2D.end();
			
			Graphics.writeFont("Elections", 0.3, 640, 432, 1, [0,0,0,1]);
			Graphics.writeFont("Vote\nRED", redTextScale, 550, 463, 1, redTextColor);
			Graphics.writeFont("Vote\nBLU", bluTextScale, 720, 463, 1, bluTextColor);
		}
		else if(gameState == "results"){
			Graphics.writeFont("Results", 0.3, 640, 432, 1, [0,0,0,1]);
			Graphics.writeFont(electionResults[0], 0.25, 510, 480, 1, [0.3,0.3,1,1]);
			Graphics.writeFont(electionResults[1], 0.25, 595, 480, 1, [1,0.3,1,1]);
			Graphics.writeFont(electionResults[2], 0.25, 680, 480, 1, [1,0.3,0.3,1]);
			Graphics.writeFont(electionResults[3], 0.25, 765, 480, 1, [0.7,0.7,0.3,1]);
			Graphics.writeFont(electionResults[4], 0.25, 550, 510, 1, [0.3,0.7,0.7,1]);
			Graphics.writeFont(electionResults[5], 0.25, 640, 510, 1, [0.3,1,0.3,1]);
			Graphics.writeFont(electionResults[6], 0.25, 730, 510, 1, [0.7,0.7,0.7,1]);
		}
	},
	
	initGameSprites: function initGameSprites(){
		Graphics.initDistricts();
		Graphics.initReps();
		Graphics.initVoters();
		initBackground();
	},
	
	initDistricts: function initDistricts(){
		for(var i in TheDistricts) {
			TheDistricts[i].tv = Draw2DSprite.create(Sprites.tv);
			TheDistricts[i].tvDial = Draw2DSprite.create(Sprites.tvDial);
			TheDistricts[i].tvSupport = Draw2DSprite.create(Sprites.tvSupport);
		}
		
		TheDistricts[0].tv.setColor([0.7,0.7,1,1]);
		TheDistricts[0].tvDial.setColor([0.7,0.7,1,1]);
		
		TheDistricts[1].tv.x = 512;
		TheDistricts[1].tv.setColor([1,0.7,1,1]);
		TheDistricts[1].tvDial.setColor([1,0.7,1,1]);
		
		TheDistricts[2].tv.x = 768;
		TheDistricts[2].tv.setColor([1,0.7,0.7,1]);
		TheDistricts[2].tvDial.setColor([1,0.7,0.7,1]);
		
		TheDistricts[3].tv.x = 1024;
		TheDistricts[3].tv.setColor([1,1,0.7,1]);
		TheDistricts[3].tvDial.setColor([1,1,0.7,1]);
		
		TheDistricts[4].tv.x = 400;
		TheDistricts[4].tv.y = 237;
		TheDistricts[4].tv.setColor([0.7,1,1,1]);
		TheDistricts[4].tvDial.setColor([0.7,1,1,1]);
		
		TheDistricts[5].tv.x = 640;
		TheDistricts[5].tv.y = 237;
		TheDistricts[5].tv.setColor([0.7,1,0.7,1]);
		TheDistricts[5].tvDial.setTextureRectangle([28,0,56,28]);
		
		TheDistricts[6].tv.x = 880;
		TheDistricts[6].tv.y = 237;
		
		for(var i in TheDistricts){
			TheDistricts[i].tvDial.x = TheDistricts[i].tv.x + 74;
			TheDistricts[i].tvSupport.x = TheDistricts[i].tvDial.x;
			
			TheDistricts[i].tvSupport.y = 30;
			if (i > 3) TheDistricts[i].tvSupport.y = 184;
			
			TheDistricts[i].tvDial.y = 67;
			if (i > 3) TheDistricts[i].tvDial.y = 222;
		}
		
	},
	
	initReps: function initReps(){
		for(var i in TheReps){
			var me = TheReps[i];
			TheReps[i].sprite = Draw2DSprite.create(Sprites.rep);
			TheReps[i].sprite.setTexture(textures[ repTextures[me.party] ]);
			TheReps[i].sprite.x = me.district.tv.x - 21;
			TheReps[i].sprite.y = me.district.tv.y - 10;
			TheReps[i].noise = Draw2DSprite.create(Sprites.rep);
			TheReps[i].noise.x = TheReps[i].sprite.x;
			TheReps[i].noise.y = TheReps[i].sprite.y;
			TheReps[i].noise.setTexture(textures["noise"+randomNumber(0,3)]);
			TheReps[i].noise.color = [1,1,1,0.25];
			TheReps[i].podiumVote = Draw2DSprite.create(Sprites.podiumVote);
			TheReps[i].podiumVote.x = TheReps[i].sprite.x;
			TheReps[i].podiumVote.y = TheReps[i].sprite.y + 28;
		}
	},
	
	initVoters: function initVoters(){
		
		for(var i in ThePeople){
			ThePeople[i].sprite = Draw2DSprite.create(Sprites.voter);
			ThePeople[i].sprite.setTexture(textures["voter"]);
			if(ThePeople[i].active)
				ThePeople[i].sprite.setTextureRectangle(Sprites.voter.presets.active);
			else
				ThePeople[i].sprite.setTextureRectangle(Sprites.voter.presets.inactive);
		}
		
		for(var j in ThePeople){
			var xPos = 0;
			var yPos = 0;
			var color = [1,1,1,1];
			me = ThePeople[j];
			
			//District 0
			if(j == 0){
				xPos = 168;
				yPos = 330;
				color = [0.6,0.6,1,1];
			}
			else if(j < 100){
				var factor = j/10;
				var counter = (factor - Math.floor(factor)) * 10;
				yPos = 330 + (Math.floor(factor) * 10);
				xPos = 168 + (counter * 32);
				xPos -= 16 * (Math.floor(factor));
				color = [0.6,0.6,1,1];
			}
			else if(j < 103){
				var factor = j - 100;
				yPos = 430;
				xPos = 68 + (factor * 96);
				color = [0.6,0.6,1,1];
			}
			
			//District 1
			else if(j < 203){
				var factor = (j-103)/5;
				var counter = ( (factor - Math.floor(factor) ) * 10) / 2;
				yPos = 330 + (Math.floor(factor) * 10);
				xPos = 510 + (counter * 28);
				xPos -= 15 * (Math.floor(factor));
				color = [1,0.6,1,1];
			}
			else if(j < 206){
				var factor = j - 203;
				yPos = 530;
				xPos = 208 + (factor * 56);
				color = [1,0.6,1,1];
			}
			
			//District 2
			else if(j < 306){
				var factor = (j-206)/5;
				var counter = ( (factor - Math.floor(factor) ) * 10) / 2;
				yPos = 330 + (Math.floor(factor) * 10);
				xPos = 660 + (counter * 28);
				xPos += 15 * (Math.floor(factor));
				color = [1,0.6,0.6,1];
			}
			else if(j < 309){
				var factor = j - 306;
				yPos = 530;
				xPos = 960 + (factor * 56);
				color = [1,0.6,0.6,1];
			}
			
			//District 3
			else if(j < 409){
				var factor = (j - 309)/10;
				var counter = (factor - Math.floor(factor)) * 10;
				yPos = 330 + (Math.floor(factor) * 10);
				xPos = 820 + (counter * 32);
				xPos += 16 * (Math.floor(factor));
				color = [1,1,0.6,1];
			}
			else if(j < 412){
				var factor = j - 409;
				yPos = 430;
				xPos = 1012 + (factor * 96);
				color = [1,1,0.6,1];
			}
			
			//District 4
			else if(j < 512){
				var factor = (j - 412)/10;
				var counter = (factor - Math.floor(factor)) * 10;
				yPos = 580 + (Math.floor(factor) * 10);
				xPos = 168 + (counter * 32);
				xPos -= 16 * (Math.floor(factor));
				color = [0.6,1,1,1];
			}
			else if(j < 515){
				var factor = j - 512;
				yPos = 680;
				xPos = 68 + (factor * 96);
				color = [0.6,1,1,1];
			}
			
			//District 5
			else if(j < 565){
				var factor = (j-515)/5;
				var counter = ( (factor - Math.floor(factor) ) * 10) / 2;
				yPos = 580 + (Math.floor(factor) * 10);
				xPos = 500 + (counter * 32);
				if(Math.floor(factor) % 2)
					xPos -= 16;
				color = [0.6,1,0.6,1];
			}
			else if(j < 615){
				var factor = (j-565)/5;
				var counter = ( (factor - Math.floor(factor) ) * 10) / 2;
				yPos = 580 + (Math.floor(factor) * 10);
				xPos = 650 + (counter * 32);
				if(Math.floor(factor) % 2)
					xPos += 16;
				color = [0.6,1,0.6,1];
			}
			else if(j < 618){
				var factor = j - 615;
				yPos = 688;
				xPos = 532 + (factor * 107);
				color = [0.6,1,0.6,1];
			}
			
			//District 6
			else if(j < 718){
				var factor = (j - 618)/10;
				var counter = (factor - Math.floor(factor)) * 10;
				yPos = 580 + (Math.floor(factor) * 10);
				xPos = 820 + (counter * 32);
				xPos += 16 * (Math.floor(factor));
			}
			else if(j < 721){
				var factor = j - 718;
				yPos = 680;
				xPos = 1012 + (factor * 96);
			}
			
		
			if (me.isPlayer) {
				me.sprite.setTextureRectangle([37,0,63,64]);
				me.sprite.setWidth(27);
				me.sprite.setHeight(64);
				yPos = 660;
				xPos -= 10;
				color = [1,1,1,1];
			}
			
			else if (me.playerFriend){
				if(me.active)
					me.sprite.setTextureRectangle(Sprites.voter.presets.activePlayerFriend);
				else
					me.sprite.setTextureRectangle(Sprites.voter.presets.inactivePlayerFriend);
				me.sprite.setWidth(18);
				me.sprite.setHeight(40);
				yPos -= 16;
				xPos -= 4;
				var rCo = me.district.rep.party;
				if (me.district.rep.constituentSupport[me.id]) {
					if (rCo) color = [0,0,1,1];
					else color = [1,0,0,1];
				}
				else{
					if (rCo) color = [1,0,0,1];
					else color = [0,0,1,1];	
				}
				
			}
			
			//Set Position
			me.sprite.x = xPos;
			me.sprite.y = yPos;
			me.sprite.setColor(color);
		}
	},
	
	writeFont: function writeFont(text, scale, xOffset, yOffset, alignment, color) {
		color = color || [1,1,1,1];
	    var font = fonts["ps"];
		var fontTechnique = Graphics.fontShader.getTechnique('font');
		var fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
            clipSpace: Graphics.clipSpace,
            alphaRef: 0.01,
            color: color
        });
        graphicsDevice.setTechnique(fontTechnique);
        fontTechniqueParameters.color = color;
        graphicsDevice.setTechniqueParameters(fontTechniqueParameters);
        if(text) {
            var topLeft = draw2D.viewportUnmap(xOffset, yOffset);
            var bottomRight = draw2D.viewportUnmap(xOffset + 10, yOffset + 1);
            font.drawTextRect(text, {
                rect: [
                    topLeft[0], 
                    topLeft[1], 
                    bottomRight[0] - topLeft[0], 
                    bottomRight[1] - topLeft[1]
                ],
                scale: scale,
                spacing: 0,
                alignment: alignment
            });
        }
        yOffset += 2;
    },

	timerRect: [
		[0,0,32,32],
		[32,0,64,32],
		[64,0,96,32],
		[96,0,128,32],
		[0,32,32,64],
		[32,32,64,64],
		[64,32,96,64],
		[96,32,128,64],
		[0,64,32,96],
		[32,64,64,96],
		[64,64,96,96],
		[96,64,128,96],
		[0,96,32,128],
		[32,96,64,128],
		[64,96,96,128],
		[96,96,128,128]
	],
	
	Timer: function(x,y,duration){
		this.sprite = Draw2DSprite.create(Sprites.timer);
		this.sprite.x = x;
		this.sprite.y = y;
		this.duration = duration;
		this.startTime = currentTime;
		this.draw = function(){
			if(!paused) {
				var index = secondTimer;
				index = index / duration;
				index = Math.floor(index*16);
				this.sprite.setTextureRectangle(Graphics.timerRect[index]);
				draw2D.drawSprite(this.sprite);	
			}
		};
	},
};

GameObj.prototype.animate = function animateThing(time){
	var time = time || TurbulenzEngine.time;
	if (this.animation){
		if (!paused) {
			if (currentTime - this.animation.start >= this.animation.rate){
				this.animation.counter++;
				this.animation.start = time;
			}
			if(this.animation.counter >= (this.animation.frames.length - 1) ){
				if (this.animation.audioFrames) this.soundSource.clear();
				this.animation = null;
			}
		}
		if(this.animation) {
			this.sprite = this.animation.frames[this.animation.counter];
			this.sprite.refreshTexture();
			if (this.animation.audioFrames){
				if ( (!this.soundSource.playing) || (this.sound != this.animation.audioFrames[this.animation.counter]) ) {
					this.soundSource.clear();
					var playSound = sounds[this.animation.audioFrames[this.animation.counter]];
					if (playSound) this.soundSource.play(playSound);
					this.sound = this.animation.audioFrames[this.animation.counter];
				}
			}
		}
	}
	else {
		this.sprite.refreshTexture();
	}
}
GameObj.prototype.fadeIn = function fadeIn(time, r, g, b, a){
	var r = r || 1;
	var g = g || 1;
	var b = b || 1;
	var a = a || 1;
	var startColor = [r,g,b,0];
	var endColor = [r,g,b,a];
	var rate = 0.033;
	var numFrames = Math.floor(time/rate);
	var frames = [];
	for(var i=1;i<=numFrames;i++){
		var opc = i*rate;
		frames.push([1,1,1,opc]);
	}
	this.sprite.setColor(startColor);
	this.animation = new Animation(frames,rate,"fade");
}


District.prototype.drawTV = function drawTV(){
	var me = ThePlayer.pet;
	var mySupport = me.peopleSupport[ThePlayer.id];
	var repSupport = me.announcedRepSupport[this.rep.id];
	var supportY = 0;
	var supportX = 0;
	if (repSupport !== undefined) {
		if (repSupport) supportY = 28;
		if (mySupport == repSupport) supportX = 28;
	}
	else {
		supportY = 56;
	}
	this.tvSupport.refreshTexture();
	this.tvSupport.setTextureRectangle([supportX, supportY, supportX+28, supportY+28]);
	draw2D.drawSprite(this.tvSupport);
	
	if (this == ThePlayer.district) {
		if (
			(ThePlayer.actionBubble) 
			|| (ThePlayer.pet == Bills[0])
			|| (gameState != "bill")
		) {
			this.tvDial.setTextureRectangle([28,28,56,56]);
		}
		
		else this.tvDial.setTextureRectangle([28,0,56,28]);
		
		if (
			(isMouseInBox(this.tv.getBounds()))
			&& (gameState == "bill")
			&& (Bills[0] != ThePlayer.pet)
			&& (!ThePlayer.actionBubble)
		){
			this.tvDial.setTextureRectangle([0,28,28,56]);
			if (mouseFireButtonDown) {
				this.tv.setScale([1,0.96]);
				this.tvSupport.y = 186;
			}
		}
	}
	draw2D.drawSprite(this.tvDial);
	
	
	if(!this.rep.animation){
		if (Bills[0].castVotes[this.rep.id]){
			mySupport = Bills[0].repSupport[this.rep.id];
			if (mySupport){
				this.rep.podiumVote.setTextureRectangle(Sprites.podiumVote.presets.yes);
			}
			draw2D.drawSprite(this.rep.podiumVote);
		}
		if(gameState == "results") {
			draw2D.end();

			var myParty = "Red";
			var otherParty = "Blu";
			if (this.rep.party) myParty = "Blu";
			if (this.rep.party) otherParty = "Red";
			var title = myParty+" wins";
			Graphics.writeFont(title, 0.18, this.rep.sprite.x, this.rep.sprite.y-42, 1, [1,1,1,1]);
			Graphics.writeFont(myParty+":", 0.18, this.rep.sprite.x-32, this.rep.sprite.y-16, 1, [1,1,1,1]);
			Graphics.writeFont(String(this.results[myParty]), 0.18, this.rep.sprite.x+32, this.rep.sprite.y-16, 1, [1,1,1,1]);
			Graphics.writeFont(otherParty+":", 0.18, this.rep.sprite.x-32, this.rep.sprite.y, 1, [1,1,1,1]);
			Graphics.writeFont(String(this.results[otherParty]), 0.18, this.rep.sprite.x+32, this.rep.sprite.y, 1, [1,1,1,1]);
			Graphics.writeFont("Turnout:", 0.15, this.rep.sprite.x-30, this.rep.sprite.y+16, 1, [1,1,1,1]);
			Graphics.writeFont(String(this.results["turnout"]+"%"), 0.15, this.rep.sprite.x+32, this.rep.sprite.y+16, 1, [1,1,1,1]);
			
			draw2D.begin("alpha","texture");
		}
	}
	
	this.tv.refreshTexture();
	draw2D.drawSprite(this.tv);
}

Voter.prototype.draw = function drawVoter(){
	if (!this.isPlayer){
		if (!this.playerFriend) {
			if (this.active)
				this.sprite.setTextureRectangle(Sprites.voter.presets.active);
			else 
				this.sprite.setTextureRectangle(Sprites.voter.presets.inactive);
		}
	}
	//draw2D.drawSprite(this.sprite);
}

Rep.prototype.draw = function drawRep(){
	this.animate();
	draw2D.drawSprite(this.sprite);
	
	if(!paused){
		this.noise.setTexture(textures["noise"+randomNumber(0,3)]);
		draw2D.drawSprite(this.noise);
	}

}

Rep.prototype.staticTransitionTo = function staticTransitionTo(frames, duration, back, noSound){
	var bzzt = [];
	var timeline = [];
	var soundTimeline = [];
	var bzFPS = 30;
	for(i = 0; i<10; i++){
		var bz = Draw2DSprite.create(Sprites.rep);
		bz.x = this.sprite.x;
		bz.y = this.sprite.y;
		bz.setTexture(textures["static"]);
		bz.setColor([1,1,1,1]);
		var bX = randomNumber(0,128);
		var bY = randomNumber(0,160);
		bz.setTextureRectangle([bX,bY,bX+128,bY+96]);
		bzzt.push(bz);
	}

	for(var i in bzzt){
		timeline.push(bzzt[i]);
		soundTimeline.push("noise");
	}
	
	for(var i=0;i<frames.length-1;i++){
		for(var j=0; j<duration*bzFPS; j++){
			timeline.push(frames[i]);
			soundTimeline.push("");
		}
	}
	if (back) {
		for(var i in bzzt){
			timeline.push(bzzt[i]);
			soundTimeline.push("noise");
		}
	}
	timeline.push(frames[frames.length]);
	if (!noSound) this.animation = new Animation(timeline,1/bzFPS,soundTimeline);
	else this.animation = new Animation(timeline,1/bzFPS);
}

Rep.prototype.flicker = function flicker(){
	if(!this.animation){
		var f0 = Draw2DSprite.create(Sprites.rep);
		var f1 = Draw2DSprite.create(Sprites.rep);
		f0.x = this.sprite.x;
		f1.x = this.sprite.x;
		f0.y = this.sprite.y;
		f1.y = this.sprite.y;
		var party;
		if(this.party) party = "repBlu";
		else party = "repRed";
		f0.setTexture(textures[party+"Flicker0"]);
		f1.setTexture(textures[party+"Flicker1"]);
		var frames = [f0, f1, this.sprite];
		var audioFrames = ["flicker","flicker", null];
		if(randomBool()) frames = [f1, f0, this.sprite];
		this.animation = new Animation(frames,0.033, audioFrames);
	}
}

Rep.prototype.callError = function callError(){
		var error = Draw2DSprite.create(Sprites.rep);
		error.setTexture(textures["repCallError"]);
		error.x = this.sprite.x;
		error.y = this.sprite.y;
		var frames = [error, this.sprite];
		this.staticTransitionTo(frames,1,true);
}

Rep.prototype.scareAnimation = function scareAnimation(party){
	if(!this.animation){
		var ad;
		if (party) ad = Draw2DSprite.create(Sprites.adBlu);
		else ad = Draw2DSprite.create(Sprites.adRed);
		ad.x = this.sprite.x;
		ad.y = this.sprite.y;
		var frames = [ad, this.sprite];
		this.staticTransitionTo(frames,2.5,true);
	}
}