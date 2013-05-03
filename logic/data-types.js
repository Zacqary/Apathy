var GameObj = function GameObj() {}

//	District
var District = function District(number){
	TheDistricts[number] = this;
	this.number = number;
	this.voters = [];
	this.rep = new Rep(this);
	this.results = [];
	for(var j = 0; j < PeoplePerRep; j++){
		new Voter(this);
	}
}
District.prototype = new GameObj();
District.prototype.constructor = Rep;

//	Representative
var Rep = function Rep(district) {
	this.id = makeid();
	// Party affiliation is 0 or 1
	this.party = randomBool();
	if (this.party) this.party = 1;
	else this.party = 0;
	this.partyLine = randomNumber(45,100); // Rep agrees with the Party between 45% and 100% of the time
	this.constituents = [];
	this.constituentSupport = [];
	this.district = district;
	TheReps[this.id] = this;
	this.soundSource = soundDevice.createSource(Sound.defaultSource);
	this.sound = null;
};
Rep.prototype = new GameObj();
Rep.prototype.constructor = Rep;

Rep.prototype.rejigger = function rejiggerRep(){
	var oldid = this.id;
	this.id = makeid();
	if (this.party) this.party = 0;
	else this.party = 1;
	this.partyLine = randomNumber(45,100);
	for(var i in this.constituentSupport){
		this.constituentSupport[i].toggle;
	}
	TheReps[this.id] = this;
	delete TheReps[oldid];
}

var NumberOfReps = 7;

//	Voter
var Voter = function Voter(district){
	this.isPlayer = false;
	this.playerFriend = false;
	this.petLock;
	
	this.district = district;
	// Philosophies
	this.collectivist = randomNumber(0,100);
	this.libertarian = randomNumber(0,100);
	this.radical = randomNumber(0,100);
	// Voter's apathy
	this.apathy = randomNumber(0,100);
	this.active = true;
	if (this.apathy > 50) {
		// Everyone above 75% apathy is inactive. Anyone below, their apathy score is how likely
		// they are to be inactive.
		if (randomNumber(0,75) < this.apathy) this.active = false;
	}
	this.pet = false;
	this.polarized = 0.01;
	this.timesCalled = 0;
	ThePeople.push(this);
	this.id = ThePeople.length-1;
	this.district.voters.push(this);
	this.district.rep.constituents[this.id] = this;
	this.district.rep.constituentSupport[this.id] = randomBool();
}
Voter.prototype = new GameObj();
Voter.prototype.constructor = Rep;

var PeoplePerRep = 103;

//	Bills
var Bill = function Bill() {
	this.id = makeid();
	this.prefix = billPrefix+" "+randomNumber(100,999)+": ";
	this.name = pickBillName();
	this.party = randomNumber(0,1);
	// Philosophies
	this.collectivist = randomNumber(0,100);
	this.libertarian = randomNumber(0,100);
	this.radical = randomNumber(0,100);
	// Support
	this.repSupport = generateRepSupport(this.party);
	this.announcedRepSupport = [];
	this.castVotes = [];
	for(var i in TheReps) this.announcedRepSupport[TheReps[i].id] = false;
	this.peopleSupport = generatePeopleSupport(this.collectivist,this.libertarian,this.radical);
	
	//console.log("Creating Bill "+this.id+": \""+this.name+"\", sponsored by party "+this.party+".")
	//console.log(this);
	
	this.pets = [];
	this.assignPet();
}

var namesUsed = [];

/* pickBillName
		Pick a name for a bill at random. Make sure it hasn't been used before.
*/
var pickBillName = function pickBillName(){
	var unique = false;
	var name;
	while(!unique){
		name = billNames[randomNumber(0,billNames.length-1)];
		unique = true;
		for(var i in Bills){
			if (name == Bills[i].name) unique = false;
		}
		for(var i in namesUsed){
			if (name == namesUsed[i]) unique = false;
		}
	}
	namesUsed.push(name);
	if (namesUsed.length == billNames.length) namesUsed = [];
	return name;
}