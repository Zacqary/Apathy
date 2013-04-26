var electionResults = [];
Bill.prototype.countVotes = function countBillVotes(){
	var aye = 0;
	var nay = 0;
	var passed = false;
	for(var i in this.castVotes){
		if (this.castVotes[i]) {
			me = i;
			if (this.repSupport[me]) aye++;
			else nay++;
		}
	}
	if (aye > nay) passed = true;
	var args = [];
	args["aye"] = aye;
	args["nay"] = nay;
	args["passed"] = passed;
	return args;
}

Bill.prototype.resolve = function resolveBill(){
	
	result = this.countVotes();
	// if (result["passed"]){
	// 		console.log(this.name+" passed!");
	// 	}
	// 	else console.log(this.name+" failed!");
	// 	console.log("Aye: "+result["aye"]+", Nay: "+result["nay"]);
	
	for(var i in this.pets){
		me = this.pets[i];
		if(result["passed"] == this.peopleSupport[me.id]) 
			me.deapathize();
		else me.apathize();
		if(this.peopleSupport[me.id] == this.repSupport[me.district.rep.id])
			me.district.rep.constituentSupport[me.id] = true;
		else me.district.rep.constituentSupport[me.id] = false;
	}
	
	var success = false;
	var wasPlayer = false;
	if ( (this.id == ThePlayer.pet.id) && (result["passed"] == this.peopleSupport[ThePlayer.id]) ) {
		score++;
		success = true;
	}
	if(this.id == ThePlayer.pet.id) {
		var oldPet = ThePlayer.pet;
		givePlayerPet();
		fax = createFax(oldPet, ThePlayer.pet, result["passed"], success);
		wasPlayer = true;
	}
	
	for(var i in ThePeople){
		me = ThePeople[i];
		if (me.pet == this) me.pet = false;
	}

	
	tableFlash.flash(result["passed"],wasPlayer);
	Bills.shift();
	if (!tutorial) Bills.push(new Bill());
	else Bills.splice(4,0,new Bill());
}

function coinToss(){
	toss = randomBool();
	console.log("Coin toss: "+toss);
	return toss;
}

Rep.prototype.runElection = function repRunElection(){
	var stay = 0;
	var go = 0;
	var win = false;
	for(var i in this.constituentSupport){
		if (this.constituents[i] != ThePlayer) {
			if(randomNumber(10,75) >= this.constituents[i].apathy){
				if (this.constituentSupport[i]) stay++;
				else go++;
			}
		}
	}
	if ( (ThePlayer.hasVoted) && (this == ThePlayer.district.rep) ){
		if (this.constituentSupport[ThePlayer.id]) stay++;
		else go++;
		timesVoted++;
	}
	
	if (tutorial){
		if(this.district.number != 5){
			stay = randomNumber(38,48);
			go = randomNumber(28,37);
		}
		else {
			go = randomNumber(38,48);
			stay = randomNumber(28,37);
		}
	}
	
	if (stay > go) win = true;
	this.district.results["turnout"] = Math.floor( (stay + go * 100) / PeoplePerRep);
	this.district.results["win"] = win;
	
	if (this.party) {
		this.district.results["Red"] = go;
		this.district.results["Blu"] = stay;
	}
	else {
		this.district.results["Red"] = stay;
		this.district.results["Blu"] = go;
	}
	
	//console.log("Rep "+this.id+" received "+stay+" votes for, "+go+" votes against");
	//console.log("Voter turnout was "+turnout+"%");
	if (!win) {
		//console.log("Rep "+this.id+" voted out!");
		this.rejigger();
		//console.log("Replaced by Rep "+this.id);
		electionResults[this.district.number] = "Lose";
	}
	else {
		electionResults[this.district.number] = "Win";
	}//console.log("Rep "+this.id+" reelected!");
	//console.log("--");
	
}

function runElection(){
	for(var i in ThePeople){
		ThePeople[i].evaluateRep();
	}
	for(var i in TheReps){
		//console.log(TheReps[i]);
		TheReps[i].runElection();
	}
	ThePlayer.hasVoted = false;
	//console.log(TheReps);
}