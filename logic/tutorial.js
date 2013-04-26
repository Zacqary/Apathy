var createTutorialFax = function createTutorialFax(number){
	var newFax = tutorialFaxes[number];
	newFax.goal = "tutorial";
	var faxText = faxSalutation+"\n\n\n";
	faxText += newFax.text;
	
	newFax.text = faxText;
	newFax.visible = true;
	newFax.tutorial = true;
	return newFax;
}

var tutorialFaxes = [];
var tutorialPopups = [];
var tutorialPopupCounter = -1;
var tutorialFaxCounter = 0;
var againstFriend;
var apatheticFriend;


function initTutorial(){
	
	tutorialFaxes[0] = new Fax();
	tutorialFaxes[0].text = "Thank you for joining the TakeActionNOW! Concerned Citizens' action network!"
		+" With TakeActionNOW! you'll learn how YOUR voice CAN be heard in democracy!\n\n\n"
	
		+"There's no time to lose! There's a bill on the House floor called the Whistleblower Security"
		+" Act, and it's dangerous! Lobbyists with special interest money wrote this bill to take away"
		+" YOUR rights, and gave it a harmless-sounding name! America is counting on YOU to kill this bill!\n\n\n"
	
		+"We need YOU to CALL YOUR REPRESENTATIVE, and tell your friends to SIGN OUR PETITION! Click OK and we'll show you how!";
	fax = createTutorialFax(0);
	
	
	tutorialPopups[0] = {
		text: "This is you. You live in the bottom-middle GREEN district.\n\n\n"
		+"Your goal is to PASS or KILL bills that are coming up for a vote. The game ends after 10 bills.\n\n\n"
		+"Click anywhere to continue.",
		arrows: "me",
		highlight: "me",
		position: 1
	};
	tutorialPopups[1] = {
		text: "This is your goal. Right now it's to KILL a bill. You need to convince at least four reps to vote AGAINST your bill.\n\n"
		+ "Move your mouse over the sign to see more information about your bill.",
		arrows: "goal sign",
		highlight: "goal sign",
		position: 0
	};
	tutorialPopups[2] = {
		text: "The bill is projected to PASS. This is bad.\n\nWhether your goal is to KILL or PASS a bill, if the sign is RED,"
		+" that means you've got work to do.\n\nClick anywhere to continue.",
		highlight: "goal sign",
		position: 1
	};
	tutorialPopups[3] = {
		text: "Look at the bottom-middle GREEN TV. This is your REP. The RED CHECKMARK icon on the right means they are going to vote"
		+" FOR the bill. Click on your REP to give them a call.",
		arrows: "my rep",
		highlight: "my rep",
		position: 1
	};
	tutorialPopups[4] = {
		text: "Great, but your REP hasn't changed their opinion yet. Click again to give another call.",
		arrows:  "my rep",
		highlight: "my rep",
		position: 1
	};
	tutorialPopups[5] = {
		text: "Sometimes your REP has to think for a while before announcing a new position.\n\nFor now, let's focus"
		+ " on the other REPS. They don't represent you, so you can't call them. But your FRIENDS can.\n\n"
		+ " Click anywhere to continue.",
		highlight: "all reps",
		position: 1
	};
	tutorialPopups[6] = {
		text: "These are your FRIENDS. Their color indicates whether they support the RED or the BLU party.\n\n"
		+ "Mouse over your friends to see how they feel about your bill. Click anywhere to continue.",
		arrows: "friends",
		highlight: "friends",
		position: 0
	};
	tutorialPopups[7] = {
		text: "Look at this FRIEND. This FRIEND supports the bill. Are they insane?\n\nClick on your FRIEND a few times to talk some sense into them.",
		arrows:  "against friend",
		highlight: "against friend",
		position: 0
	};
	tutorialPopups[8] = {
		text: "Good job! Your FRIEND will now start telling their REP to vote against the bill.\n\n"
		+ "Take a look at another FRIEND. They agree that this bill is dangerous. But notice how they appear invisible."
		+ " Your FRIEND is apathetic!\n\nClick on your FRIEND to rile them up and get them involved!",
		arrows: "apathetic friend",
		highlight: "apathetic friend",
		position: 0
	};
	tutorialPopups[9] = {
		text: "Great! Keep clicking on FRIENDS who agree with you to remind them to call their REPS.\n\n"
		+" And be sure to keep talking to your FRIENDS who disagree, but be careful not to make them too angry with you."
		+" If you talk to a FRIEND too much without winning them over, they'll become less likely to listen to you.\n\n"
		+" Click anywhere to continue.",
		arrows: "friends",
		highlight: "friends",
		position: 0
	};
	tutorialPopups[99] = {
		text: "You should have a feel for how to play, now.\n\nKeep an eye on the 'Months Left' number at the bottom-right"
		+" corner of the screen, and see how high you can score before the game ends. Good luck!",
		position: 1
	}
	
	tutorialFaxes[1] = new Fax();
	tutorialFaxes[1].text = "Your REPRESENTATIVE hasn't listened to YOUR voice! It's time to vote them out of office!\n\n\n"
	
	+"Elections come every November. This November, we at TakeActionNOW! URGE you to vote for the BLU party! RED"
	+" refuses to listen to the OVERWHELMING MAJORITY of Americans who are AGAINST the Whistleblower Security Act."
	+" This November, click VOTE BLU!";
	tutorialFaxes[2] = new Fax();
	tutorialFaxes[2].text = "VICTORY! YOUR vote elected a BLU representative in your district! The Whistleblower Security Act"
	+" is now projected to FAIL!\n\n\n"
	
	+"We hope you'll be eagerly watching as the votes come in! In the meantime, don't forget to keep calling your"
	+" rep, keep talking to your friends, and keep making YOUR voice heard! THIS is democracy in action!";
	
	ThePlayer.pet.name = "Whistleblower Security Act";
	ThePlayer.pet.peopleSupport[ThePlayer.id] = false;
	ThePlayer.district.rep.party = 0;
	for (var i in TheReps) { 
		ThePlayer.pet.repSupport[TheReps[i].id] = true;
		ThePlayer.pet.announcedRepSupport[TheReps[i].id] = true;
	}
	var counter = 0;
	againstFriend = ThePlayer.friends[2];
	apatheticFriend = ThePlayer.friends[6];
}

