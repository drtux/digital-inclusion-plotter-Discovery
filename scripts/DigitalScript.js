$(document).ready(function(){
	if($("form").length >0)
	{//If a form element exsists
		if($(":checkbox").length && $(":radio").length)
		{
			$(":checkbox").labelauty();
			$(":radio").labelauty();
		}
		$.validate();
	}

/** LISTENERS **/

	$('.navigation').click(function()
	{
		switch($(this).attr('navType'))
		{
			case 'newParticipant': newParticipant($(this)); break;
			case 'cancelParticipant': cancelParticipant($(this)); break;
			case 'newSession': newSession($(this)); break;
			case 'cancelSession': cancelSession($(this)); break;
			case 'endSession': endSession($(this)); break;
			default: break;
		}

		
	});

	var URL = "digitalInclusion_";
	var FILETYPE = ".html";

	function endSession(btn) {
    	if($('form').isValid())
		{
			connectAndSave();//Save the participant to storage
			localStorage.removeItem("participantForm");//Delete old participant form data
			localStorage.removeItem("sessionForm");//Delete old session form data
			window.location.replace(URL + btn.attr('nextPage') + FILETYPE);
		}
	}

	function newParticipant(btn) {
	    if($('form').length){
	    	if($('form').isValid())
			{
				connectAndSave();//Save the participant to storage
	    		localStorage.removeItem("participantForm");//Delete old participant form data
				window.location.replace(URL + btn.attr('nextPage') + FILETYPE);
			}
		}else
		{
			window.location.replace(URL + btn.attr('nextPage') + FILETYPE);
		}
	}

	function newSession(btn) {
	    localStorage.removeItem("participantForm");//Delete old participant form data
		localStorage.removeItem("sessionForm");//Delete old session form data
		var sCount = 0;//Default to first session
		if (localStorage.getItem("sCount") != null)
		{//There are other participants get the count
			sCount = parseInt(JSON.parse(localStorage.getItem("sCount")));
			sCount++;//Increment for new session
		}
		localStorage.setItem("sCount", JSON.stringify(sCount));//Save the Count
		window.location.replace(URL + btn.attr('nextPage') + FILETYPE);
	}

	function cancelSession(btn) {
			localStorage.removeItem("sessionForm");//Delete current session form data
			window.location.replace(URL + btn.attr('nextPage') + FILETYPE);
	}
	function cancelParticipant(btn) {
			localStorage.removeItem("participantForm");//Delete current participant form data
			window.location.replace(URL + btn.attr('nextPage') + FILETYPE);
	}

/** FUNCTIONS **/

	//Connect to local storage and save the form data
	function connectAndSave()
	{
		var session = [];
		var dataObj = //HACK to get round CSV exporting limitations by ensuring all properties present 
			{
				sessionID: null,
				sessionName: null,
				sessionLocation: null,
				sessionComment: null,
				researchDateTime: null,
				age: null,
				useEver: null,
				useCurrent: null,
				useFuture: null,
				needYDay: null,
				needYWork: null,
				needYTask: null,
				needNSkill: null,
				needNAccess: null,
				needNMotivation: null,
				needNConfidence: null,
				needNo: null,
				convenience: null, 
				confidence: null,
				accessWhereHome: null,
				accessWhereMobile: null,
				accessWherePublic: null,
				accessWhereWork: null,
				accessDeviceDesktop: null,
				accessDeviceLaptop: null,
				accessDeviceTablet: null,
				accessDeviceSmartphone: null,
				accessDeviceBrickphone: null,
				fequencyOnline: null,
				accessHCIEvery: null,
				accessHCIOccasional: null,
				accessNeedGoodBad: null,
				accessNeed: null,
				learn: null,
				saftey: null,
				rowSearch: null,
				rowSearchAdv: null,
				rowSearchSite: null,
				rowUpDlFile: null,
				rowHist: null,
				rowMsg: null,
				rowVoIP: null,
				rowNews: null,
				rowBank: null,
				rowShop: null,
				rowGov: null,
				rowInstall: null,
				rowBandwidth: null,
				researcherScore: null,
				researcherComment: null,
				appDebugScore: null
			};

		var now = new Date;


		if(typeof(Storage)!=="undefined")
		{
			if (localStorage.getItem("sessionForm") === "{}" || localStorage.getItem("sessionForm") == null) {
				//Do nothing as no session started
			}
			else
			{//A session has been started
				if (localStorage.getItem("participantForm") === "{}" || localStorage.getItem("participantForm") == null)
				{
					//Do nothing must have participant to save
		        }
		        else
		        {//Have both session and participant so can save
		        	var sCount = 0;//Default to there being no other sessions
		        	var pCount = 0;//Default to there being no other partipipants

					if (localStorage.getItem("session") != null)
					{//There are other sessions so get their data
						session = JSON.parse(localStorage.getItem("session"));
					}
					if (localStorage.getItem("sCount") != null)
					{//There are other participants get the count
						sCount = parseInt(JSON.parse(localStorage.getItem("sCount")));
					}
					if (localStorage.getItem("pCount") != null)
					{//There are other participants get the count
						pCount = parseInt(JSON.parse(localStorage.getItem("pCount")));
					}

					

					dataObj.sessionID = sCount;
					//Appending the session header
					var head = JSON.parse(localStorage.getItem("sessionForm"));
					for (var key in head) {
						if (head.hasOwnProperty(key)) {
							dataObj[key] = head[key];
						}
					}

					dataObj.researchDateTime = now.toUTCString(); //Append the current date/time

					dataObj.participantID = pCount;
					//Append the participant data body
					var body = JSON.parse(localStorage.getItem("participantForm"));
					for (var key in body) {
						if (body.hasOwnProperty(key)) {
							dataObj[key] = body[key];
						}
					}
					dataObj.applicationScore = generateScore(dataObj); // Generate the application score for this participant
					
					pCount++;//Recored the added participant
					localStorage.setItem("pCount", JSON.stringify(pCount));

					//Save the participants data
					session[session.length] = dataObj;
					localStorage.setItem("session", JSON.stringify(session));
				}
					
		    }
		}
		else
		{
			alert('local storage is not available');
		}
	}

	//Generate the application score for the given participant
	function generateScore(participant)
	{
		var score = 0;
		var calc = [];

///////////////////////////////
/* ---- CONFIG: ROUTING ---- */
///////////////////////////////

//NULL === Negative responce

/* ---- NEED ---- */ var needScore = 0;
		switch(parseInt(participant.convenience))
		{
			case 1: needScore -= 4; break;
			case 2: needScore -= 2; break;
			case 3: needScore += 2; break;
			case 4: needScore += 4; break;
			default: break;
		}

		if(participant.needYDay != null){needScore += 4}
		if(participant.needYWork != null){needScore += 1}
		if(participant.needYTask != null){needScore += 1}
		if(participant.needNSkill != null){needScore -= 1}
		if(participant.needNAccess != null){needScore -= 1}
		if(participant.needNMotivation != null){needScore -= 1}
		if(participant.needNConfidence != null){needScore -= 1}


/* ---- DEVICE ---- */ var deviceTypeCount = 0;
		if(participant.accessDeviceDesktop != null){deviceTypeCount++;}
		if(participant.accessDeviceLaptop != null){deviceTypeCount++;}
		if(participant.accessDeviceTablet != null){deviceTypeCount++;}
		if(participant.accessDeviceSmartphone != null){deviceTypeCount++;}
		if(participant.accessDeviceBrickphone != null){deviceTypeCount++;}

/* ---- ACCESS ---- */ var accessScore = 0;

		if(participant.accessWhereHome != null){accessScore += 10;}
		if(participant.accessWhereMobile != null){accessScore += 5;}
		if(participant.accessWherePublic != null){accessScore += 2;}
		if(participant.accessWhereWork != null){accessScore += 2;}
		if(participant.accessDeviceDesktop != null){accessScore += 2;}
		if(participant.accessDeviceLaptop != null){accessScore += 2;}
		if(participant.accessDeviceTablet != null){accessScore += 2;}
		if(participant.accessDeviceSmartphone != null){accessScore += 2;}
		if(participant.accessDeviceBrickphone != null){accessScore -= 2;}
		if(participant.accessHCIEvery != null){accessScore -= 10;}
		if(participant.accessHCIOccasional != null){accessScore -= 5;}
		if(participant.accessNeedGoodBad != null){accessScore -= 5;}
		if(participant.accessNeed != null){accessScore -= 10;}

		switch(parseInt(participant.fequencyOnline))
		{
			case 1: accessScore -= 4; break;
			case 2: accessScore -= 2; break;
			case 3: accessScore += 2; break;
			case 4: accessScore += 4; break;
			default: break;
		}

/* ---- CONFIDENCE ---- */ var confidenceScore = 0;
		switch(parseInt(participant.confidence))
		{
			case 1: confidenceScore -= 4; break;
			case 2: confidenceScore -= 2; break;
			case 3: confidenceScore += 2; break;
			case 4: confidenceScore += 4; break;
			default: break;
		}
/* ---- LEARNING ---- */ var learningScore = 0; 
		switch(parseInt(participant.learn))
		{
			case 1: learningScore -= 4; break;
			case 2: learningScore -= 2; break;
			case 3: learningScore += 2; break;
			case 4: learningScore += 4; break;
			default: break;
		}

/* ---- SAFETY ---- */ var safteyScore = 0;
		switch(parseInt(participant.saftey))
		{
			case 1: safteyScore -= 4; break;
			case 2: safteyScore -= 2; break;
			case 3: safteyScore += 2; break;
			case 4: safteyScore += 4; break;
			default: break;
		}

/* ---- SKILL ---- */ var skillScore = 0; 

		if(participant.rowSearch != null){skillScore += 1}
		if(participant.rowSearchAdv != null){skillScore += 3}
		if(participant.rowSearchSite != null){skillScore += 1}
		if(participant.rowUpDlFile != null){skillScore += 1}
		if(participant.rowHist != null){skillScore += 1}
		if(participant.rowMsg != null){skillScore += 1}
		if(participant.rowVoIP != null){skillScore += 1}
		if(participant.rowNews != null){skillScore += 1}
		if(participant.rowBank != null){skillScore += 2}
		if(participant.rowShop != null){skillScore += 1}
		if(participant.rowGov != null){skillScore += 1}
		if(participant.rowInstall != null){skillScore += 1}
		if(participant.rowBandwidth != null){skillScore += 2}


//////////////////////////////
/* ---- START: ROUTING ---- */
//////////////////////////////

/* ---- KEY ----
1: Never have, never will 
2: Was online, but no longer online 
3: Willing and unable 
4: Reluctantly online 
5: Learning the ropes 
6: Task specific 
7: Basic digital skills and capabilities 
8: Confident 
9: Expert 
*/


/* ---- Definitions used ---- */
/*		
Lvl 1: Dosen't ever use && not use in future && feels no need && has no devices
Lvl 2: Dosen't currently use && won't use in future && has few devices
Lvl 3: Low confidence && access && learning && safety && has good/bad days && has few device types (has brick phone?) && inconvenient
Lvl 4: Low learning && confidence && needs assistance everytime && few devices types && inconveniant
Lvl 5: High learning confidence but low skill, needs assistance occasionally (has smartphone) && inconvenient
Lvl 6: Yes to task specific (weekly/monthy), needs assistance occasionally, internet for work, the more standard ‘basic skills’ msging/soical media, new sites, shopping
Lvl 7: Yes to majority of the skills (daily) (moderate devices types) possibly missing advanced search
Lvl 8: Regularly online, highly confident, high access
Lvl 9: yes to everything (lots of device types) high bandwidth && advanced search
*/

/* ---- Max scores ---- *||* ---- Min Scores ---- */
// needScore:       10   ||  needScore:       -8
// deviceTypeCount: 4    ||  deviceTypeCount:  0
// accessScore:     31   ||  accessScore:     -4
// confidenceScore: 4    ||  confidenceScore: -4
// learningScore:   4    ||  learningScore:   -4
// safetyScore:     4    ||  safetyScore:     -4
// skillScore:      17   ||  skillScore:       0

/* 1 */	if((participant.useEver == null) && (participant.useFuture == null) && (participant.needNo == null) && (deviceTypeCount == 0)){return 1;}
/* 2 */	else if ((participant.useCurrent == null) && (participant.useFuture == null) && (deviceTypeCount <= 1)){return 2;}
/* 3 */	else if ((confidenceScore <= 2) && (accessScore <= 2) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 3;}
/* 4 */	else if ((confidenceScore <= 2) && (accessScore <= 3) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 4;}
/* 5 */	else if ((confidenceScore <= 2) && (accessScore <= 3) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 5;}
/* 6 */	else if ((confidenceScore <= 2) && (accessScore <= 3) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 6;}
/* 7 */	else if ((confidenceScore <= 2) && (accessScore <= 3) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 7;}
/* 8 */	else if ((confidenceScore <= 2) && (accessScore <= 3) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 8;}
/* 9 */	else if ((confidenceScore <= 2) && (accessScore <= 3) && (learningScore <= 2) && (safetyScore <= 2) && (deviceTypeCount <= 2) && (needScore <= 2) && (skillScore <= 2)){return 9;}
		else//ERROR case
		{return 0;}	






////////////////////////////
/* ---- END: ROUTING ---- */
////////////////////////////


/*
		//Calc number of devices
		var deviceTypeCount=0;
		if(participant.accessDevice1 != null) deviceTypeCount++;
		if(participant.accessDevice2 != null) deviceTypeCount++;
		if(participant.accessDevice3 != null) deviceTypeCount++;
		if(participant.accessDevice4 != null) deviceTypeCount++;
		if(participant.accessDevice5 != null) deviceTypeCount++;

		//Calc access score + conveniance
		var accessScore=0;
		if(participant.accessWhere1 != null) accessScore++;
		if(participant.accessWhere2 != null) accessScore++;
		if(participant.accessWhere3 != null) accessScore++;
		if(participant.accessWhere4 != null) accessScore++;
		switch(deviceTypeCount)
		{
			case 1: accessScore+=1; break;
			case 2: accessScore+=2; break;
			case 3: accessScore+=3; break;
			case 4: accessScore+=4; break;
			case 5: accessScore+=5; break;
			default: accessScore-=1; break;
		}
		if(participant.accessHCI1 != null) accessScore--;
		if(participant.accessHCI2 != null) accessScore--;
		if(participant.accessNeed1 != null) accessScore--;
		if(participant.accessNeed2 != null) accessScore--;
		if(participant.row13 != null) accessScore++;

		//Calc skill score
		var skillScore=0;
		if(participant.row1 != null) skillScore++;
		if(participant.row2 != null) skillScore++;
		if(participant.row3 != null) skillScore++;
		if(participant.row4 != null) skillScore++;
		if(participant.row5 != null) skillScore++;
		if(participant.row6 != null) skillScore++;
		if(participant.row7 != null) skillScore++;
		if(participant.row8 != null) skillScore++;
		if(participant.row9 != null) skillScore++;
		if(participant.row10 != null) skillScore++;
		if(participant.row11 != null) skillScore++;
		if(participant.row12 != null) skillScore++;
		
		//Calc motivation score
		var motivationScore = 0;


		//Calc confidence score
		var confidenceScore = 0;


		


//Begin score routeing

		//Lvl 1: Dosen't ever use && not use in future && feels no need && has no devices
		if((participant.use1 == null) &&
			(participant.use3 == null) &&
			(participant.need8 == null) &&
			(deviceTypeCount == 0))
			{return 1;}
		else//Lvl 2: Dosen't currently use && won't use in future && has few devices
		if ((participant.use2 == null) &&
			(participant.use3 == null) &&
			(deviceTypeCount <= 1))
			{return 2;}
		else//Lvl 3: Low confidence && access && learning && safety && has good/bad days && has few device types (has brick phone?) && inconvenient
		if ((parseInt(participant.confidence) <= 2) &&
			(accessScore <= 3) &&
			(parseInt(participant.learn) <= 2) &&
			(parseInt(participant.safety) <= 2) &&
			(deviceTypeCount <= 2) &&
			(participant.convenience <= 2))
			{return 3;}
		else//Lvl 4: Low learning && confidence && needs assistance everytime && few devices types && inconveniant
		if ((parseInt(participant.learn) <= 2) &&
			(parseInt(participant.confidence) <= 2) &&
			(accessScore <= 5) &&
			(deviceTypeCount <= 3) &&
			(participant.convenience <= 2))
			{return 4;}
		else//Lvl 5: High learning confidence but low skill, needs assistance occasionally (has smartphone) && inconvenient
		if ((parseInt(participant.learn) >=3) &&
			(skillScore <= 4) &&
			(participant.accessHCI2 != null) &&
			(participant.convenience <= 2))
			{return 5;}
		else//Lvl 6: Yes to task specific (weekly/monthy), needs assistance occasionally, internet for work, the more standard ‘basic skills’ msging/soical media, new sites, shopping
		if ((parseInt(participant.fequencyOnline) <= 2) &&
			(participant.accessHCI2 != null) &&
			(skillScore <= 8))
			{return 6;}
		else//Lvl 7: Yes to majority of the skills (daily) (moderate devices types) possibly missing advanced search
		if ((parseInt(participant.fequencyOnline) >=3) &&
			(deviceTypeCount >= 3) &&
			(skillScore <= 10) &&
			(participant.convenience >= 3))
			{return 7;}
		else//Lvl 8: Regularly online, highly confident, high access
		if ((parseInt(participant.fequencyOnline) >=3) &&
			(parseInt(participant.confidence) >=3) &&
			(accessScore >= 8))
			{return 8;}
		else//Lvl 9: yes to everything (lots of device types) high bandwidth && advanced search 
		if((deviceTypeCount >= 3) &&
			(skillScore == 12) &&
			(accessScore == 10) &&
			(parseInt(participant.confidence) >= 3) &&
			(parseInt(participant.fequencyOnline) >=3) && 
			(parseInt(participant.learn) >= 3) &&
			(parseInt(participant.safety) >= 3) &&
			(participant.convenience >= 3))
			{return 9;}
		else
		{return 0;}	

*/

/*
		if(participant.use1 != null)//Ever
		{//Never used the internet "Never have, never will"
			return 1;
		}

		if(participant.use2 != null)//Current
		{//Dosen't currently use digital technology "Was online, but no longer online"
			return 2;
		}
		if(participant.use3 != null)//Future
		{//Dosen't currently use digital technology "Was online, but no longer online"
			return 2;
		}
		if (participant.need1) {};
		if(participant.ynRow1 === '1'){
			calc.push(parseInt(participant.row1) * 2);
		}else{
			calc.push(parseInt(participant.row1));
		}
		if(participant.ynRow2 === '1'){
			calc.push(parseInt(participant.row2) * 2);
		}else{
			calc.push(parseInt(participant.row2));
		}
		if(participant.ynRow3 === '1'){
			calc.push(parseInt(participant.row3) * 2);
		}else{
			calc.push(parseInt(participant.row3));
		}
		if(participant.ynRow4 === '1'){
			calc.push(parseInt(participant.row4) * 2);
		}else{
			calc.push(parseInt(participant.row4));
		}
		if(participant.ynRow5 === '1'){
			calc.push(parseInt(participant.row5) * 2);
		}else{
			calc.push(parseInt(participant.row5));
		}
		if(participant.ynRow6 === '1'){
			calc.push(parseInt(participant.row6) * 2);
		}else{
			calc.push(parseInt(participant.row6));
		}
		if(participant.ynRow7 === '1'){
			calc.push(parseInt(participant.row7) * 2);
		}else{
			calc.push(parseInt(participant.row7));
		}
		if(participant.ynRow8 === '1'){
			calc.push(parseInt(participant.row8) * 2);
		}else{
			calc.push(parseInt(participant.row8));
		}
		if(participant.ynRow9 === '1'){
			calc.push(parseInt(participant.row9) * 2);
		}else{
			calc.push(parseInt(participant.row9));
		}
		if(participant.ynRow10 === '1'){
			calc.push(parseInt(participant.row10) * 2);
		}else{
			calc.push(parseInt(participant.row10));
		}
		if(participant.ynRow11 === '1'){
			calc.push(parseInt(participant.row11) * 2);
		}else{
			calc.push(parseInt(participant.row11));
		}
		if(participant.ynRow12 === '1'){
			calc.push(parseInt(participant.row12) * 2);
		}else{
			calc.push(parseInt(participant.row12));
		}

		calc.push(parseInt(participant.speed));
		//calc.push(parseInt(participant.technical));
		calc.push(parseInt(participant.learn));
		calc.push(parseInt(participant.type));
		calc.push(parseInt(participant.deviceNumber));
		
		if(participant.fequencyOnlineScale === 'd'){calc.push(parseInt(participant.fequencyOnline) * 3);}
		else if(participant.fequencyOnlineScale === 'm'){calc.push(parseInt(participant.fequencyOnline) * 2);}
		else{calc.push(parseInt(participant.fequencyOnline));};

		calc.push(parseInt(participant.timeOnline));
		calc.push(parseInt(participant.need));
		calc.push(parseInt(participant.trustPersonal));
		calc.push(parseInt(participant.trustFinance));
		calc.push(parseInt(participant.safe));

		var calcSum = calc.reduce(function(a, b) {return a + b;});

		if(calcSum <=20){score = 4}
		else if(calcSum >20 && calcSum <=40){score = 5}
		else if(calcSum >40 && calcSum <=60){score = 6}
		else if(calcSum >60 && calcSum <=80){score = 7}
		else if(calcSum >80 && calcSum <=100){score =  8}
		else{score = 9};

		dataObj.appDebugScore  = calc;

		return score; */
	}
});
