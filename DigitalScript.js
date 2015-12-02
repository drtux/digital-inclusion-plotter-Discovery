$(document).ready(function(){
	if($("form").length >0)
	{
		$.validate();
	}

/** LISTENERS **/
	$('.continue').click(function () {
	    if($(this).parents("form").isValid())
		{
			window.location.replace("digitalInclusion_" + $(this).attr('nextPage') + ".html");
		}
	});

	$('.saveAndContinue').click(function()
	{
		connectAndSave();//Save the participant to storage
		localStorage.removeItem("scaleForm");//Delete old form data
		if($(this).parents("form").isValid())
		{
			window.location.replace("digitalInclusion_" + $(this).attr('nextPage') + ".html");
		}
	});

	$('.newParticipant').click(function () {
	    
	    localStorage.removeItem("scaleForm");//Delete old form data
		window.location.replace("digitalInclusion_Metadata.html");
		
	});

/** FUNCTIONS **/

	//Connect to local storage and save the form data
	function connectAndSave()
	{
		var participants = [];
		var now = new Date;
		if(typeof(Storage)!=="undefined")
		{
			if (localStorage.getItem("scaleForm") === "{}" || localStorage.getItem("scaleForm") == null)
			{
				//Do nothing as no form data
	        }
	        else
	        {//If the form data exsists
				if (localStorage.getItem("participants") != null)
				{//There are other participants so get their data
					participants = JSON.parse(localStorage.getItem("participants"));
					if (localStorage.getItem("scaleForm") != null)
					{//Add the new participant's data (if there is any)
						participants[participants.length] = JSON.parse(localStorage.getItem("scaleForm"));
						participants[participants.length-1].applicationScore = generateScore(participants[participants.length-1]); // Generate the application score for this participant
						participants[participants.length-1].researchDateTime = now.toUTCString(); //Append the current date/time
					};
				}
				else
				{//This is the first participant
					participants[0] = JSON.parse(localStorage.getItem("scaleForm")); //Add the participant's data
					participants[0].applicationScore = generateScore(participants[0]); // Generate the application score for this participant
					participants[0].researchDateTime = now.toUTCString(); //Append the current date/time
				}
				//Save the participants data
				localStorage.setItem("participants", JSON.stringify(participants));
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
