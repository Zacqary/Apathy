var textures = [];
var textureNames = [];
textureNames["cursor"] = "textures/cursor.png";

textureNames["background1a"] = "textures/background1a.png";
textureNames["background2a"] = "textures/background2a.png";
textureNames["background3a"] = "textures/background3a.png";
textureNames["background1b"] = "textures/background1b.png";
textureNames["background2b"] = "textures/background2b.png";
textureNames["background3b"] = "textures/background3b.png";

textureNames["electionShade1a"] = "textures/electionShade1a.png";
textureNames["electionShade2a"] = "textures/electionShade2a.png";
textureNames["electionShade3a"] = "textures/electionShade3a.png";
textureNames["electionShade1b"] = "textures/electionShade1b.png";
textureNames["electionShade2b"] = "textures/electionShade2b.png";
textureNames["electionShade3b"] = "textures/electionShade3b.png";

var backgroundComponents = ["1a","2a","3a","1b","2b","3b"];

textureNames["voter"] = "textures/voter.png";
textureNames["friendSupport"] = "textures/friendSupport.png";
textureNames["friendSupportCB"] = "textures/friendSupportCB.png";

textureNames["timer"] = "textures/timer.png";

textureNames["tv"] = "textures/tv.png";
textureNames["tvDial"] = "textures/tvDial.png";
textureNames["tvSupport"] = "textures/tvSupport.png";
textureNames["tvSupportCB"] = "textures/tvSupportCB.png";

textureNames["repRed"] = "textures/repRed.png";
textureNames["repBlu"] = "textures/repBlu.png";
textureNames["repCallError"] = "textures/repCallError.png";
var repTextures = ["repRed","repBlu"];

textureNames["podiumVote"] = "textures/podiumVote.png";

textureNames["repRedFlicker0"] = "textures/repRedFlicker0.png";
textureNames["repRedFlicker1"] = "textures/repRedFlicker1.png";
textureNames["repBluFlicker0"] = "textures/repBluFlicker0.png";
textureNames["repBluFlicker1"] = "textures/repBluFlicker1.png";

textureNames["repRed2Blu0"] = "textures/repRed2Blu0.png";
textureNames["repRed2Blu1"] = "textures/repRed2Blu1.png";
textureNames["repRed2Blu2"] = "textures/repRed2Blu2.png";
textureNames["repBlu2Red0"] = "textures/repBlu2Red0.png";
textureNames["repBlu2Red1"] = "textures/repBlu2Red1.png";
textureNames["repBlu2Red2"] = "textures/repBlu2Red2.png";


textureNames["adRed"] = "textures/adRed.png";
textureNames["adBlu"] = "textures/adBlu.png";

textureNames["noise0"] = "textures/noise0.png";
textureNames["noise1"] = "textures/noise1.png";
textureNames["noise2"] = "textures/noise2.png";
textureNames["noise3"] = "textures/noise3.png";

textureNames["static"] = "textures/static.png";
textureNames["tablePassFail"] = "textures/tablePassFail.png";
textureNames["tablePassFailCB"] = "textures/tablePassFailCB.png";

textureNames["action"] = "textures/action.png";
textureNames["actionPlayer"] = "textures/actionPlayer.png";

textureNames["voteButton"] = "textures/voteButton.png";

textureNames["btnPause"] = "textures/btnPause.png";
//textureNames["btnExit"] = "textures/btnExit.png";
textureNames["goalSigns"] = "textures/goalSigns.png";

textureNames["fax"] = "textures/fax.png";
textureNames["faxPass"] = "textures/faxPass.png";
textureNames["faxKill"] = "textures/faxKill.png";
textureNames["okButton"] = "textures/okButton.png";

textureNames["arrow"] = "textures/arrow.png";

textureNames["menuTV"] = "textures/menuTV.png";
textureNames["menuNoise"] = "textures/menuNoise.png";
textureNames["menuNoiseLite"] = "textures/menuNoiseLite.png";
textureNames["scanLine"] = "textures/scanLine.png";

var fontNames = [];
var fonts = [];
fontNames["ps"] = "fonts/press-start-outline.fnt.json";

function textureParams(name, src){
	return {
		src: src,
		mipmaps: true,
		onload: function (texture){
			texture.name = name;
			textures[name] = texture;
			resourcesLoaded++;
		}
	}
}

var background = [];
var electionShade = [];

Draw2DSprite.prototype.refreshTexture = function refreshTexture() {
	if(this.texture){
		this.setTexture(textures[this.texture.name]);
	}
}

var Sprites = {
	
	pause: Draw2DSprite.create({
		texture: null,
		width: 1280,
		height: 720,
		x: 640,
		y: 360,
		rotation: 0,
		color: [0.3,0.3,0.3,0.5],
		textureRectangle: [0,0,1280,720]
	}),
	
	voter: {
		presets: {
			active: [0, 0, 10, 24],
			inactive: [10, 0, 20, 24],
			activePlayerFriend: [0,24,18,64],
			inactivePlayerFriend: [18,24,36,64]
		}
	},

	tv: {},

	tvDial: {
		presets: {
			npd: [0, 0, 28, 28],
			pdActive: [28, 0, 28, 28],
			pdHover: [0, 28, 28, 56],
			pdInactive: [28, 28, 56, 56]
		}
	},
	
	tvSupport: {},
	
	rep: {},
}

