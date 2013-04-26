// Make voters more or less apathetic, and then possibly make them active or inactive	
Voter.prototype.deapathize = function deapathize(mult) {
	if (!tutorial) {
		mult = mult || 1;
		this.apathy -= randomNumber(1,25*mult);
		if (this.apathy < 0) this.apathy = 0;
		//console.log("Voter "+this.id+" apathy decreased to "+this.apathy);
		if (!this.active) {
			if (randomNumber(0,100) > this.apathy) {
				this.active = true;
				//console.log("Voter "+this.id+" is now active!");
			}
		}
	}
}
Voter.prototype.apathize = function apathize(mult) {
	mult = mult || 1;
	if (this.playerFriend) mult = 1.2;
	this.apathy += randomNumber(1,25*mult);
	if (this.apathy > 100) this.apathy = 100;
	//console.log("Voter "+this.id+" apathy increased to "+this.apathy);
	if (this.active) {
		if (randomNumber(0,100) < this.apathy*mult) {
			this.active = false;
			//console.log("Voter "+this.id+" is now inactive!");
		}
	}
}

var NumberOfFriends = 6;

Voter.prototype.makeFriends = function makeFriends(player){
	targets = [];
	friends = [];
	if (!player){
		for(i = 0; i < NumberOfFriends; i++){
			targets.push(randomNumber(0,ThePeople.length-1));
		}
		for(var i in targets){
			friends.push(ThePeople[ targets[i] ]);
		}
	}
	else {
		for(var i in TheDistricts){
			me = TheDistricts[i];
			if (i != 5) {
				friends.push(me.voters[randomNumber(0,40)]);
				friends.push(me.voters[randomNumber(60,102)]);
			}
			else{
				friends.push(me.voters[randomNumber(0,10)]);
				friends.push(me.voters[randomNumber(50,60)]);
			}
		}
	}
	this.friends = friends;
}

//Make reps more or less partisan
Rep.prototype.whip = function whip(mult){
	if (typeof(mult) === 'undefined') mult = 1;
	this.partyLine += randomNumber(1,12*mult);
	if (this.partyLine > 100) this.partyLine = 100;
	//console.log(this.id+" party line increased to "+this.partyLine);
}

Rep.prototype.dissent = function dissent(){
	if (typeof(mult) === 'undefined') mult = 1;
	this.partyLine -= randomNumber(1,12*mult);
	if (this.partyLine < 0) this.partyLine = 0;
	//console.log(this.id+" party line decreased to "+this.partyLine);
}

function generateRepSupport(party){
	support = [];
	for(var i in TheReps){
		me = TheReps[i]; // The current rep
		myParty = me.party;
		if (randomNumber(0,100) < me.partyLine){
			// Flip party affiliation for this bill
			if (myParty) myParty = 0;
			else myParty = 1;
		}
		if (myParty == party) support[i] = true;
		else support[i] = false;
	}
	return support;
}

function generatePeopleSupport(collectivist, libertarian, radical){
	support = [];
	for(var i in ThePeople){
		me = ThePeople[i]; // The current person
		var diff = [];
		// Compare this bill's philosophies to the voter's
		diff[collectivist] = Math.abs(collectivist - me.collectivist);
		diff[libertarian] = Math.abs(libertarian - me.libertarian);
		diff[radical] = Math.abs(radical - me.radical);
		
		// If a philosophy score disagrees by more than 65, automatic no
		// If it agrees by more than 10, automatic yes
		// Otherwise, randomize it
		if (randomNumber(10,65) >= diff[collectivist]) diff[collectivist] = true;
		else diff[collectivist] = false;
		if (randomNumber(10,65) >= diff[libertarian]) diff[libertarian] = true;
		else diff[libertarian] = false;
		if (randomNumber(10,65) >= diff[radical]) diff[radical] = true;
		else diff[radical] = false;
		
		mySupport = 0;
		// Generate a support score between 1 and 3
		for(var j in diff){
			if (diff[j] === true) mySupport++;
		}
		// The more the voter agrees with the bill's philosophy, the more likely
		// they are to support it. 0/3, 1/3, 2/3, or 3/3 chance of support.
		if (randomNumber(0,2) < mySupport) mySupport = true;
		else mySupport = false;
		support[i] = mySupport;
	}
	return support;
}

Bill.prototype.assignPet = function assignPetIssueToVoters(){
	pets = 30;
	noPets = [];
	targets = [];
	// Find out who doesn't have a pet issue yet
	for(var i in ThePeople) {
		if (ThePeople[i].pet === false) noPets.push(i);
	}
	if (noPets.length) { // If there are people still without pet issues
		for(var i = 0; i < pets; i++) {
			// Randomly pick someone in the noPets array
			targets.push(randomNumber(0,noPets.length-1));
		}
		for(var i in targets) {
			myId = noPets[targets[i]];
			if (myId) {
				//console.log("Assigning Bill "+this.id+" as pet issue to Voter "+myId);
				ThePeople[myId].pet = this;
				ThePeople[myId].deapathize(0.5);
				this.pets.push(ThePeople[myId]);
			}
		}
	}
}