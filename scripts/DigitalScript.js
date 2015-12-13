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
				use1: null,
				use2: null,
				use3: null,
				need1: null,
				need2: null,
				need3: null,
				need4: null,
				need5: null,
				need6: null,
				need7: null,
				need8: null,
				convenience: null,
				accessWhere1: null,
				accessWhere2: null,
				accessWhere3: null,
				accessWhere4: null,
				accessDevice1: null,
				accessDevice2: null,
				accessDevice3: null,
				accessDevice4: null,
				accessDevice5: null,
				fequencyOnline: null,
				accessHCI1: null,
				accessHCI2: null,
				accessNeed1: null,
				accessNeed2: null,
				learn: null,
				saftey: null,
				row1: null,
				row2: null,
				row3: null,
				row4: null,
				row5: null,
				row6: null,
				row7: null,
				row8: null,
				row9: null,
				row10: null,
				row11: null,
				row12: null,
				row13: null,
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



/*                                            NULL === NO 
		use1: null, ever
		use2: null, currently
		use3: null, future
		need1: null, yes everyday
		need2: null, yes work
		need3: null, yes tasks
		need4: null, no skills
		need5: null, no access
		need6: null, no motivation
		need7: null, no confidence
		need8: null, no need
		convenience: null, 1-4 very conveniant to very inconveniant (null is don't know)
		accessWhere1: null, home
		accessWhere2: null, mobile
		accessWhere3: null, public
		accessWhere4: null, work
		accessDevice1: null, desktop
		accessDevice2: null, laptop
		accessDevice3: null, tablet
		accessDevice4: null, smartphone
		accessDevice5: null, brickphone
		fequencyOnline: null, 1-4 daily, weekly, monthly, yearly
		accessHCI1: null, every
		accessHCI2: null, occational/task
		accessNeed1: null, good/bad
		accessNeed2: null, aquired
		learn: null, 1-4 very confident to very unsure (null is don't know)
		saftey: null, 1-4 very confident to very unsure (null is don't know no idea
		row1: null, search engine
		row2: null, search engine advanced
		row3: null, site search
		row4: null, Upload/downlonad + email attachment
		row5: null, History
		row6: null, Msging
		row7: null, VoIP
		row8: null, news online
		row9: null, banking
		row10: null, shopping
		row11: null, Gov services online
		row12: null, install/uninstall
		row13: null, high bandwidth
*/


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

		return score;
	}
});
