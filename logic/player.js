var voteDate;

var mousePosition = {
	x: null,
	y: null
};
var clickPosition = {
	x: null,
	y: null
}
var mouseFireButtonDown = false;
var shiftDown = false;
var backspaceDown = false;
var lastAction = null;

var givePlayerPet = function givePlayerPet(){
	var billPick = 5;
	ThePlayer.pet = Bills[billPick];
	ThePlayer.petLock = ThePlayer.pet;
	ThePlayer.pet.pets.push(ThePlayer);
	var mySupport = ThePlayer.pet.peopleSupport[ThePlayer.id];
	if (mySupport) mySupport = "Pass";
	else mySupport = "Kill";
	
	voteDate = month+(billPick);
	if (voteDate > 11) voteDate -= 12;
	for (var i in TheReps){
		ThePlayer.pet.announcedRepSupport[i] = undefined;
	}
}

var Fax = function Fax(){
	this.p1 = "";
	this.p2 = "";
	this.goal = false;
	this.timer = 5;
}
Fax.prototype = new GameObj();
Fax.prototype.constructor = Fax;

var untangle = function untangle(array, bill){
	var text = "";
	for(var i in array){
		if (array[i] == "%name%") text += bill.name;
		else if (array[i] == "%prefix%") text += bill.prefix;
		else if (array[i] == "%month%") text += monthFullNames[voteDate];
		else text += array[i];
	}
	return text;
};

var createFax = function createFax(oldPet, newPet, result, success){
	var newFax = new Fax();
	newFax.goal = newPet.peopleSupport[ThePlayer.id];
	
	var faxText = faxSalutation+"\n\n\n";
	if (oldPet) {
		faxText += "\t";
		if (success) {
			faxText += faxP1Win[randomNumber(0,4)];
			if (result) faxText += untangle(faxP1WinPass[randomNumber(0,4)],oldPet);
			else faxText += untangle(faxP1WinKill[randomNumber(0,4)],oldPet);
			faxText += faxP1WinFlourish[randomNumber(0,4)];
			faxText += "\n\n\n\t";
			faxText += faxP2WinSegue[randomNumber(0,4)];
		}
		else {
			faxText += faxP1Lose[randomNumber(0,4)];
			if (result) faxText += untangle(faxP1LosePass[randomNumber(0,4)],oldPet);
			else faxText += untangle(faxP1LoseKill[randomNumber(0,4)],oldPet);
			faxText += faxP1LoseFlourish[randomNumber(0,4)];
			faxText += "\n\n\n\t";
			faxText += faxP2LoseSegue[randomNumber(0,4)];
		}
	}
	else faxText += "\t\t\t";
	
	if (newFax.goal) {
		faxText += untangle(faxP2PassIntro[randomNumber(0,4)],newPet);
		faxText += faxP2PassFlourish[randomNumber(0,4)];
	}
	else {
			faxText += untangle(faxP2KillIntro[randomNumber(0,4)],newPet);
			faxText += faxP2KillFlourish[randomNumber(0,4)];
	}
	faxText += "\n\n\n"
	faxText += untangle(faxP2Instruction,newPet);
	
	newFax.text = faxText;
	newFax.visible = true;
	return newFax;
}

var shiftUp = [];
shiftUp[100] = ")";
shiftUp[101] = "!";
shiftUp[102] = "@";
shiftUp[103] = "#";
shiftUp[104] = "$";
shiftUp[105] = "%";
shiftUp[106] = "^";
shiftUp[107] = "&";
shiftUp[108] = "*";
shiftUp[109] = "(";
shiftUp[500] = "~";
shiftUp[501] = "_";
shiftUp[502] = "+";
shiftUp[503] = "{";
shiftUp[504] = "}";
shiftUp[505] = ":";
shiftUp[506] = "\"";
shiftUp[507] = "<";
shiftUp[508] = ">";

var onKeyDown = function onKeyDownFn(keycode)
{
	if ( (keycode == 300) || (keycode == 301) ){
		shiftDown = true;
	}
	if (gameScene == "game") {
		if (keycode === keyCodes.SPACE)
			togglePause();
	}
	else if (gameScene == "menu") {
		if ( (mousePosition.y > 490) && (showAdvanced) ) {
			if (keycode == keyCodes.BACKSPACE){
				Sound.play("bong");
				if (randomSeed.length > 1)
					randomSeed = randomSeed.substring(0, randomSeed.length - 1);
				else
					randomSeed = undefined;
			} 
			else if ( (keycode <= 109) || ( (keycode <= 500) && (keycode >= 508) ) ){
				Sound.play("bong");
				var key = inputDevice.convertToUnicode([keycode]);
				key = key[keycode];
				if (shiftDown) {
					if (keycode > 26) {
						key = shiftUp[keycode];
					}
				}
				if (randomSeed == undefined) randomSeed = "";
				randomSeed += key;
				
			}
		}
	}
};

var onKeyUp = function onKeyUpFn(keycode){
	if ( (keycode == 300) || (keycode == 301) ){
		shiftDown = false;
	}
}

var onMouseOver = function onMouseOver(x, y){
	mousePosition.x = x;
	mousePosition.y = y;
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
	{
		mousePosition.x -= document.getElementById('turbulenz_game_engine_canvas').offsetLeft;
		mousePosition.y -= document.getElementById('turbulenz_game_engine_canvas').offsetTop;
	}
};

