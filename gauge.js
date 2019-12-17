//This template is a good starting point for building a Viz for Looker
const slices = [
  { percent: 0.30, color: '#DB4437' }
];

function getCoordinatesForPercent(percent) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

function getCoordinatesForPointer(percent) {
  const x = 1.05*Math.cos(2 * Math.PI * percent);
  const y = 1.05*Math.sin(2 * Math.PI * percent);
  return [x, y];
}

function MyViz(id, data, options) {
	var cfg = {
				w: 600,												//Width of the circle
				h: 600,												//Height of the circle
				margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
    		style: "radial",
    		start_theta: .15,
    		end_theta: .85,
    		value_theta: 140,
    		cutout: .25,
    		size: 300,
    		value: 25,
    		range: [0, 100],
    		color: '#DB4437'
		};
  
  let cumulativePercent = cfg.end_theta;
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
		for(var i in options){
			if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  	}
	}
  
  d3.select(id).select("svg").remove();
  d3.select(id).style("background-color", "#FFF");
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w)
			.attr("height", cfg.h)
			.attr("class", id+"too")
  		.attr("viewBox", "-1 -1 2.5 2")
  		.style("transform", "rotate(-90deg)");

	//Append a g element	
	var g = svg.append("g");
  
  // GAUGE BACKGROUND
  g.append("circle")
  	.attr("class", "gauge-background")
  	.attr("r", 1)
    .style("fill", "#CECECE")
  	.attr("cx", 0)
  	.attr("cy", 0);
  
  // GAUGE REMOVED AREA
  [startX, startY] = getCoordinatesForPercent(cfg.start_theta);
  [endX, endY] = getCoordinatesForPercent(cfg.end_theta);
  largeArcFlag = (cfg.end_theta - cfg.start_theta) > .5 ? 1 : 0;
  pathData = [
    `M ${startX} ${startY}`, // Move
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
    `L 0 0`, // Line
  ].join(' ');
  g.append("path")
		.attr("d", pathData)
		.attr("fill", "#FFF");
  
  // GAUGE FILLED SEGMENT
  [startX, startY] = getCoordinatesForPercent(cumulativePercent);
  var fill_pct = Math.abs((cfg.value / (cfg.range[1] - cfg.range[0])) * (1-(cfg.end_theta - cfg.start_theta)));
  cumulativePercent += fill_pct;
  [endX, endY] = getCoordinatesForPercent(cumulativePercent);
  // if the slice is more than 50%, take the large arc (the long way around)
  largeArcFlag = fill_pct > .5 ? 1 : 0;
	// create an array and join it just for code readability
  pathData = [
    `M ${startX} ${startY}`, // Move
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
    `L 0 0`, // Line
  ].join(' ');
  
  g.append("path")
		.attr("d", pathData)
		.attr("fill", cfg.color);
  
 	// GAUGE START ARM
  [endX, endY] = getCoordinatesForPointer(cfg.start_theta);
  pathData = [
    `M ${endX} ${endY}`, // Move
    `L 0 0`, // Line
  ].join(' ');
  g.append("path")
  	.attr("class", "gauge-start")
		.attr("d", pathData)
  	.attr("stroke", "#CECECE")
  	.attr("stroke-width", ".04px");
  
  //GAUGE END ARM
  [endX, endY] = getCoordinatesForPointer(cfg.end_theta);
  pathData = [
    `M ${endX} ${endY}`, // Move
    `L 0 0`, // Line
  ].join(' ');
  g.append("path")
  	.attr("class", "gauge-end")
		.attr("d", pathData)
  	.attr("stroke", "#CECECE")
  	.attr("stroke-width", ".04px");

  
  g.append("circle")
  	.attr("class", "gauge-center")
  	.attr("r", function() {
    	return cfg.cutout;
    })
    .style("fill", "#FFF")
  	.style("opacity", 1)
  	.attr("cx", 0)
  	.attr("cy", 0);
  
  g.append("circle")
  	.attr("class", "spinner-center")
  	.attr("r", .05)
    .style("fill", "#282828")
  	.attr("cx", 0)
  	.attr("cy", 0);

  [endX, endY] = getCoordinatesForPointer(cumulativePercent);
  pathData = [
    `M ${endX} ${endY}`, // Move
    `L 0 0`, // Line
  ].join(' ');
  g.append("path")
  	.attr("class", "spinner-pointer")
		.attr("d", pathData)
  	.attr("stroke", "#282828")
  	.attr("stroke-width", ".04px");
  
	
	// Viz code goes here

} //MyViz

const baseOptions = {
		myOption: {
      	type: "number",
      	label: "Option label",
      	default: 4,
      	section: "Plot"
    },
}

const visObject = {
	create: function(element, config){
			element.innerHTML = "<div/>";
	},
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
    	// set the dimensions and margins of the graph
   		marginY = -1*element.clientHeight;
    	marginX = -1*element.clientWidth;

    	var margin = {top: marginY, right: marginX, bottom: marginY, left: marginX},
        	width = element.clientWidth,
        	height = element.clientHeight;

	    // append the svg object to the body of the page
	    // append a 'group' element to 'svg'
	    // moves the 'group' element to the top left margin
	    element.innerHTML = ""
	    var svg = d3.select("#vis").append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	      	.append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    // Data processing here to get data in right shape

	  	this.trigger('registerOptions', baseOptions);

			var vizOptions = {
		  		w: width,
		  		h: height,
		  		margin: margin,
			};

			//Call function to draw the visualization
	    svg.append("g").call(MyViz("#vis", data, vizOptions));

			done()
		}
	};

looker.plugins.visualizations.add(visObject);
