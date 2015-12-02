/*
 * It might be more useful/accessable to do this in D3 as an interactive graph. 
 * Though this would require the underlying GDS graph to be recreated within D3's system.
 */

$(document).ready(function()
{
	/*
	 * START 'global' variables
	 */
	 var participants = [];

	//Connect to local storage
	if(typeof(Storage)!=="undefined")
	{
		if (localStorage.getItem("participants") != null)
		{//There are other participants so get their data
			participants = JSON.parse(localStorage.getItem("participants"));

			//Set up the export to csv
	        document.getElementById('exportCSV').setAttribute('href', 'data:text/csv;base64,' + window.btoa(Papa.unparse(participants)));
	        document.getElementById('exportCSV').setAttribute("download", "data.csv");
	        //Set up the export to json
	        document.getElementById('exportJSON').setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURIComponent(JSON.stringify(participants)));
	        document.getElementById('exportJSON').setAttribute("download", "data.json");
		}
	}
	else
	{
		alert('local storage is not available');
	}

	//Graph variables
	var canvas = document.getElementById('scaleGraph');
	var context = canvas.getContext('2d');
	var plotRadius = 7;
	var xOffSet = 34; //Account for the padding of graph
	var yOffSet = 33; //Account for the padding of graph
	var colourBarHeight = 13; //Account for the colour bar at bottom of graph
	var graphHieght = 481; //Height of graph plotting area
	var colWidth = 100; //Width of the graph col
	var colCenter = -(colWidth/2) //Center on the col
	// Y Axis scale
	var maxAge = 120;
	var minAge = 10;
	var tickSize = 3; //Tick length either side of axis line
	var targetTicks = 10;
	var ticks = calculateTicks(minAge,maxAge,targetTicks); //Generate tick lables as array
	var interval = Math.floor(graphHieght/ticks.length); //Scale the intervals to the GDS graph

	/*
	 * END 'global' variables
	 */

/** MAIN **/

	//Load GDS graph img
	var imageObj = new Image();
	imageObj.src = '/DigitalInclusionScale.png';

	imageObj.onload = function() //Once Img loaded draw the rest of the graph
	{
		context.drawImage(imageObj, 0, 0); //Draw the backdrop graph
		drawYAxis();
		//Draw the required points
		for (var i = 0; i < participants.length; i++) {
			if (participants[i].researcherScore != undefined)
			{
				plotScore(participants[i].researcherScore, participants[i].age, participants[i].applicationScore);
			}
			else
			{
				plotScore('N/A', participants[i].age, participants[i].applicationScore);
			};
		};
		
	};

/** FUNCTIONS **/

	//Draw the Y axis for age
	function drawYAxis()
	{
		//Style axis
		context.strokeStyle="black"; //Line colour
		context.fillStyle = 'black'; //Text colour
		context.font="15px Georgia";

		//Draw axis
		context.beginPath();
		context.moveTo(xOffSet,yOffSet);
		context.lineTo(xOffSet,graphHieght+colourBarHeight);
		context.stroke();

		for (var i = 0; i < ticks.length; i++)
		{
			//Add tick
			context.beginPath();
			context.moveTo(xOffSet-tickSize,graphHieght - (i*interval));
			context.lineTo(xOffSet+tickSize,graphHieght - (i*interval));
			context.stroke();

			//Add tick lable
			context.textAlign="right";
			context.fillText(ticks[i],xOffSet-tickSize,graphHieght - (i*interval));
		};

		//Add Y axis lable 
		context.save();
		context.rotate(-(Math.PI/2)); //Rotate the canvas counter-clockwise 90 degree's
		context.textAlign="Center";
		context.fillText("Age", -(graphHieght/2),12);
		context.restore();
	}

	//Source: http://stackoverflow.com/questions/8855026/generate-axis-scale
	function calculateTicks(min, max, tickCount)
	{
		var span = max - min,
		step = Math.pow(10, Math.floor(Math.log(span / tickCount) / Math.LN10)),
		err = tickCount / span * step;

		// Filter ticks to get closer to the desired count.
		if (err <= .15) step *= 10;
		else if (err <= .35) step *= 5;
		else if (err <= .75) step *= 2;

		// Round start and stop values to step interval.
		var tstart = Math.ceil(min / step) * step,
		tstop = Math.floor(max / step) * step + step * .5,
		ticks = [],
		x;

		// now generate ticks
		for (i=tstart; i < tstop; i += step)
		{
			ticks.push(i);  
		} 
		return ticks;
	}


	//Plot a point on the graph
	function plotScore(lable, age, score)
	{
		var colour = 'black'; //Initalising colour
		var xPosition = colWidth*score; //Where to position the plot on xAxis
		var yPosition = graphHieght - ((age- minAge)*(interval/targetTicks));

		switch (score) //Switch colour depending the othe participant score
		{
		case 1: colour = '#DA7357'; break; //Score 1 graph colour match
		case 2: colour = '#EA8C5C'; break; //Score 2 graph colour match
		case 3: colour = '#EC9E5A'; break; //Score 3 graph colour match
		case 4: colour = '#F4C15B'; break; //Score 4 graph colour match
		case 5: colour = '#F9D45E'; break; //Score 5 graph colour match
		case 6: colour = '#EAE05F'; break; //Score 6 graph colour match
		case 7: colour = '#D6DA5D'; break; //Score 7 graph colour match
		case 8: colour = '#B0CC5B'; break; //Score 8 graph colour match
		case 9: colour = '#9CC55A'; break; //Score 9 graph colour match
		default:
		}

		//Add plot point
		context.beginPath();
		context.arc(xOffSet + xPosition + colCenter, yPosition, plotRadius, 0, 2 * Math.PI);
		context.fillStyle = colour;
		context.fill();
		context.stroke();

		//Add text lable
		context.fillStyle = 'black';
		context.font="16px Georgia";
		if(score!=9)
		{
			context.textAlign = "left";
			context.fillText('R-Score: ' + lable, xOffSet + plotRadius + xPosition + colCenter, yPosition - plotRadius);
		}
		else
		{
			context.textAlign = "right";
			context.fillText('R-Score: ' + lable, xOffSet + xPosition + colCenter - plotRadius, yPosition - plotRadius);
		}
	}
/** LISTENERS **/
	$('.exportCSV').click(function(){}); //Support file download
    $('.exportJSON').click(function(){}); //Support file download



    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    //////////  D3 graph test code  /////////

    nv.addGraph(function() {
		var chart = nv.models.scatterChart()
			.showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
        	.showDistY(true)
            .transitionDuration(350)
            .color(d3.scale.category20().range());

	  //Configure how the tooltip looks.
	  chart.tooltipContent(function(key) {
	      return '<h3>' + key + '</h3>';
	  });

	  //Axis settings
	  chart.xAxis.tickFormat(d3.format('n'));
	  chart.xAxis.axisLabel('Digital Inclusion Score');
	  chart.yAxis.tickFormat(d3.format('n'));
	  chart.yAxis.axisLabel('Age');

	  //We want to show shapes other than circles.
	  chart.scatter.onlyCircles(false);
	  chart.sizeRange([100,100]);
	  chart.showLegend(true);

	  var myData = convertData(/*participants*/);
	  d3.select('#chart svg')
	      .datum(myData)
	      .call(chart);

	  nv.utils.windowResize(chart.update);

	  return chart;
	});

	function convertData(participants) {

		participants = [
			{"age":56,"researcherScore":5,"applicationScore":9},
			{"age":100,"researcherScore":7,"applicationScore":2},
			{"age":98,"researcherScore":8,"applicationScore":3},
			{"age":80,"researcherScore":2,"applicationScore":1},
			{"age":90,"researcherScore":6,"applicationScore":9},
			{"age":64,"researcherScore":6,"applicationScore":4},
			{"age":45,"researcherScore":8,"applicationScore":7},
			{"age":70,"researcherScore":1,"applicationScore":9},
			{"age":37,"researcherScore":7,"applicationScore":1},
			{"age":44,"researcherScore":3,"applicationScore":3},
			{"age":12,"researcherScore":6,"applicationScore":2},
			{"age":27,"researcherScore":7,"applicationScore":3},
			{"age":33,"researcherScore":4,"applicationScore":4},
			{"age":66,"researcherScore":3,"applicationScore":5},
			{"age":82,"researcherScore":2,"applicationScore":6},
			{"age":19,"researcherScore":1,"applicationScore":7},
			{"age":18,"researcherScore":4,"applicationScore":8},
			{"age":23,"researcherScore":2,"applicationScore":4}
		]



	  var data = [];

	  for (i = 0; i < participants.length; i++) {
			data.push({
				key: "Application Score for Participant " + (i+1),
				values: []
			});

	    //Application point
			data[i].values.push({
				x: participants[i].applicationScore,
				y: participants[i].age,
				shape: "circle"  //Configure the shape of each scatter point.
			});
	    
	    }
	    for (i = 0; i < participants.length; i++) {
			data.push({
				key: "Researcher Score for Participant " + (i+1),
				values: []
			});

	    //Researcher point
			data[i].values.push({
				x: participants[i].researcherScore,
				y: participants[i].age,
				shape: 'cross'  //Configure the shape of each scatter point.
			});
	    
	    }
	  
	  

	  return data;
	}

});

