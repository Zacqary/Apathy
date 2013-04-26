var tenthTimer = 0;
var voteTimer = -1;
var secondTimer = 0;
var voterPosition = 0;
var roundTimer = 0;
var resultsTimer = 0;
var endRound = false;

function queueAndTakeTurns(){
	if (tutorial) refreshTutorial();
	if ( (fax.visible) && (!tableFlash.animation) ) paused = true;
	if ( (fax.tutorial) && (fax.visible) && (TheDistricts[5].rep.animation) ) paused = false;
	var petStillHere = false;
	for(var i in Bills){
		if (ThePlayer.pet.name == Bills[i].name) petStillHere = true;
	}
	if (!petStillHere) {
		givePlayerPet();
		fax = createFax(false, ThePlayer.pet, false, false);
	}
	
	
	if (month > 12) month = 0;
	if ( (monthsRemaining < 0) && (!tableFlash.animation) ) gameScene = "outro";
	if ( (monthsRemaining > 49) && (!tutorial) ){
		for (var i in TheReps){
			ThePlayer.pet.announcedRepSupport[i] = undefined;
		}
	}
	if (!paused) {
		var timeDelta = currentTime - previousFrameTime;
		tenthTimer += timeDelta;
		voteTimer += timeDelta;
		secondTimer += timeDelta;
		if (month != 12){
			gameState = "bill";
			addChunk = tenthTimer / 0.1;
			//Every 0.1 seconds, add a 12-voter chunk to the Action Queue
			if (addChunk >= 1) {
				for(i = 0; i < tenthTimer; i++){
					voterPosition += 12;
					for(j = voterPosition - 12; j < voterPosition; j++) {
						actionQueue.push(ThePeople[j]);
					}
				}
				tenthTimer = 0;
			}
			
			castVote = voteTimer / 0.6;
			if (castVote >= 1) {
				var cast = false;
				for(var i in TheDistricts){
					me = TheDistricts[i].rep;
					if (!cast){
						if(!Bills[0].castVotes[me.id]) cast = me.id;
					}
				}
				if (cast) {
					Bills[0].castVotes[cast] = true;
					if (Bills[0] == ThePlayer.pet) Sound.play("ding");
					else Sound.play("dingQuiet");
				}
				voteTimer = 0;
			}
			
			if (secondTimer >= 1){
				for(var i in TheDistricts) actionQueue.push(TheDistricts[i].rep);
				secondTimer = 0;
			}
		
			if (voterPosition == 720){
				voterPosition = 12;
				roundTimer++;
				endRound = true;
			}
	
			for(var i in actionQueue) {
				actionQueue[i].takeTurn();
			}
			actionQueue = [];
			if (endRound) {
				endRound = false;
				tenthTimer = 0;
				secondTimer = 0;
				voteTimer = -1;
				endTheRound();
				//console.log("Round "+roundTimer);
			}
		}
		else {
			if (secondTimer <= 0.05){
				for(var i in TheReps){
					if(randomNumber(0,2048) == 5){
						TheReps[i].scareTactic();
					}
				}
			}
			else if (secondTimer < 6){
				gameState = "election";
				Bills[0].castVotes = [];
			}
			else if (secondTimer >= 6){
				if (gameState == "election") {
					runElection();
					Graphics.clearBubbles();
					gameState = "results";
				}
				
				else if (gameState == "results"){
					resultsTimer += currentTime - previousFrameTime;
					if(resultsTimer >= 3){
						roundTimer = 0;
						secondTimer = 0;
						tenthTimer = 0;
						resultsTimer = 0;
						month = 0;
						if (tutorial) {
							tutorialFaxCounter = 2;
							refreshTutorial();
							fax = createTutorialFax(2);
							fax.visible = true;
							monthsRemaining = 45;
							ThePlayer.pet.announcedRepSupport[ThePlayer.district.rep.id] = undefined;
							Bills[0] = ThePlayer.pet;
							Bills.splice(5,1,new Bill());
							ThePlayer.pet.castVotes = [];
						}
						gameState = "bill";
					}
				}
			}
		}
	}
	if (ThePlayer.pet != ThePlayer.petLock) ThePlayer.pet = ThePlayer.petLock;
}

function endTheRound(){
	Bills[0].resolve();
	for(var i in ThePeople) {
		ThePeople[i].polarized = ThePeople[i].polarized / 1.5;
		if (ThePeople[i].polarized < 0.01) ThePeople[i].polarized = 0.01;
		ThePeople[i].timesCalled = Math.floor(ThePeople[i].timesCalled/2);
	}
	if (!tutorial) {
		month++;
		monthsRemaining--;
	}
	//togglePause();
}

Voter.prototype.takeTurn = function voterTakeTurn(){
	if (!this.isPlayer) {
		if(this.active){
			if(this.pet){
				//console.log("---------- Voter Action "+this.id+" ----------");
				if (randomNumber(0,50) < this.apathy/2) {
					this.callFriend(this.friends[randomNumber(0,5)],this.pet);
					//console.log("--");
				}
			
				if (randomNumber(0,50) < this.apathy/2) {
					rallyThisFriend = this.friends[randomNumber(0,5)]; 
					if (!rallyThisFriend.active) this.rallyFriend(rallyThisFriend);
					//console.log("--");
				}
			
				if (randomNumber(0,50) < this.apathy/2) {
					this.callRep(this.pet);
					//console.log("--");
				}
			}
		}
	}
}

Rep.prototype.takeTurn = function repTakeTurn(){
	if (randomNumber(0,2) == 1) {
		if (monthsRemaining < 50) this.announcePosition();
	}
	var scareChance = (1.5*(12-month))*24;
	if (randomNumber(0,scareChance) == 5){
		this.scareTactic();
	}
	
}