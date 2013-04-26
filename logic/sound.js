var soundNames = [];
var musicNames = [];

soundNames["introBuzz"] = "sounds/introBuzz";
soundNames["noise"] = "sounds/noise";
soundNames["hum"] = "sounds/hum";
soundNames["blip"] = "sounds/blip";
soundNames["bong"] = "sounds/bong";
soundNames["ding"] = "sounds/ding";
soundNames["dingQuiet"] = "sounds/dingQuiet";
soundNames["pass"] = "sounds/pass";
soundNames["fail"] = "sounds/fail";
soundNames["passQuiet"] = "sounds/passQuiet";
soundNames["failQuiet"] = "sounds/failQuiet";
soundNames["flicker"] = "sounds/flicker";
soundNames["click"] = "sounds/click";
soundNames["fax"] = "sounds/fax";
soundNames["PlankheadLogo"] = "video/PlankheadLogo";

musicNames["PressStart"] = "music/PressStart";
musicNames["InMemoryOfC64"] = "music/InMemoryOfC64";
musicNames["10PrintHelloWorld"] = "music/10PrintHelloWorld";
musicNames["20Goto10"] = "music/20Goto10";
musicNames["CarCrash"] = "music/CarCrash";
musicNames["BuyBeer"] = "music/BuyBeer";

var sounds = [];
var music = [];

var soundMenuState = 0;
var gameMusic = ['InMemoryOfC64','20Goto10','10PrintHelloWorld','CarCrash'];
var gameMusicState = 0;

var soundParams = function soundParams(name, src, isMusic){
	var ext = ".mp3";
	if(soundDevice.isSupported("FILEFORMAT_OGG")) ext = ".ogg";
	return {
		src: src+ext,
		onload: function (sound){
			sound.name = name;
			if (isMusic) music[name] = sound;
			else sounds[name] = sound;
			resourcesLoaded++;
		}
	}
}

var Sound = { 
	
	defaultSource: {
		position: [0,0,0],
		relative: false,
		looping: false,
		gain: 1.0
	},
	
	initSources: function initSources(){
		Sound.musicSource = soundDevice.createSource({
			position: [0,0,0],
			relative: false,
			looping: false,
		});
		Sound.ambientSource = soundDevice.createSource({
			position: [0,0,0],
			relative: false,
			looping: true,
		});
		Sound.transitionSource = soundDevice.createSource({
			position: [0,0,0],
			relative: false,
			looping: false,
		});
	},
	
	play: function playSound(sound){
		var blip = soundDevice.createSource(Sound.defaultSource);
		blip.play(sounds[sound]);
	},
	
	clearSources: function clearSources(){
		Sound.musicSource.clear();
		Sound.ambientSource.clear();
		Sound.transitionSource.clear();
		for (var i in TheReps){
			TheReps[i].soundSource.clear();
		}
	},
	
	playSoundIntro: function playSoundIntro(){
		if (Sound.musicSource.tell == 0){
			Sound.musicSource.play(sounds["introBuzz"]);
		}
	},
	playSoundTransition: function playSoundTransition(){
		Sound.musicSource.clear();
		Sound.ambientSource.clear();
		if (!Sound.transitionSource.playing){
			Sound.transitionSource.play(sounds["noise"]);
		}
	},
	playSoundMenu: function playSoundMenu(){
		Sound.transitionSource.clear();
		Sound.musicSource.looping = true;
		if (soundMenuState != menuState) {
			Sound.play("blip");
			soundMenuState = menuState;
		}
		if (!Sound.musicSource.playing){
			Sound.musicSource.play(music["PressStart"]);
		}
		if (!Sound.ambientSource.playing){
			Sound.ambientSource.play(sounds["introBuzz"]);
		}
	},
	playSoundOutro: function playSoundOutro(){
		Sound.transitionSource.clear();
		Sound.musicSource.looping = true;
		if (soundMenuState != menuState) {
			Sound.play("blip");
			soundMenuState = menuState;
		}
		if (!Sound.musicSource.playing){
			Sound.musicSource.play(music["BuyBeer"]);
		}
		if (!Sound.ambientSource.playing){
			Sound.ambientSource.play(sounds["introBuzz"]);
		}
	},
	playSoundGame: function playSoundGame(){
		Sound.musicSource.looping = false;
		if (Sound.musicSource.tell > music[gameMusic[gameMusicState]].length){
			gameMusicState++;
			if (gameMusicState > gameMusic.length-1) gameMusicState = 0;
			Sound.musicSource.clear();
		}
		if (!Sound.musicSource.playing) {
			Sound.musicSource.play(music[gameMusic[gameMusicState]]);
		}
		if ( (paused) && (!tutorial) && (!fax.visible) ){
			Sound.musicSource.pause();
			for (var i in TheReps){
				TheReps[i].soundSource.pause();
			}
		}
		else if (fax.visible){
			for (var i in TheReps){
				TheReps[i].soundSource.pause();
			}
		}
		else {
			Sound.musicSource.resume();
			for (var i in TheReps){
				TheReps[i].soundSource.resume();
			}
		}
	}
};

