var months = ["NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV"];
var monthFullNames = [
	"November",
	"December", 
	"January",
	"February",
	"March", 
	"April", 
	"May", 
	"June", 
	"July", 
	"August", 
	"September", 
	"October", 
	"November"];

var date = new Date();

var billNames = [

	"Uphold American Values Act",
	"Job Creation Act",
	"Defense of Freedom Appropriations Bill",
	"Affordable Education Act",
	"Abbreviating Congressional Regulations with Ostentatious and Needlessly labYrinthine Methods (ACRONYM) Act",
	"Future Prosperity Act",
	"Stop Online Privacy Act",
	"Cybersecurity Provisions Bill for "+date.getFullYear(),
	"Avoid Government Shutdown Act",
	"Make America Safer Act",
	"Improving Federal Student Aid Act",
	"Armed Forces Appropriations Bill for "+date.getFullYear(),
	"Wildlife and Preserve Preservation Act",
	"No Student Left Behind Act",
	"Transparency Reform Act of "+date.getFullYear(),
	"Agriculture Appropriations Bill for "+date.getFullYear(),
	"Marine Wildlife Protection Act",
	"Coastal Defense Maximization Act",
	"Keep Jobs In America Act",
	"Strengthen America Act",
	"Giving Our Veterans a Better Future Act",
	"Keep America Strong Act",
	"Ensure Prosperity Act",
	"Prosperity Promotion Act of "+date.getFullYear(),
	"Hope For America Act",
	"Improving Our Children's Future Act",
	"Save Social Security Act",
	"Keep the Deficit Under Control Act",
	"Federal Employee Salary Act",
	"Better Future For America Act",
	date.getFullYear()+" Fiscal Appropriations Bill",
	"Totally Not At All Corporate-Sponsored Act",
	"Patriotic Act",
	"Financial Transaction Reform Act",
	"Taxation Reform Act",
	"Reforming the Reform of Reformation Reform Act",
	"Endangered Species Reform Act",
	"Energy and Environmental Prosperity Act",
	"Appropriations Bill-Writing Appropriations Bill for "+date.getFullYear(),
	"Department of Agriculture Reform Act",
	"Modernizing Law Enforcement Act",
	"Think of the Children Act",
	"Justice for America Act",
	"Foreign Border Enforcement Reform Act",
	"Safer America Act",
	"Promoting American Innovation Act",
	"Keeping America Globally Competitive Act",
	"Patent Reform Act of "+date.getFullYear(),
	"Enabling the Spread of Knowledge Act",
	"Infrastructure Provisions Bill for "+date.getFullYear(),
	"Corporate Tax Restructuring Act",
	"Future Technology Promotion Act",
	"Trans-Atlantic Trade Partnership Treaty",
	"Solving Our Fiscal Crisis Act",
	"Improving Our Transparency Act",
	"Preventing Employee Discrimination Act",
	"Enforcing American Laws Act",
	"Federal Communications Security Act",
	"Defending Domestic Security Act",
	"Homeland Protection Act of "+date.getFullYear(),
	"Partnership Improvement Act",
	"Jump-Start America's Small Businesses Act",
	"Trans-National Peace and Prosperity Treaty",
	"Climate Investigation Act of "+date.getFullYear(),
	"Free Expression Zoning and Promotion Act",
	"Whistleblower Security Act",
	"Modern Media Reform Initiative",
	"Fostering Competition in American Industries Act",
	"Jobs For America Act",
	"Change Reform Act of "+date.getFullYear(),
	"Monetary Policy Reform Initiative",
	"Healthcare For America Act",
	"Bi-Partisan Political Discourse Promotion Act",
	"Protecting American Freedom Act",
	"American Freedom Protection Act",
	"Freedom Protection Appropriations Bill for "+date.getFullYear(),
	"Aerospace Defense Appropriations Bill for "+date.getFullYear(),
	"Promotion of Global Democracy Act",
	"Highway Infrastructure Promotions Act",
	"Acknowleding Our Rail Infrastructure Act",
	"Experimental Research Funding Act",
	"New Media Free Speech Status Act",
	"Promoting Civil Engagement Act",
	"Industrial Subsidy Appropriations Bill for "+date.getFullYear(),
	"Democratic Defense of Systems Act",
	"Pharmaceutical Oversight, Regulation and Manufacture Equalization Act",
    "Internet Defense of Children Act",
    "Justifying Congressional Existence Act",
    "Internet Security Monitoring, Evaluation, and Testing Act (ISMETA)",
    "Anti-Anti-Filibuster Act",
    "Refurbished Deal Act",
    "Reforming Tax Reform Act",
	"Continuity of Authority Act",
	
];
var billPrefix = "HR";


var faxSalutation = "Dear TakeActionNOW! member,"

var faxP1Win = [
	["VICTORY! "],
	["WE DID IT! "],
	["HOORAY! "],
	["FANTASTIC! "],
	["GREAT NEWS! "]
];

