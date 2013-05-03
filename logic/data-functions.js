/*	Voter.deapathize and Voter.apathize
		Makes the voter up to 25% more or less apathetic, with a chance to turn
		them active or inactive.
*/	
Voter.prototype.deapathize = function deapathize(mult) {
	if (!tutorial) { // During the tutorial, most game mechanics are temporarily suspended
		mult = mult || 1;
		this.apathy -= randomNumber(1,25*mult);
		if (this.apathy < 0) this.apathy = 0;
		
		if (!this.active) {
			// If the voter is inactive, try and make them active.
			// The higher their apathy, the harder it is.
			if (randomNumber(0,100) > this.apathy) {
				this.active = true;
			}
		}
	}
}

Voter.prototype.apathize = function apathize(mult) {
	mult = mult || 1;
	if (this.playerFriend) mult = 1.2;
	this.apathy += randomNumber(1,25*mult);
	if (this.apathy > 100) this.apathy = 100;

	if (this.active) {
		if (randomNumber(0,100) < this.apathy*mult) {
			this.active = false;
		}
	}
}

/*	Voter.makeFriends
		Randomly selects 6 friends for an NPC, or 2 friends from each district
		for the player
*/
var NumberOfFriends = 6;
Voter.prototype.makeFriends = function makeFriends(player){
	targets = [];
	friends = [];
	if (!player){ //For NPC
		for(i = 0; i < NumberOfFriends; i++){
			targets.push(randomNumber(0,ThePeople.length-1));
		}
		for(var i in targets){
			friends.push(ThePeople[ targets[i] ]);
		}
	}
	else { //For the player
		for(var i in TheDistricts){
			me = TheDistricts[i];
			if (i != 5) {
				friends.push(me.voters[randomNumber(0,40)]);
				friends.push(me.voters[randomNumber(60,102)]);
			}
			else{ //To reduce visual clutter in District 5
				friends.push(me.voters[randomNumber(0,10)]);
				friends.push(me.voters[randomNumber(50,60)]);
			}
		}
	}
	this.friends = friends;
}

/*	Rep.whip and Rep.dissent
		Make the rep more or less partisan
*/		
Rep.prototype.whip = function whip(mult){
	mult = mult || 1;
	this.partyLine += randomNumber(1,12*mult);
	if (this.partyLine > 100) this.partyLine = 100;
}

Rep.prototype.dissent = function dissent(mult){
	mult = mult || 1;
	this.partyLine -= randomNumber(1,12*mult);
	if (this.partyLine < 0) this.partyLine = 0;
}

/* 	generateRepSupport
		Figures out whether a rep supports a particular party position.
		This gets called in relation to a bill, passing its .party value.
*/
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

/* 	generatePeopleSupport
		Figures out whether a voter supports a particular bill.
		This gets called in relation to a bill, passing its three
		philosophy values.
*/
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

/*	Bill.assignPet
		Selects 30 random voters and makes this bill their pet issue.
*/
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