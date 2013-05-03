/*	Voter.callRep
		Attempts to convince this voter's representative to change their position,
		or solidifies their position if they already agree. This also affects the
		representative's adherence to the party line.
*/
Voter.prototype.callRep = function callRep(bill){
	myRep = this.district.rep;
	repSupport = bill.repSupport[myRep.id];
	mySupport = bill.peopleSupport[this.id];
	this.timesCalled++;
	mult = 1/this.timesCalled; // Each successive call gives diminishing returns
	//console.log("Voter "+this.id+" is calling Rep "+myRep.id+" about Bill "+bill.id);
	//console.log("Voter support: "+mySupport);
	//console.log("Rep support: "+repSupport);
	//console.log("Rep party: "+myRep.party);
	//console.log("Bill party: "+bill.party);
	
	if (
		(this.timesCalled < 8)  // Calling more than 8 times does nothing
		&& (bill.name != Bills[0].name) // If the bill is already being voted on, do nothing 
		&& (!tutorial) // During the tutorial, rep support is hard-coded
		){
		
		if (mySupport == repSupport){
			if (mySupport) {
				if (myRep.party == bill.party) myRep.whip(mult);
				else myRep.dissent();
			}
			else {
				if (myRep.party == bill.party) myRep.dissent(mult);
				else myRep.whip();
			}
			//console.log("The Rep's support is already "+mySupport);
		}
		
		else {
			
			if (mySupport){ // Voter supports the bill
				if (myRep.party == bill.party) { //Rep agrees with party
					myRep.whip(mult);
					if (randomNumber(0,145) < myRep.partyLine) {
						bill.repSupport[myRep.id] = mySupport;
						//console.log("The call succeeded and Rep "+myRep.id+" changed their support to "+mySupport+"!");
					}
					else {
						//console.log("Unfortunately the Rep's support is still "+repSupport);
					}
				}
				else{ // Rep disagrees with party
					myRep.dissent(mult);
					if (randomNumber(0,145) > myRep.partyLine) {
						bill.repSupport[myRep.id] = mySupport;
						//console.log("The call succeeded and Rep "+myRep.id+" changed their support to "+mySupport+"!");
					}
					else {
						//console.log("Unfortunately the Rep's support is still "+repSupport);
					}
				}
			}
			
			else{ // Voter doesn't support the bill
				if (myRep.party == bill.party) { // Rep agrees with party
					myRep.dissent(mult);
					if (randomNumber(0,145) > myRep.partyLine) {
						bill.repSupport[myRep.id] = mySupport;
						//console.log("The call succeeded and Rep "+myRep.id+" changed their support to "+mySupport+"!");
					}
					else {
						//console.log("Unfortunately the Rep's support is still "+repSupport);
					}
				}
				else{ // Rep disagrees with party
					myRep.whip(mult);
					if (randomNumber(0,145) < myRep.partyLine) {
						bill.repSupport[myRep.id] = mySupport;
						//console.log("The call succeeded and Rep "+myRep.id+" changed their support to "+mySupport+"!");
					}
					else {
						//console.log("Unfortunately the Rep's support is still "+repSupport);
					}
				}
				
			}
			
		}
		
	}
	
	if (!this.actionBubble) {
		var origin = [this.sprite.x, this.sprite.y];
		var destination = [myRep.sprite.x, myRep.sprite.y];
		this.displayAction(origin,destination);
	}
	
}

/*	Voter.callFriend
		Attempts to convince this voter's friend to change their position,
		or solidifies their position if they already agree. Success makes
		the friend less apathetic. Failure makes the voter apathetic.
*/
Voter.prototype.callFriend = function callFriend(friend, bill){
	mySupport = bill.peopleSupport[this.id];
	friendSupport = bill.peopleSupport[friend.id];
	//console.log("Voter "+this.id+" is calling friend "+friend.id+" about Bill "+bill.id);

	// Every time a person gets talked to, it becomes harder to convince them
	friend.polarized *= 2;
	if (mySupport != friendSupport) {
		var divideBy = 3 * (1+friend.polarized);
		var avg = 0;
		avg += Math.abs(bill.collectivist - friend.collectivist);
		avg += Math.abs(bill.libertarian - friend.libertarian);
		avg += Math.abs(bill.radical - friend.radical);
		avg = avg/divideBy;
		if (mySupport) {
			if (randomNumber(0,125) > avg) {
				bill.peopleSupport[friend.id] = mySupport;
				//console.log("Friend changed their support to "+mySupport+"!");
				friend.deapathize(0.25);
				friend.pet = bill;
				friend.evaluateRep();
			}
			else {
				//console.log("Unfortunately, friend's support is still "+friendSupport);
				this.apathize(0.25);
			}
		}
		else {
			if (randomNumber(0,125) < avg) {
				bill.peopleSupport[friend.id] = mySupport;
				//console.log("Friend changed their support to "+mySupport+"!");
				friend.deapathize(0.25);
				friend.pet = bill;
				friend.evaluateRep();
			}
			else {
				//console.log("Unfortunately, friend's support is still "+friendSupport);
				this.apathize(0.25);
			}
		}
	}
	else {
		//console.log("Friend's support is already "+friendSupport);
		friend.deapathize(0.25);
		friend.pet = bill;
		friend.evaluateRep();
	}
	//console.log("Friend's polarization is now "+friend.polarized);
	
	if (!this.actionBubble) {
		var origin = [this.sprite.x, this.sprite.y];
		var destination = [friend.sprite.x, friend.sprite.y];
		this.displayAction(origin,destination);
	}
	
}

