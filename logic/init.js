// Declare API Devices
var inputDevice;
var mathDevice;
var graphicsDevice;
var soundDevice;
var keyCodes;
var mouseCodes;

// Declare game globals
var TheReps;
var ThePeople;
var TheDistricts;
var Bills;
var month;
var score;
var timesVoted;
var repCalls;
var friendCalls;
var monthsRemaining;
var gameState;
var ThePlayer;

// Default game settings
var gameScene = "intro";
var gameStarted = false;
var paused = false;
var colorBlind = false;
var skipFaxes = false;
var tutorial = true;
var randomSeed = undefined;
var screensaver = false;
var showAdvanced = false;


function startGame(){
	// If there's a custom random seed, use it
	if ( (randomSeed != undefined) && (randomSeed != "") ) {
		Math.seedrandom(randomSeed);
		tutorial = false;
	}
	else Math.seedrandom();
	
	gameStarted = true;
	TheReps = [];
	ThePeople = [];
	TheDistricts = [];
	Bills = [];
	month = 7;
	monthsRemaining = 50;
	score = 0;
	timesVoted = 0;
	repCalls = 0;
	friendCalls = 0;
	gameState = "bill";
	gameMusicState = 0;
	lastAction = null;
	
	for(var i = 0; i < NumberOfReps; i++){
		new District(i);
	}

	for(var i in ThePeople) ThePeople[i].makeFriends();

	// Initialize the player
	ThePeople[616].isPlayer = true;
	ThePeople[616].makeFriends(true);
	for(var i in ThePeople[616].friends){
		ThePeople[616].friends[i].playerFriend = true;
		var polarize = randomNumber(0,32);
		ThePeople[616].friends[i].polarized = polarize;
	}
	ThePlayer = ThePeople[616];

	for (i=0;i<12;i++) Bills[i] = new Bill();
	givePlayerPet(true);
	if (tutorial) initTutorial();	
	else fax = createFax(false, ThePlayer.pet, false, false);
}