var refreshTutorial = function refreshTutorial(){
	if (!fax.visible){
		if (tutorialPopupCounter == -1) tutorialPopupCounter = 0;
	}

	if ( (tutorialFaxCounter == 2) && (ThePlayer.pet.name != "Whistleblower Security Act")) tutorialPopupCounter = 99;
	if (tutorialPopupCounter == 99) paused = true;
	if ( (tutorialPopupCounter == 1) && (isMouseInBox(goalSign.getBounds())) ) {
		tutorialPopupCounter = 2;
	}
	if (tutorialPopupCounter == 2) month = 8;
	if (tutorialPopupCounter == 4) month = 9;
	if (tutorialPopupCounter == 6) month = 10;
	if (tutorialPopupCounter == 8) month = 11;
				
	if ( (tutorialPopupCounter == 10) && (tutorialFaxCounter == 0)){
		fax = createTutorialFax(1);
		tutorialFaxCounter++;
		month = 12;
		endRound = false;
		tenthTimer = 0;
		secondTimer = 0;
		voteTimer = -1;
		voterPosition = 0;
		endTheRound();
	}
	
	for (var i in TheReps) ThePlayer.pet.repSupport[TheReps[i].id] = true;
	if (tutorialPopupCounter < 8) {
		ThePlayer.pet.peopleSupport[againstFriend.id] = true;
		againstFriend.apathy = 0;
		againstFriend.active = true;
	}
	else {
		ThePlayer.pet.peopleSupport[againstFriend.id] = false;
		ThePlayer.pet.repSupport[TheDistricts[1].rep.id] = false;
		ThePlayer.pet.repSupport[TheDistricts[4].rep.id] = false;
		ThePlayer.pet.announcedRepSupport[TheDistricts[1].rep.id] = false;
		ThePlayer.pet.announcedRepSupport[TheDistricts[4].rep.id] = false;
	}
	
	ThePlayer.pet.peopleSupport[apatheticFriend.id] = false;
	if (tutorialPopupCounter < 9){
		apatheticFriend.apathy = 100;
		apatheticFriend.active = false;
	}
	else {
		apatheticFriend.apathy = 0;
		apatheticFriend.active = true;
		ThePlayer.pet.repSupport[TheDistricts[3].rep.id] = false;
		ThePlayer.pet.announcedRepSupport[TheDistricts[3].rep.id] = false;
	}
	if (tutorialFaxCounter == 2) {
		ThePlayer.pet.repSupport[TheDistricts[0].rep.id] = false;
		ThePlayer.pet.announcedRepSupport[TheDistricts[0].rep.id] = false;
	}
}