/*	Voter.rallyFriend 
		Makes the voter's friend less apathetic in an attempt to activate
		them. Should only be called if the friend is inactive.
*/
Voter.prototype.rallyFriend = function rallyFriend(friend) {
	//console.log("Voter "+this.id+" is rallying friend "+friend.id);
	if (this != ThePlayer) {
		friend.deapathize(0.75);
	}	
	else {
		console.log("Player");
		console.log(friend.polarized);
		friend.polarized * 8;
		var difficulty = 25 + (100*friend.polarized);
		if (randomNumber(0,50) > difficulty) {
			if (randomNumber(0,25) < friend.apathy) {
				friend.deapathize(0.5);
			}
			else friend.apathize(0.75);
		}
		else friend.apathize(0.75);
	}
	if (!this.actionBubble) {
		var origin = [this.sprite.x, this.sprite.y];
		var destination = [friend.sprite.x, friend.sprite.y];
		this.displayAction(origin,destination);
	}
}

Voter.prototype.evaluateRep = function evaluateRep(){
	if ( (this.pet) && (this.pet.announcedRepSupport[this.district.rep.id] != "?") ){
		if (this.pet.peopleSupport[this.id] == this.pet.announcedRepSupport[this.district.rep.id])
			this.district.rep.constituentSupport[this.id] = true;
		else this.district.rep.constituentSupport[this.id] = false;
	}
	else this.district.rep.constituentSupport[this.id] = randomBool();
}

// ------------------ REP ACTIONS ----------------------


/*	Rep.announcePosition
		Announces the rep's support for bills currently in play.
		If the player just clicked on their rep, this won't announce changes in
		support for the player's pet issue. This is to discourage the player from
		feeling like their actions made a difference.
*/
Rep.prototype.announcePosition = function announcePosition() {
	for(var i in Bills){
		if (Bills[i] != ThePlayer.pet) {
			Bills[i].announcedRepSupport[this.id] = Bills[i].repSupport[this.id];
		}
		else {
			if (lastAction != "rep") { //If the player just called their rep, don't announce a new position
				Bills[i].announcedRepSupport[this.id] = Bills[i].repSupport[this.id];
			}
		}
	}
	for(var i in this.constituents){
		this.constituents[i].evaluateRep();
	}
}

/*	Rep.scareTactic
		Run a scary campaign ad for or against the incumbent rep.
		There's a 50-50 chance that it will be for or against.
*/
Rep.prototype.scareTactic = function scareTactic() {
	if (randomBool()) {
		//console.log("Rep "+this.id+" runs a scary campaign ad!");
		scareConstituents(this.constituents, true);
		this.scareAnimation(this.party);
	}
	else {
		if (this.party == 1) opponent = 0;
		else opponent = 1;
		//console.log("Opponent of Rep "+this.id+" runs a scary campaign ad!");
		scareConstituents(this.constituents, false);
		this.scareAnimation(opponent);
	}
}

/*	scareConstituents
		Frighten constituents with a campaign ad. More apathetic voters are less
		informed and more easily swayed.
*/
function scareConstituents(people, position){
	for(var i in people){
		me = people[i];
		if ( (randomNumber(0,100) < me.apathy) && randomBool() && (me != ThePlayer) ){
			//console.log("Voter "+me.id+" was scared by the ad!");
			me.deapathize();
			me.pet = false;
			if (me.district.rep.constituentSupport[me.id] != position) {
				me.district.rep.constituentSupport[me.id] = position;
				//console.log("Their rep support changed to "+position);
			}
		}
	}
}