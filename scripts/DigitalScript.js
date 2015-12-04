$(document).ready(function(){
	if($("form").length >0)
	{//If a form element exsists
		$.validate();
	}

/** LISTENERS **/

	$('.navigation').click(function()
	{
		switch($(this).attr('navType'))
		{
			case 'newParticipant': newParticipant(); break;
			case 'cancelParticipant': cancelParticipant(); break;
			case 'newSession': newSession(); break;
			case 'cancelSession': cancelSession(); break;
			case 'endSession': endSession(); break;
			default: break;
		}

		
	});

	var URL = "digitalInclusion_";
	var FILETYPE = ".html";

	function endSession() {
		connectAndSave();//Save the participant to storage
		localStorage.removeItem("participantForm");//Delete old participant form data
		localStorage.removeItem("sessionForm");//Delete old session form data
		if($(this).parents("form").isValid())
		{
			window.location.replace(URL + $(this).attr('nextPage') + FILETYPE);
		}
	}

	function newParticipant() {
		connectAndSave();//Save the participant to storage
	    localStorage.removeItem("participantForm");//Delete old participant form data
		window.location.replace(URL + $(this).attr('nextPage') + FILETYPE);
	}

	function newSession() {
	    localStorage.removeItem("participantForm");//Delete old participant form data
		localStorage.removeItem("sessionForm");//Delete old session form data
		window.location.replace(URL + $(this).attr('nextPage') + FILETYPE);
	}

	function cancelSession() {
			localStorage.removeItem("sessionForm");//Delete current session form data
			window.location.replace(URL + $(this).attr('nextPage') + FILETYPE);
	}
	function cancelParticipant() {
			localStorage.removeItem("participantForm");//Delete current participant form data
			window.location.replace(URL + $(this).attr('nextPage') + FILETYPE);
	}

/** FUNCTIONS **/

	//Connect to local storage and save the form data
	function connectAndSave()
	{
		var session = [];
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
		        	//Save session metadata
					if (localStorage.getItem("session") != null)
					{//There are other sessions so get their data
						session = JSON.parse(localStorage.getItem("session"));
						session[session.length] = JSON.parse(localStorage.getItem("sessionForm"));
						session[session.length-1].participant=[];//set up structure for future use
					}
					else
					{//This is the first session
						session[0] = JSON.parse(localStorage.getItem("sessionForm")); //Add the session's data
						session[0].participant=[];//set up structure for future use
					}

					if (session[session.length-1].participant != null)
					{//There are other participants so append to the end
						session[session.length-1].participant[session[session.length-1].participant.length] = JSON.parse(localStorage.getItem("participantForm"));
						session[session.length-1].participant[session[session.length-1].participant.length-1].applicationScore = generateScore(session[session.length-1].participant[session[session.length-1].participant.length-1]); // Generate the application score for this participant
						session[session.length-1].participant[session[session.length-1].participant.length-1].researchDateTime = now.toUTCString(); //Append the current date/time
					}
					else
					{//This is the first participant
						session[session.length-1].participant[0] = JSON.parse(localStorage.getItem("participantForm"));
						session[session.length-1].participant[0].applicationScore = generateScore(session[session.length-1].participant[session[session.length-1].participant.length-1]); // Generate the application score for this participant
						session[session.length-1].participant[0].researchDateTime = now.toUTCString(); //Append the current date/time
					}
					//Save the participants data
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

		if(participant.useEver === '-1')
		{//Never used the internet "Never have, never will"
			return 1;
		}

		if(participant.useCurrent === '-1')
		{//Dosen't currently use digital technology "Was online, but no longer online"
			return 2;
		}
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

		participant.appDebugScore  = calc;
		

		return score;
	}
});