var Arrow = function (target){
	this.sprite = Draw2DSprite.create(Sprites.tutorialArrow);
	this.sprite.x = target.x - (target.getWidth() / 2) - 32;
	this.sprite.y = target.y;
};

var drawTutorialPopup = function(number){
	if ( ( (number > -1) && (number < 10) ) || (number == 99) ){
		var popup = tutorialPopups[number];
		var lines = wordwrap(popup.text,48).match(/\n/g);  
		lines = lines.length;
		var boxHeight = 32 + 24*lines;
		
		draw2D.begin("alpha", "texture");
		
		if (!paused) Graphics.drawPauseBkg();
		popup.outerSprite = Draw2DSprite.create({
			texture: null,
			width: 960,
			height: boxHeight + 5,
			x: 640,
			y: 180,
			color: [0,0,0,1],
		});
		popup.innerSprite = Draw2DSprite.create({
			texture: null,
			width: 955,
			height: boxHeight,
			x: 640,
			y: 180,
			color: [1,1,1,1],
		});
		if (popup.position) {
			popup.outerSprite.y = 500;
			popup.innerSprite.y = 500;
		}
		
		draw2D.drawSprite(ThePlayer.sprite);
		if(popup.highlight == "goal sign"){
			Graphics.drawGoalSign();
			if (isMouseInBox(goalSign.getBounds())) {
				Graphics.drawGoalPopup();
				draw2D.begin("alpha", "texture");
			}
		}
		else if(popup.highlight == "my rep"){
			TheDistricts[5].rep.draw();
			TheDistricts[5].drawTV();
		}
		else if(popup.highlight == "all reps"){
			Graphics.drawTVs();
		}
		else if(popup.highlight == "friends"){
			for(var i in ThePlayer.friends)
				draw2D.drawSprite(ThePlayer.friends[i].sprite);
			for(var i in supportSprites){
				draw2D.drawSprite(supportSprites[i]);
			}
		}
		else if(popup.highlight == "against friend"){
			draw2D.drawSprite(againstFriend.sprite);
			for(var i in supportSprites){
				if (supportSprites[i].id == againstFriend.id)
					draw2D.drawSprite(supportSprites[i]);
			}
		}
		else if(popup.highlight == "apathetic friend"){
			var color = apatheticFriend.sprite.getColor();
			apatheticFriend.sprite.setColor([1,1,1,1]);
			draw2D.drawSprite(apatheticFriend.sprite);
			apatheticFriend.sprite.setColor(color);
			draw2D.drawSprite(apatheticFriend.sprite);
			for(var i in supportSprites){
				if (supportSprites[i].id == apatheticFriend.id)
					draw2D.drawSprite(supportSprites[i]);
			}
		}
		
		var arrows = [];
		if(popup.arrows == "me"){
			var arrow = new Arrow(ThePlayer.sprite);
			arrows.push(arrow.sprite);
		}
		
		if(popup.arrows == "goal sign"){
			var arrow = new Arrow(goalSign);
			arrows.push(arrow.sprite);
		}
		
		if(popup.arrows == "my rep"){
			var arrow = new Arrow(TheDistricts[5].tv);
			arrows.push(arrow.sprite);
			arrow = new Arrow(TheDistricts[5].tvSupport);
			arrow.sprite.setScale([0.5,0.5]);
			arrows.push(arrow.sprite);
		}
		if(popup.arrows == "friends"){
			for(var i in ThePlayer.friends) {
				var arrow = new Arrow(ThePlayer.friends[i].sprite);
				arrow.sprite.setScale([0.7,0.7]);
				arrows.push(arrow.sprite);
			}
		}
		if(popup.arrows == "against friend"){
			var arrow = new Arrow(againstFriend.sprite);
			arrows.push(arrow.sprite);
		}
		if(popup.arrows == "apathetic friend"){
			var arrow = new Arrow(apatheticFriend.sprite);
			arrows.push(arrow.sprite);
		}
		
		
		
		for(var i in arrows){
			if (Math.floor(TurbulenzEngine.time) % 2){
				arrows[i].x -= 16;
				arrows[i].setWidth(58);
			}
				
			draw2D.drawSprite(arrows[i]);
		}
		
		
		draw2D.drawSprite(popup.outerSprite);
		draw2D.drawSprite(popup.innerSprite);
		
		draw2D.end();
		
		Graphics.writeFont(wordwrap(popup.text,48),0.3,640,popup.innerSprite.y - (8+(10*lines)), 1, [0,0,0,1]);
		
		if (ThePlayer.actionBubble) {
			draw2D.begin("alpha","texture");
			draw2D.drawSprite(ThePlayer.actionBubble.sprite);
			draw2D.end();
		}
	}
}

