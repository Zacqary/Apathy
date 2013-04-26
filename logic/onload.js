var currentTime;
var previousFrameTime;
var resourcesLoaded = 0;
var prelimResourcesLoaded = 0;
var transitionTimer = 0;

TurbulenzEngine.onload = function onloadFn() 
{	
	var errorCallback = function errorCallback(msg) 
	{
		window.alert(msg);
	};
	TurbulenzEngine.onerror = errorCallback;

	// Initialize API Devices
	var mathDeviceParameters = { };
	mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

	var graphicsDeviceParameters = { };
	graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);
	
	var inputDeviceParameters = { };
 	inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);
	keyCodes = inputDevice.keyCodes;
	mouseCodes = inputDevice.mouseCodes;
	
	var soundDeviceParameters = {
        linearDistance: false
    };
    soundDevice = TurbulenzEngine.createSoundDevice(soundDeviceParameters);
	
	var requestHandlerParameters = { };
	var requestHandler = RequestHandler.create(requestHandlerParameters);
	
	var fontManager = FontManager.create(graphicsDevice, requestHandler);
	var shaderManager = ShaderManager.create(graphicsDevice, requestHandler);
	
	var intervalID;
	
	// Initialize Graphics
	draw2D = Draw2D.create({
		graphicsDevice : graphicsDevice
	});
	
	
	var gameWidth = 1280;
	var gameHeight = 720;
	
	var viewport = mathDevice.v4Build(0, 0, gameWidth, gameHeight);
	var configureParams = {
		scaleMode : 'scale',
		viewportRectangle : viewport,
	};
	draw2D.configure(configureParams);
	
	// Initialize Textures
	var resourcesToLoad = objSize(textureNames);
	resourcesToLoad += objSize(fontNames);
	resourcesToLoad += objSize(soundNames);
	resourcesToLoad += objSize(musicNames);
	resourcesToLoad += 2; //For font shader and video
	
	for(var i in textureNames){
		var newTex = textureParams(i, textureNames[i]);
		newTex = graphicsDevice.createTexture(newTex);
	}
	
	// Initialize Sound and Music
	for (var i in soundNames){
		var newSound = soundParams(i, soundNames[i], false);
		newSound = soundDevice.createSound(newSound);
	}
	for (var i in musicNames){
		var newSound = soundParams(i, musicNames[i], true);
		newSound = soundDevice.createSound(newSound);
	}
	
	// Initialize Video
	var logoVid;
	var videoSrc = "video/PlankheadLogo.webm";
	if (graphicsDevice.isSupported("FILEFORMAT_WEBM")) {
		graphicsDevice.createVideo({
			src: videoSrc,
			looping: false,
			onload: function(v) {
				if (v){
					logoVid = v;
					resourcesLoaded++;
				}
			}
		});
	}
	
	var videoShader;
	var videoTechnique;
	var videoTexture;
	var videoPosition = -1;
	var videoSound = soundDevice.createSource(Sound.defaultSource);
	shaderManager.load('video/video.cgfx.json', function (shaderObject) {
        videoShader = shaderObject;
		videoTechnique = videoShader.getTechnique("video");
        resourcesLoaded++;
    });
	
	var vertexBuffer = graphicsDevice.createVertexBuffer({
        numVertices: 4,
        attributes: [
            graphicsDevice.VERTEXFORMAT_FLOAT2, 
            graphicsDevice.VERTEXFORMAT_FLOAT2
        ],
        dynamic: false,
        data: [
            -1.0, 
            1.0, 
            0.0, 
            1.0, 
            1.0, 
            1.0, 
            1.0, 
            1.0, 
            -1.0, 
            -1.0, 
            0.0, 
            0.0, 
            1.0, 
            -1.0, 
            1.0, 
            0.0
        ]
    });
	var primitive = graphicsDevice.PRIMITIVE_TRIANGLE_STRIP;
    var semantics = graphicsDevice.createSemantics([
        'POSITION', 
        'TEXCOORD0'
    ]);
	
	
	// Initialize Fonts
	shaderManager.load('fonts/font.cgfx.json', function (shaderObject) {
        Graphics.fontShader = shaderObject;
        resourcesLoaded++;
    });


	for(var i in fontNames){
		var onload = function onloadFn(font) {
			fonts[i] = font;
			resourcesLoaded++;
			prelimResourcesLoaded++;
		}
		fontManager.load(fontNames[i], onload);
		
	}

	// Update
	previousFrameTime = TurbulenzEngine.time;
	
	if (!gameStarted) startGame();
	
	// Wait till everything's loaded before starting the game
	var loadingLoop = function loadingLoop()
	{
		if (graphicsDevice.beginFrame())
		{	
			graphicsDevice.clear([0.0,0.0,0.2,1.0]);
			var bar = Draw2DSprite.create({
				texture:null,
				x: 640,
				y: 360,
				height: 64,
				width: 640,
				color: [0.5,0,0,1],
			})
			draw2D.begin();
			draw2D.drawSprite(bar);
			var barWidth = (resourcesLoaded * 640)/resourcesToLoad;
			bar.setWidth(barWidth);
			bar.setColor([1,1,1,1]);
			draw2D.drawSprite(bar);
			draw2D.end();
			
			graphicsDevice.endFrame();
		}
		if(resourcesLoaded >= resourcesToLoad){
			initTextures();
			Graphics.initGameSprites();
			Sound.initSources();
			TurbulenzEngine.clearInterval(intervalID);
			if (logoVid) { 
				logoVid.play();
				videoSound.play(sounds["PlankheadLogo"]);
				videoTexture = graphicsDevice.createTexture({
	                width: logoVid.width,
	                height: logoVid.height,
	                mipmaps: false,
	                format: 'R8G8B8',
	                dynamic: true,
	                data: logoVid
	            });
				videoPosition = logoVid.tell;
				intervalID = TurbulenzEngine.setInterval(logoLoop, 1000 / 60);
			}
			else {
				Sound.playSoundIntro();
				intervalID = TurbulenzEngine.setInterval(introLoop, 1000 / 60);
			}
			
		}
	}
	
	var logoLoop = function logoLoop(){
		//Measure timing
		currentTime = TurbulenzEngine.time;
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			var deviceWidth = graphicsDevice.width;
            var deviceHeight = graphicsDevice.height;
            var aspectRatio = (deviceWidth / deviceHeight);
            var videoWidth = logoVid.width;
            var videoHeight = logoVid.height;
            var videoAspectRatio = (videoWidth / videoHeight);
            var x, y;
            if(aspectRatio < videoAspectRatio) {
                x = 1;
                y = aspectRatio / videoAspectRatio;
            } else
             {
                x = videoAspectRatio / aspectRatio;
                y = 1;
            }
			videoTechnique.clipSpace = mathDevice.v4Build(x, -y, 0, 0);
		 	var currentVideoPosition = logoVid.tell;
            if(currentVideoPosition && videoPosition !== currentVideoPosition) {
                if(currentVideoPosition < videoPosition) {
                    videoSound.seek(videoPosition);
                }
                videoPosition = currentVideoPosition;
                videoTexture.setData(logoVid);
            }
			graphicsDevice.setTechnique(videoTechnique);
			videoTechnique.texture = videoTexture;
			videoTechnique.color = [1,1,1,1];
			graphicsDevice.setStream(vertexBuffer, semantics);
            graphicsDevice.draw(primitive, 4);

			var opacity = 0;
			if (logoVid.tell >= sounds["PlankheadLogo"].length-1){
				opacity = 1-(sounds["PlankheadLogo"].length - videoSound.tell);
				var fader = Draw2DSprite.create({
					texture: null,
					width: 1280,
					height: 720,
					x: 640,
					y: 360,
					color: [0,0,0,opacity]
				});
				draw2D.begin("alpha");
				draw2D.drawSprite(fader);
				draw2D.end();
			}

			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		
		if (opacity >= 0.97) {
			logoVid.destroy();
			videoSound.destroy();
			TurbulenzEngine.clearInterval(intervalID);
			Sound.clearSources();
			Sound.playSoundIntro();
			intervalID = TurbulenzEngine.setInterval(introLoop, 1000 / 60);
		}
	}
	
	var introLoop = function introLoop(){
		//Measure timing
		currentTime = TurbulenzEngine.time;
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			Graphics.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1);
			if ( (Sound.musicSource.tell < sounds["introBuzz"].length) && (!Sound.transitionSource.playing) ) {
				Graphics.drawIntro();
			}
			else if (transitionTimer < 1.5) {
				Graphics.drawTransition(true,true);
				Sound.playSoundTransition();
			}
			else gameScene = "menu";
			
			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		
		if (gameScene == "menu") {
			TurbulenzEngine.clearInterval(intervalID);
			Graphics.drawTransition(true,true);
			Sound.clearSources();
			intervalID = TurbulenzEngine.setInterval(menuLoop, 1000 / 60);
		}
	}
	
	var menuLoop = function menuLoop(){
		//Measure timing
		currentTime = TurbulenzEngine.time;
	
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			Graphics.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1);
			if (transitionTimer > 0.3) {
				Graphics.drawMenu();
				Sound.playSoundMenu();
			}
			else {
				Graphics.drawTransition(true,true);
				Sound.playSoundTransition();
			}
			Graphics.drawCursor();
			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		
		if (gameScene == "game") {
			transitionTimer = 0;
			Sound.clearSources();
			TurbulenzEngine.clearInterval(intervalID);
			intervalID = TurbulenzEngine.setInterval(menu2GameLoop, 1000 / 60);
		}
	};
	
	var menu2GameLoop = function menu2GameLoop(){
		//Measure timing
		currentTime = TurbulenzEngine.time;
	
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			Graphics.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1);
			Graphics.drawTransition(true);
			Sound.playSoundTransition();
			Graphics.drawCursor();
			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		if (transitionTimer >= 1) {
			TurbulenzEngine.clearInterval(intervalID);
			Sound.clearSources();
			intervalID = TurbulenzEngine.setInterval(gameLoop, 1000 / 60);
		}
	}
	
	var outroLoop = function outroLoop(){
		//Measure timing
		currentTime = TurbulenzEngine.time;
	
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			Graphics.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1);
			Graphics.drawOutro();
			Sound.playSoundOutro();
			Graphics.drawCursor();
			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		
		if (gameScene == "menu") {
			transitionTimer = 0;
			TurbulenzEngine.clearInterval(intervalID);
			Graphics.drawTransition(true,true);
			Sound.clearSources();
			intervalID = TurbulenzEngine.setInterval(menuLoop, 1000 / 60);
		}
	};
	
	var game2OutroLoop = function menu2GameLoop(){
		//Measure timing
		currentTime = TurbulenzEngine.time;
	
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			Graphics.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1);
			Graphics.drawTransition(false);
			Sound.playSoundTransition();
			Graphics.drawCursor();
			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		if (transitionTimer <= 0) {
			TurbulenzEngine.clearInterval(intervalID);
			Graphics.drawTransition(true,true);
			Sound.clearSources();
			intervalID = TurbulenzEngine.setInterval(outroLoop, 1000 / 60);
		}
	}
	
	var gameLoop = function updateFn()
    {	
		//Measure timing
		currentTime = TurbulenzEngine.time;
		
		queueAndTakeTurns();
		
		//Draw Frame
		if (graphicsDevice.beginFrame())
		{	
			Graphics.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1);
			Graphics.drawScene();
			Sound.playSoundGame();
			Graphics.drawCursor();
			graphicsDevice.endFrame();
		}
		
		previousFrameTime = currentTime;
		if (gameScene == "outro") {
			transitionTimer = 1;
			Sound.clearSources();
			TurbulenzEngine.clearInterval(intervalID);
			intervalID = TurbulenzEngine.setInterval(game2OutroLoop, 1000 / 60);
		}
	};

	// Set Interval
	intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

	TurbulenzEngine.onunload = function onunloadFn() 
	{
		// Clear the interval to stop update from being called
		TurbulenzEngine.clearInterval(intervalID);

		// Tell the Turbulenz Engine to force the js virtual machine
		// to free as much memory as possible
		TurbulenzEngine.flush();

		// Clear each native engine reference
		graphicsDevice = null;
		mathDevice = null;
		
		TurbulenzEngine.onunload = null;
	};
	
	
	// Enable player input
	inputDevice.addEventListener('keydown', onKeyDown);
	inputDevice.addEventListener('keyup', onKeyUp);
	inputDevice.addEventListener('mouseover', onMouseOver);
	inputDevice.addEventListener('mousedown', onMouseDown);
	inputDevice.addEventListener('mouseup', onMouseUp);
	

	


};