function initTextures() {
	var bkgStep = 0;
	for(var i in backgroundComponents){
		me = backgroundComponents[i];
		var xMult = bkgStep;
		var yIs = 256;
		if (bkgStep > 2) {
			xMult -= 3;
			yIs = 768;
		}
		background[bkgStep] = Draw2DSprite.create({
			texture: textures["background"+me],
			width: 512,
			height: 512,
			x: 256 + (xMult*512),
			y: yIs,
			rotation: 0,
			color: mathDevice.v4Build(1,1,1,1),
			textureRectangle: mathDevice.v4Build(0, 0, 512, 512)
		});
		electionShade[bkgStep] = new GameObj();
		electionShade[bkgStep].sprite = Draw2DSprite.create({
			texture: textures["electionShade"+me],
			width: 512,
			height: 512,
			x: 256 + (xMult*512),
			y: yIs,
			rotation: 0,
			color: mathDevice.v4Build(0.5,0.5,0.5,0.6),
			textureRectangle: mathDevice.v4Build(0, 0, 512, 512)
		});
	bkgStep++;
	}
	
	Sprites.cursor = {
		texture: textures["cursor"],
		width:32,
		height:32,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: [0,0,32,32]
	}
	
	Sprites.timer = {
		texture: textures["timer"],
		width: 32,
		height: 32,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: [0,0,32,32]
	}
	
	Sprites.voter = {
		texture: textures["voter"],
		width: 10,
		height: 24,
		x: 100,
		y: 100,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: Sprites.voter.presets.inactive,
		presets: Sprites.voter.presets
	};
	
	Sprites.tv = {
		texture: textures["tv"],
		width: 195,
		height: 145,
		x: 256,
		y: 82,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 195, 145)
	};
	
	Sprites.tvDial = {
		texture: textures["tvDial"],
		width: 28,
		height: 28,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: Sprites.tvDial.presets.npd,
		presets: Sprites.tvDial.presets
	}
	
	Sprites.tvSupport = {
		texture: textures["tvSupport"],
		width: 28,
		height: 28,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: [0, 0, 28, 28],
	}
	if (colorBlind) Sprites.tvSupport.texture = textures["tvSupportCB"];
	
	Sprites.rep = {
		texture: null,
		width: 128,
		height: 98,
		x: 256,
		y: 82,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 128, 96)
	}
	
	Sprites.podiumVote = {
		texture: textures["podiumVote"],
		width: 32,
		height: 32,
		x: 256,
		y: 100,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,0.6),
		textureRectangle: [0, 0, 32, 32],
		presets: {
			no: [0, 0, 32, 32],
			yes: [0, 32, 32, 64]
		}
	}
	
	Sprites.adBlu = {
		texture: textures["adBlu"],
		width: 128,
		height: 98,
		x: 256,
		y: 82,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 128, 96)
	}
	Sprites.adRed = {
		texture: textures["adRed"],
		width: 128,
		height: 98,
		x: 256,
		y: 82,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 128, 96)
	}
	
	Sprites.tablePassFail = {
		texture: textures["tablePassFail"],
		width: 562,
		height: 162,
		x: 640,
		y: 462,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 559, 157),
	}
	if (colorBlind) Sprites.tablePassFail.texture = textures["tablePassFailCB"];
	
	Sprites.actionBubble = {
		texture: textures["action"],
		width: 16,
		height: 16,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 16, 16),
	}
	
	Sprites.actionBubblePlayer = {
		texture: textures["actionPlayer"],
		width: 32,
		height: 32,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0, 0, 32, 32),
	}
	
	Sprites.goalSign = {
		texture: textures["goalSigns"],
		width: 84,
		height: 256,
		x: 1200,
		y: 180,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,84,256),
	}
	
	Sprites.signButton = {
		textures: textures["btnPause"],
		width:84,
		height:115,
		x: 64,
		y: 64,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,84,115),
	}
	
	Sprites.voteButton = {
		texture: textures["voteButton"],
		width: 96,
		height: 48,
		x: null,
		y: 482,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,96,48),
	}
	
	Sprites.friendSupport = {
		texture: textures["friendSupport"],
		width: 16,
		height: 16,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,16,16),
	}
	if (colorBlind) Sprites.friendSupport.texture = textures["friendSupportCB"];
	
	Sprites.fax = {
		texture: textures["fax"],
		width: 1024,
		height: 683,
		x: 640,
		y: 380,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,1024,683),
	}
	Sprites.faxGoal = {
		texture: textures["faxKill"],
		width: 128,
		height: 128,
		x: 960,
		y: 530,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,128,128),
	}
	Sprites.okButton = {
		texture: textures["okButton"],
		width: 128,
		height: 64,
		x: 960,
		y: 640,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,128,64),
	}
	Sprites.tutorialArrow = {
		texture: textures["arrow"],
		width: 64,
		height: 32,
		x: null,
		y: null,
		rotation: 0,
		color: mathDevice.v4Build(1,1,1,1),
		textureRectangle: mathDevice.v4Build(0,0,64,32),
	}
	Sprites.menuTV = {
		texture: textures["menuTV"],
		width: 1280,
		height: 720,
		x: 640,
		y: 360,
		rotation: 0,
		color: mathDevice.v4Build(0.8,0.8,1,1),
		textureRectangle: mathDevice.v4Build(0,0,1280,720),
	}
}

function initBackground(){
	var bkgStep = 0;
	for(var i in backgroundComponents){
		me = backgroundComponents[i];
		var xMult = bkgStep;
		var yIs = 256;
		if (bkgStep > 2) {
			xMult -= 3;
			yIs = 768;
		}
		background[bkgStep].setTexture(textures["background"+me]);
		background[bkgStep].x = 256 + (xMult*512);
		background[bkgStep].y = yIs;
		electionShade[bkgStep].sprite.setTexture(textures["electionShade"+me]);
		electionShade[bkgStep].sprite.x = 256 + (xMult*512);
		electionShade[bkgStep].sprite.y = yIs;
		bkgStep++;
	}
}