var tutorialClickCounter = 0;
var clickActionTutorial = function clickActionTutorial(){
	switch (tutorialPopupCounter){
		case 0:
		case 2:
		case 5:
		case 6:
		case 9:
			tutorialPopupCounter++;
			Sound.play("click");
			break;
		case 3:
			if (isMouseInBox(ThePlayer.district.tv.getBounds())){
				if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
					tutorialPopupCounter++;
					ThePlayer.callRep(ThePlayer.pet);
					Sound.play("blip");
				}
			}
			else {
				for (var i in TheDistricts){
					me = TheDistricts[i];
					if (isMouseInBox(me.tv.getBounds(), clickPosition)){
						if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
							me.rep.callError();
						}
					}
				}
			}
			break;
		case 4:
			if (isMouseInBox(ThePlayer.district.tv.getBounds())){
				if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
					tutorialClickCounter++;
					ThePlayer.callRep(ThePlayer.pet);
					Sound.play("blip");
				}
			}
			else {
				for (var i in TheDistricts){
					me = TheDistricts[i];
					if (isMouseInBox(me.tv.getBounds(), clickPosition)){
						if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
							me.rep.callError();
						}
					}
				}
			}
			if (tutorialClickCounter > 2) {
				tutorialClickCounter = 0;
				tutorialPopupCounter++;
				Sound.play("click");
				month++;
			}
			break;
		case 7:
			if (isMouseInBox(againstFriend.sprite.getBounds(3), clickPosition)){
				if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
					tutorialClickCounter++;
					ThePlayer.callFriend(againstFriend,ThePlayer.pet);
					Sound.play("bong");
				}
			}
			if (tutorialClickCounter > 2) {
				tutorialClickCounter = 0;
				tutorialPopupCounter++;
				Sound.play("click");
			}
			break;
		case 8:
			if (isMouseInBox(apatheticFriend.sprite.getBounds(3), clickPosition)){
				if ( (!ThePlayer.actionBubble) && (Bills[0] != ThePlayer.pet) ) {
					tutorialClickCounter++;
					ThePlayer.rallyFriend(apatheticFriend);
					Sound.play("bong");
				}
			}
			if (tutorialClickCounter > 2) {
				tutorialClickCounter = 0;
				tutorialPopupCounter++;
				Sound.play("click");
			}
			break;
		case 99:
			Sound.play("click");
			tutorial = false;
			break;
		default:
			break;
	}
}
