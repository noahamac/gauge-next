//This template is a good starting point for building a Viz for Looker

function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
  	return (maxAllowed - minAllowed) * (currentNum - min) / (max - min) + minAllowed;
}

function MyViz(id, element, data, options) {
	var cfg = {
		w: 600,												//Width of the circle
		h: 600,												//Height of the circle
		margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
		style: "radial",
		angle: 40,	// Angle of Gauge
		cutout: .25,	// Size of Gauge Cutout
		color: '#DB4437',	// Color of Gauge fill
		arm: 10,					// Arm extension
		arm_weight: 10,		// Arm weight
		gauge_background: '#CECECE',	// Gauge background color
		spinner_background: '#282828',	// Spinner background color
		spinner_weight: 6,	// Spinner Weight
		range: [0,100],
		value: 50,
		target: 75,
		target_background: '#282828',
		target_width: 6
	};

	colorArray = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"]

	let color = colorArray[Math.floor(Math.random()*colorArray.length)];
	let value = Math.ceil(Math.random()*cfg.range[1]);
	let target = Math.floor(Math.random()*cfg.range[1]);

  
  	//let radius = 0.4*Math.min(element.clientWidth, element.clientHeight);
  	let radius = .4*element.clientWidth;
  	let cutoutCalc = radius*cfg.cutout;
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
		for(var i in options){
			if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  	}
	}
  
  	d3.select(id).selectAll("svg").remove();
  	var div = d3.select(id)
	    .style("background-color", "#FFF")
	  	.style("overflow-x", "hidden")
	  	.style("overflow-y", "hidden")
	  	.attr("align","center");
  
	var svg = d3.select(id).append("svg")
		.attr("class", "viz_svg")
  	.attr("width", element.clientWidth)
  	.attr("height", element.clientHeight);
  	//.attr("preserveAspectRatio", "xMidYMid meet")
  	//.attr("viewBox", `0 0 ${element.clientWidth} ${element.clientHeight}`);
  
	var g = svg.append("g");
  
  g.append("rect")
  	.attr("rx", 20)
  	.attr("ry", 20)
  	.attr("width", element.clientWidth * .95)
  	.attr("height", element.clientHeight * .95)
  	.attr("x", element.clientWidth * .025)
  	.attr("y", element.clientHeight * .025)
  	.attr("stroke-width", "5px")
  	.attr("stroke", "#ff073a")
  	.attr("fill", "black")
  	.style("filter", "url(#glow)");
  
  var chili = g.append("polygon")
  	.attr("points", "137 50,140 46,145 45,150 46,154 50,155 54,150 57,148 51,145 50,142 50,140 52,140 57,142 60,148 65,149 70,144 84,144 88,147 97,151 108,153 121,153 132,147 140,144 140,138 126,131 115,122 106,118 97,116 80,117 70,119 63,124 59,130 56,134 57")
  	.attr("fill", "none")
  	.attr("stroke", "#ff073a")
  	.attr("stroke-width", "2px")
  	.style("filter", "url(#glow)");
  
  console.log(chili.node().getBBox());
  var yadj = (((element.clientHeight - chili.node().getBBox().height) / 2) - chili.node().getBBox().y)
  chili.attr("transform", `scale(2.5),translate(-60 -30)`);
  
  
   var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
  
  /*
 	var generator = d3.arc()
      	.innerRadius(cutoutCalc)
      	.outerRadius(radius)
      	.startAngle(-cfg.angle * Math.PI * 2 / 360)
      	.endAngle(cfg.angle * Math.PI * 2 / 360);
  	var cover = g.append('path')
  		.attr("class", "gauge_background")
  		.attr("d", generator)
  		.attr("fill", cfg.gauge_background)
  		.attr("stroke", "none");

  	x_adj = (element.clientWidth/2)
  	//y_adj = 10 + g.node().getBBox().height
  	angleAdd = cfg.angle < 90 ? 0 : cfg.angle - 80;
  	y_adj = element.clientHeight - 35 - angleAdd

  	cover.attr("transform", `translate(${x_adj} ${y_adj})`);
  
  	var proportion = mapBetween(value,0,1,cfg.range[0],cfg.range[1])
  	var value_angle = cfg.angle*2*proportion - cfg.angle;
  	var fill_generator = d3.arc()
      	.innerRadius(cutoutCalc)
      	.outerRadius(radius)
      	.startAngle(-cfg.angle * Math.PI * 2 / 360)
      	.endAngle(value_angle * Math.PI * 2 / 360);
  	var gauge_fill = g.append('path')
  		.attr("class", "gaugeFill")
  		.attr("d", fill_generator)
  		.attr("fill", color)
  		.attr("stroke", "none")
  		.attr("transform", `translate(${x_adj} ${y_adj})`);
  
  	var leftArmArc = d3.arc()
	    .innerRadius(cutoutCalc)
	    .outerRadius(radius+cfg.arm)
	    .startAngle(-cfg.angle * Math.PI * 2 / 360)
	    .endAngle(-cfg.angle * Math.PI * 2 / 360);
  	g.append('path')
  		.attr("class", "leftArmArc")
  		.attr("d", leftArmArc)
  		.attr("fill", cfg.gauge_background)
  		.attr("stroke", cfg.gauge_background)
  		.attr("stroke-width", cfg.arm_weight)
  		.attr("transform", `translate(${x_adj} ${y_adj})`);
  	var rightArmArc = d3.arc()
        .innerRadius(cutoutCalc)
      	.outerRadius(radius+cfg.arm)
      	.startAngle(cfg.angle * Math.PI * 2 / 360)
      	.endAngle(cfg.angle * Math.PI * 2 / 360);
  	g.append('path')
  		.attr("class", "rightArmArc")
  		.attr("d", rightArmArc)
  		.attr("fill", cfg.gauge_background)
  		.attr("stroke", cfg.gauge_background)
  		.attr("stroke-width", cfg.arm_weight)
  		.attr("transform", `translate(${x_adj} ${y_adj})`);
  
  	var spinnerArm = d3.arc()
      	.innerRadius(0)
      	.outerRadius(radius+cfg.arm)
      	.startAngle(value_angle * Math.PI * 2 / 360)
      	.endAngle(value_angle * Math.PI * 2 / 360);
  	g.append('path')
  		.attr("class", "spinnerArm")
  		.attr("d", spinnerArm)
  		.attr("fill", cfg.spinner_background)
  		.attr("stroke", cfg.spinner_background)
  		.attr("stroke-width", cfg.spinner_weight)
  		.attr("transform", `translate(${x_adj} ${y_adj})`);
  	g.append("circle")
	  	.attr("class", "spinnerCenter")
	  	.attr("r", cfg.spinner_weight)
	    .style("fill", "#282828")
	  	.attr("cx", x_adj)
	  	.attr("cy", y_adj);
  
  	var target_proportion = mapBetween(target,0,1,cfg.range[0],cfg.range[1])
  	var target_angle = cfg.angle*2*target_proportion - cfg.angle;
  	var targetSpinner = d3.arc()
      	.innerRadius(cutoutCalc)
      	.outerRadius(radius)
      	.startAngle(target_angle * Math.PI * 2 / 360)
     	.endAngle(target_angle * Math.PI * 2 / 360);
  	g.append('path')
  		.attr("class", "targetSpinner")
  		.attr("d", targetSpinner)
  		.attr("stroke", cfg.target_background)
  		.attr("stroke-width", cfg.target_width)
  		.attr("stroke-dasharray", radius/10)
  		.attr("transform", `translate(${x_adj} ${y_adj})`);

  	g.append('text')
  		.attr("class", "gaugeValue")
  		.text(value)
  		.style("font-size", "22px")
  		.style("font-family", "Open Sans")
  		.attr("transform", `translate(${x_adj - d3.select(".gaugeValue").node().getBBox().width/2} ${y_adj + 30})`);
  */
	
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
			element.innerHTML = "";
	},
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
    	// set the dimensions and margins of the graph
    	var margin = {top: 20, right: 20, bottom: 20, left: 20},
        	width = element.clientWidth,
        	height = element.clientHeight;

	    var svg = d3.select("#vis").append("svg");

	    let angle = Math.ceil(Math.random()*120)
	    // Data processing here to get data in right shape

	  	this.trigger('registerOptions', baseOptions);

			var vizOptions = {
		  		w: width,
		  		h: height,
		  		margin: margin,
		  		angle: angle
			};

			//Call function to draw the visualization
	    svg.append("g").call(MyViz("#vis", element, data, vizOptions));

			done()
		}
	};

looker.plugins.visualizations.add(visObject);