var faxP1WinKill = [
	["The ","%name%"," failed to pass the House! "],
	["The dangerous ","%name%"," never made it past Congress! "],
	["We'll never have to worry about the ","%name%"," again! "],
	["We stopped the ","%name%"," dead in its tracks! "],
	["The ","%name%", " is dead! "],
];

var faxP1WinPass = [
	["The ","%name%"," passed the House! "],
	["The historic ","%name%"," made it past Congress! "],
	["We can look forward to a bright ","%name%"," future! "],
	["We pushed the ","%name%"," right on through! "],
	["The ","%name%", " is law! "],
];

var faxP1WinFlourish = [
	"This is an historic day for America, and people like YOU made it happen! ",
	"We've never been prouder of all the dedicated voters like YOU in our network! ",
	"Today we've shown the power of democracy, and how one person CAN make a difference! ",
	"It was YOUR voice that made this happen! ",
	"YOU, single-handedly, have moved this country forward! ",
];

var faxP1Lose = [
	["Bad news. "],
	["What a shame. "],
	["A sad day. "],
	["Unfortunate. "],
	["Oh well. "]
];

var faxP1LoseKill = [
	["The ","%name%"," failed to pass the House. "],
	["The ","%name%"," didn't make it through Congress. "],
	["Try as we might the, ","%name%"," didn't make it. "],
	["The lobbyists stopped the ","%name%"," from going through. "],
	["The ","%name%", " is dead. "],
];

var faxP1LosePass = [
	["The ","%name%"," passed the House. "],
	["The dangerous ","%name%"," made it past Congress. "],
	["Try as we might, the ","%name%"," is here to stay. "],
	["The lobbyists pushed the ","%name%"," through. "],
	["The ","%name%", " is law. "],
];

var faxP1LoseFlourish = [
	"This is a sad day for America, and a win for special interests. ",
	"Once again, the special interests subverted the will of the people. ",
	"Today the special interests have shown how powerful they really are. ",
	"It was special interest money that silenced YOUR voice. ",
	"This country won't move forward today, thanks to moneyed special interests ",
];

var faxP2WinSegue = [
	"But there's still more work to be done! ",
	"But there's no time to lose! ",
	"But we can't rest easy just yet! ",
	"But we still need your help! ",
	"But it's not over yet! "
];

var faxP2LoseSegue = [
	"But don't give up hope! ",
	"But don't give up just yet! ",
	"But we don't have time to despair! ",
	"But we still need your help! ",
	"But it's not over yet! "
];

var faxP2KillIntro = [
	["The House just introuced ","%prefix%","%name%",", and it's dangerous! "],
	["Lobbyists just pushed ","%prefix%","%name%"," onto the House floor! "],
	["The lobbyist darling ","%prefix%","%name%"," is being debated right now! "],
	["Special interests are trying to ram ","%prefix%","%name%"," through Congress! "],
	["The reckless and irresponsible ","%prefix%","%name%"," is threatening your freedom! "],
];

var faxP2PassIntro = [
	["The House just introuced ","%prefix%","%name%",", and it needs your help! "],
	["Lobbyists want to pull ","%prefix%","%name%"," off of the House floor! "],
	["The lobbyists' nightmare ","%prefix%","%name%"," is being debated right now! "],
	["Special interests are trying to block ","%prefix%","%name%"," from getting through Congress! "],
	["The historic and imperative ","%prefix%","%name%"," is under attack by special interests! "],
];

var faxP2KillFlourish = [
	"This is the special interests' dream come true, and we need YOUR help to stop it! ",
	"Millions in special interest lobbying money are behind this bill, and only YOU can stop it! ",
	"If the special interests get their way, America will never look the same! ",
	"Don't be fooled by the name; this bill is bad news bankrolled by lobbyist money! ",
	"It may sound harmless, but this bill is just what the special interests want! "
];

var faxP2PassFlourish = [
	"This is the American people's dream come true, and we need YOUR help to pass it! ",
	"Millions in special interest lobbying money are against this bill, and only YOU can save it! ",
	"If the special interests get their way, we'll never make history with this bill! ",
	"This bill is the best news our country's had in a long time, but the lobbyists won't have it! ",
	"We need this bill right now, and YOU can't let special interests stop it! "
];

var faxP2Instruction = ["We have until ","%month%",". Call your rep, talk to your friends, and..."];

var outroText = "What if you'd done more? What if you'd done less? Would the outcome change? Play again and find out."
	
	+ "\n\nBut with so much going on, and so little information, how will you ever be sure that one voice -- your voice -- can"
	+ " make a difference?"
	
	+"\n\nTry again. Try and score 10 out of 10 three times in a row. Keep trying until you succumb to apathy."
	
	+"\n\nMaybe apathy isn't something wrong with the people. Maybe the game causes apathy."
	
	+"\n\nWhat if we played a different game? Liquid democracy? Participatory politics? Sociocracy? Consensus?"
	+" Something so new it doesn't have a name yet?"
	
	+"\n\nI don't know the answer, but I sure know the question. It's about time we started asking it.";

var introText = "\"The modern constituency has become the TV audience following along at home. Even if you wanted to,"
	+" you can't have a real conversation with a TV audience.\"";