var onMouseDown = function onMouseDownFn(mouseCode, x, y)
{
    clickPosition.x = x;
    clickPosition.y = y;
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
	{
		clickPosition.x -= document.getElementById('turbulenz_game_engine_canvas').offsetLeft;
		clickPosition.y -= document.getElementById('turbulenz_game_engine_canvas').offsetTop;
	}
	
    if (mouseCode === mouseCodes.BUTTON_0)
    {
        mouseFireButtonDown = true;
    }
};

var onMouseUp = function onMouseUp(mouseCode, x, y)
{
    clickPosition.x = x;
    clickPosition.y = y;
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
	{
		clickPosition.x -= document.getElementById('turbulenz_game_engine_canvas').offsetLeft;
		clickPosition.y -= document.getElementById('turbulenz_game_engine_canvas').offsetTop;
	}

    if (mouseCode === mouseCodes.BUTTON_0)
    {
        mouseFireButtonDown = false;
		if (gameScene == "game") clickAction();
		else if (gameScene == "menu") clickMenu();
		else if (gameScene == "outro") clickOutro();
    }
};

Draw2DSprite.prototype.getBounds = function(padding){
	var array = [];
	padding = padding || 0;
	array.push(this.x - (this.getWidth()/2) - padding);
	array.push(this.y - (this.getHeight()/2) - padding);
	array.push(this.x + (this.getWidth()/2) + padding);
	array.push(this.y + (this.getHeight()/2) + padding);
	return array;
}

var isMouseInBox = function isMouseInBox(coords, position){
	position = position || mousePosition;
	if ( 
		(position.x > coords[0]) 
		&& (position.y > coords[1])
		&& (position.x < coords[2])
		&& (position.y < coords[3])
	) return true;
	else return false;
}


var clickMenu = function clickMenu(){
	Sound.play("bong");
	if (clickPosition.y <= 390){
		gameScene = "game";
		startGame();
	}
	else if (clickPosition.y <= 430){
		if (tutorial) tutorial = false;
		else tutorial = true;
	}
	else if (clickPosition.y <= 460){
		if (colorBlind) colorBlind = false;
		else colorBlind = true;
		initTextures();
		Graphics.initGameSprites();
	}
	else if (showAdvanced){
		if (clickPosition.y <= 490){
			if (skipFaxes) skipFaxes = false;
			else skipFaxes = true;
		}
		else if (clickPosition.y > 490){
			if (!randomSeed) randomSeed = "ENTER A RANDOM SEED";
			else randomSeed = undefined;
		}
	}
	else if (clickPosition.y > 460){
		showAdvanced = true;
	}
}

var clickOutro = function clickOutro(){
	if ( (clickPosition.y > 470) && (clickPosition.y <= 498) ) {
		window.open("https://en.wikipedia.org/wiki/Liquid_democracy","_blank");
	}
	else if ( (mousePosition.y > 498) && (mousePosition.y < 650) && (mousePosition.x < 526) ){
		window.open("https://en.wikipedia.org/wiki/Participatory_politics","_blank");
	}
	else if ( (mousePosition.y > 498) && (mousePosition.y < 650) && (mousePosition.x >= 526) && (mousePosition.x < 700)) {
		window.open("https://en.wikipedia.org/wiki/Sociocracy","_blank");
	}
	else if ( (mousePosition.y > 498) && (mousePosition.y < 650) && (mousePosition.x >= 700) ) {
		window.open("https://en.wikipedia.org/wiki/Consensus_decision-making","_blank");
	}
	else if (clickPosition.y >= 650){
		gameScene = "menu";
	}
}

var clickAction = function clickAction(){
	if (isMouseInBox(okFaxBtn.getBounds(),clickPosition)){
		if (fax.visible) Sound.play("click");
		fax.visible = false;
		paused = false;
	}
	if (tutorialPopupCounter == 99) {
		tutorialPopupCounter = -1;
		tutorial = false;
	}
	if (paused) togglePause();
	if (isMouseInBox(pause.getBounds(),clickPosition)){
		togglePause();
		lastAction = null;
	}
	else if ( (tutorial) && (tutorialPopupCounter < 10) ) clickActionTutorial();
	else if(gameState == "election"){
		rep = ThePlayer.district.rep;
		if (isMouseInBox(redBtn.getBounds(),clickPosition)){
			ThePlayer.hasVoted = true;
			if (rep.party) rep.constituentSupport[ThePlayer.id] = false;
			else rep.constituentSupport[ThePlayer.id] = true;
			Sound.play("bong");
			lastAction = null;
		}
		else if (isMouseInBox(bluBtn.getBounds(),clickPosition)){
			ThePlayer.hasVoted = true;
			if (rep.party) rep.constituentSupport[ThePlayer.id] = true;
			else rep.constituentSupport[ThePlayer.id] = false;
			Sound.play("bong");
			lastAction = null;
		}
		
	}
	else if(gameState == "bill") {
		if (isMouseInBox(ThePlayer.district.tv.getBounds(), clickPosition)){
			if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
				lastAction = "rep";
				ThePlayer.callRep(ThePlayer.pet);
				repCalls++;
				Sound.play("blip");
			}
		} 
		else {
			lastAction = null;
			for (var i in TheDistricts){
				me = TheDistricts[i];
				if (isMouseInBox(me.tv.getBounds(), clickPosition)){
					if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
						me.rep.callError();
					}
				}
			}
			for(var i in ThePlayer.friends){
				me = ThePlayer.friends[i];
				if (isMouseInBox(me.sprite.getBounds(3), clickPosition)){
					if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
						ThePlayer.callFriend(me,ThePlayer.pet);
						if (!me.active) ThePlayer.rallyFriend(me);
						friendCalls++;
						Sound.play("bong");
						lastAction = "friend";
					}
				}
			}
		}
	}
}