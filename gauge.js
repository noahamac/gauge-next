//This template is a good starting point for building a Viz for Looker

function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
  	return (maxAllowed - minAllowed) * (currentNum - min) / (max - min) + minAllowed;
}

const baseOptions = {
	angle: {
      	type: "number",
      	label: "Gauge Angle",
      	default: 90,
      	section: "Plot",
      	display: "range",
      	min: 10,
      	max: 170
    },
    arm_length: {
      	type: "number",
      	label: "Arm Length",
      	default: 10,
      	section: "Plot",
      	display: "range",
      	min: 0,
      	max: 100
    },
    arm_weight: {
      	type: "number",
      	label: "Arm Thickness",
      	default: 8,
      	section: "Plot",
      	display: "range",
      	min: 0,
      	max: 100
    },
    cutout: {
      	type: "number",
      	label: "Gauge Cutout",
      	default: 15,
      	section: "Plot",
      	display: "range",
      	min: 0,
      	max: 100
    },
    style: {
      type: "string",
      label: "Gauge Style",
      display: "select",
      section: "Plot",
      values: [
      	 {"Radial": "radial"},
      	 {"Vertical": "vertical"},
      	 {"Horizontal": "horizontal"}
      ],
      default: "radial"
    },
    gauge_color: {
        type: `string`,
        label: `Background Color`,
        display: `color`,
        section: "Plot",
        default: "#CDCDCD"
    },
    spinner_color: {
        type: `string`,
        label: `Spinner Color`,
        display: `color`,
        section: "Plot",
        default: "#282828"
    },
    spinner_weight: {
      	type: "number",
      	label: "Spinner Thickness",
      	default: 8,
      	section: "Plot",
      	display: "range",
      	min: 0,
      	max: 100
    },
    label_padding: {
      	type: "number",
      	label: "Label Padding",
      	default: 40,
      	section: "Plot",
      	display: "range",
      	min: 0,
      	max: 100
    },
    fill_color: {
        type: `string`,
        label: `Fill Color`,
        display: `color`,
        section: "Plot",
        default: "#0275d8"
    },
    value_label: {
     	type: "string",
      	label: "Value Label",
      	section: "Plot"
    },
    target_label: {
     	type: "string",
      	label: "Value Label",
      	section: "Plot"
    },
}

const visObject = {
	create: function(element, config){
			element.innerHTML = "";
	},
	updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    	// set the dimensions and margins of the graph
    	var margin = {top: 20, right: 20, bottom: 20, left: 20},
        	width = element.clientWidth,
        	height = element.clientHeight;

	    var svg = d3.select("#vis").append("svg");

	    // Data processing here to get data in right shape

	  	this.trigger('registerOptions', baseOptions);

	  	colorArray = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"]
	  	labels = ["minutes", "mins", "orders", "ACV", "units"]
	  	types = ["radial", "vertical"]
	  	// let color = colorArray[Math.round(Math.random()*colorArray.length)]
	  	// let valueLabel = labels[Math.round(Math.random()*labels.length)]
	  	// let targetLabel = labels[Math.round(Math.random()*labels.length)]
	  	// let typeRand = types[Math.round(Math.random()*types.length)]
		let value = Math.round(Math.random()*10000)
		let target = Math.round(Math.random()*10000)
		// let angle = Math.round(Math.random()*100+30)

		var options = {
	  		w: width,
	  		h: height,
	  		margin: margin,
	  		color: config.fill_color,
	  		value: value,
	  		target: target,
	  		angle: config.angle,
	  		value_label: config.value_label,
	  		target_label: config.target_label,
	  		type: config.style,
	  		gauge_background: config.gauge_color,
	  		arm: config.arm_length,
	  		arm_weight: config.arm_weight,
	  		cutout: config.cutout/100,
	  		spinner_background: config.spinner_color,
	  		spinner_weight: config.spinner_weight,

		};

		var cfg = {
			w: 600,												//Width of the circle
			h: 600,												//Height of the circle
			margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
			style: "radial",
			angle: 90,	// Angle of Gauge
			cutout: .25,	// Size of Gauge Cutout
			color: '#DB4437',	// Color of Gauge fill
			arm: 15,					// Arm extension
			arm_weight: 8,		// Arm weight
			gauge_background: '#CECECE',	// Gauge background color
			spinner_background: '#282828',	// Spinner background color
			spinner_weight: 6,	// Spinner Weight
			range: [0,10000],
			value: 50,
			target: 0,
			target_background: '#282828',
			target_width: 3,
			labelPadding: 40,
			targetPadding: 1.1,
			type: 'vertical',
			value_label: '',
			target_label: ''
		};
		
		//Put all of the options into a variable called cfg
		if('undefined' !== typeof options){
			for(var i in options){
				if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
		  	}
		}

		let radius = 0.4*Math.min(element.clientWidth, element.clientHeight);
	  	// let radius = .4*element.clientWidth;
	  	let cutoutCalc = radius*cfg.cutout;
	  
	  	d3.select("#vis").selectAll("svg").remove();
	  	var div = d3.select("#vis")
		    .style("background-color", "#FFF")
		  	.style("overflow-x", "hidden")
		  	.style("overflow-y", "hidden")
		  	.style("position", "fixed")
		  	.attr("height", "100%");
	  
		var svg = d3.select("#vis").append("svg")
			.attr("class", "viz_svg")
	  		.attr("preserveAspectRatio", "xMidYMid meet")
	  		.attr("viewBox", `${element.clientWidth/-2} ${element.clientHeight/-2} ${element.clientWidth} ${element.clientHeight*.9}`);
	  
		var g = svg.append("g");
	  	
	  	if (cfg.type == 'radial') {
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
		  	var proportion = mapBetween(cfg.value,0,1,cfg.range[0],cfg.range[1])
		  	var value_angle = cfg.angle*2*proportion - cfg.angle;
		  	var fill_generator = d3.arc()
		      	.innerRadius(cutoutCalc)
		      	.outerRadius(radius)
		      	.startAngle(-cfg.angle * Math.PI * 2 / 360)
		      	.endAngle(value_angle * Math.PI * 2 / 360);
		  	var gauge_fill = g.append('path')
		  		.attr("class", "gaugeFill")
		  		.attr("d", fill_generator)
		  		.attr("fill", cfg.color)
		  		.attr("stroke", "none");
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
		  		.attr("stroke-width", cfg.arm_weight);
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
		  		.attr("stroke-width", cfg.arm_weight);
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
		  		.attr("stroke-width", cfg.spinner_weight);
		  	g.append("circle")
			  	.attr("class", "spinnerCenter")
			  	.attr("r", cfg.spinner_weight)
			    .style("fill", "#282828");
		  	var target_proportion = mapBetween(cfg.target,0,1,cfg.range[0],cfg.range[1])
		  	var tarNeg = target_proportion < .5 ? -1 : 1;
		  	var target_angle = cfg.angle*2*target_proportion - cfg.angle;
		  	var targetSpinner = d3.arc()
		      	.innerRadius(cutoutCalc)
		      	.outerRadius(radius)
		      	.startAngle(target_angle * Math.PI * 2 / 360)
		     	.endAngle(target_angle * Math.PI * 2 / 360);
		  	var targetLine = g.append('path')
		  		.attr("class", "targetSpinner")
		  		.attr("d", targetSpinner)
		  		.attr("stroke", cfg.target_background)
		  		.attr("stroke-width", cfg.target_width)
		  		.attr("stroke-dasharray", radius/10);
		  	var targetLabelArc = d3.arc()
		      	.innerRadius(radius*cfg.targetPadding)
		      	.outerRadius(radius*cfg.targetPadding)
		      	.startAngle(target_angle * Math.PI * 2 / 360)
		     	.endAngle(target_angle * Math.PI * 2 / 360);
		  	var targetLabelLine = g.append('path')
		  		.attr("class", "targetLabel")
		  		.attr("d", targetLabelArc);
		  	g.append('text')
		  		.attr("class", "targetValue")
		  		.text(`$${cfg.target}M last month`)
		  		.style("font-size", "12px")
		  		.style("font-family", "Open Sans")
		  		.attr("x", ()=>{
		  			if (tarNeg > 0) {
		  				return d3.select(".targetLabel").node().getBBox().x;
		  			} else {
		  				return d3.select(".targetLabel").node().getBBox().x - d3.select(".targetValue").node().getBBox().width
		  			}
		  		})
		  		.attr("y", () => {
		  			return d3.select(".targetLabel").node().getBBox().y
		  		});
		  	g.append('text')
		  		.attr("class", "gaugeValue")
		  		.text(`$${cfg.value}M ACV`)
		  		.style("font-size", "22px")
		  		.style("font-family", "Open Sans")
		  		.attr("transform", `translate(${0 - d3.select(".gaugeValue").node().getBBox().width/2} ${0 + cfg.labelPadding})`);
		  	done()
	  	} else if (cfg.type == 'vertical') {
	  		var proportion = mapBetween(cfg.value,0,1,cfg.range[0],cfg.range[1])
	  		g.append("rect")
	  			.attr("class", "vertical-gauge")
	  			.attr("width", 50)
	  			.attr("height", "100%")
	  			.style("fill", cfg.gauge_background)
	  			.attr("x", 0-d3.select(".vertical-gauge").node().getBBox().width/2)
	  			.attr("y", element.clientHeight/-2);
	  		g.append("rect")
	  			.attr("class", "top-arm")
	  			.attr("width", d3.select(".vertical-gauge").attr('width')*(cfg.arm/100+1))
	  			.attr("height", `${cfg.arm_weight}%`)
	  			.attr("z-index", "5")
	  			.style("fill", cfg.gauge_background)
	  			.attr("x", 0-d3.select(".vertical-gauge").node().getBBox().width/2)
	  			.attr("y", element.clientHeight/-2);
	  		g.append("rect")
	  			.attr("class", "bottom-arm")
	  			.attr("width", d3.select(".vertical-gauge").attr('width')*(cfg.arm/100+1))
	  			.attr("height", `${cfg.arm_weight}%`)
	  			.attr("z-index", "5")
	  			.style("fill", cfg.gauge_background)
	  			.attr("x", 0-d3.select(".vertical-gauge").node().getBBox().width/2)
	  			.attr("y", d3.select(".vertical-gauge").node().getBBox().y + d3.select(".vertical-gauge").node().getBBox().height - d3.select(".bottom-arm").node().getBBox().height);
	  		g.append("rect")
	  			.attr("class", "vertical-fill")
	  			.attr("width", d3.select(".vertical-gauge").attr('width'))
	  			.attr("height", `${proportion * (d3.select(".vertical-gauge").node().getBBox().height-d3.select(".top-arm").node().getBBox().height*2)}`)
	  			.style("fill", cfg.color)
	  			.attr("stroke", "none")
	  			.attr("x", 0-d3.select(".vertical-gauge").node().getBBox().width/2)
	  			.attr("y", d3.select(".vertical-gauge").node().getBBox().y + d3.select(".vertical-gauge").node().getBBox().height - d3.select(".vertical-fill").node().getBBox().height - d3.select(".bottom-arm").node().getBBox().height);
	  		g.append("rect")
	  			.attr("class", "value-line")
	  			.attr("width", d3.select(".vertical-gauge").attr('width')*1.2)
	  			.attr("height", "4%")
	  			.style("fill", cfg.spinner_background)
	  			.attr("x", 0-d3.select(".vertical-gauge").attr('width')*0.7)
	  			.attr("y", d3.select(".vertical-fill").attr('y'));
	  		g.append("text")
	  			.attr("class", "value-label")
	  			.text(LookerCharts.Utils.textForCell({value: cfg.value}))
	  			.attr("dy", ".7em")
	  			.attr("dx", "-.35em")
	  			.style("font-family", "Open Sans")
	  			.style("font-size", "30px")
	  			.attr("x", 0-d3.select(".vertical-gauge").attr('width')/2-d3.select(".value-label").node().getBBox().width)
	  			.attr("y", d3.select(".vertical-fill").attr('y'));
	  		g.append("text")
	  			.attr("class", "value-label-label")
	  			.text(cfg.value_label)
	  			.attr("dx", "-.35em")
	  			.attr("dy", ".35em")
	  			.style("font-family", "Open Sans")
	  			.style("font-size", "20px")
	  			.attr("x", 0-d3.select(".vertical-gauge").attr('width')/2-d3.select(".value-label-label").node().getBBox().width)
	  			.attr("y", d3.select(".value-label").node().getBBox().y + d3.select(".value-label").node().getBBox().height);
	  		var target_proportion = mapBetween(cfg.target,0,1,cfg.range[0],cfg.range[1])
	  		g.append("rect")
	  			.attr("class", "target-fill")
	  			.attr("width", d3.select(".vertical-gauge").attr('width'))
	  			.attr("height", `${target_proportion * (d3.select(".vertical-gauge").node().getBBox().height-d3.select(".top-arm").node().getBBox().height*2)}`)
	  			.style("fill", "none")
	  			.attr("x", 0-d3.select(".vertical-gauge").node().getBBox().width/2)
	  			.attr("y", d3.select(".vertical-gauge").node().getBBox().y + d3.select(".vertical-gauge").node().getBBox().height - d3.select(".target-fill").node().getBBox().height - d3.select(".bottom-arm").node().getBBox().height);
	  		g.append("line")
	  			.attr("class", "target-line")
	  			.attr("stroke-width", "4")
	  			.attr("fill", "none")
	  			.style("stroke", cfg.target_background)
	  			.attr("stroke-dasharray", "5")
	  			.attr("x1", 0-d3.select(".vertical-gauge").attr('width')*0.5)
	  			.attr("y1", d3.select(".target-fill").attr('y'))
	  			.attr("x2", 0+d3.select(".vertical-gauge").attr('width')*0.7)
	  			.attr("y2", d3.select(".target-fill").attr('y'));
	  		g.append("text")
	  			.attr("class", "target-label")
	  			.text(LookerCharts.Utils.textForCell({value: cfg.target}))
	  			.attr("dy", ".7em")
	  			.style("font-family", "Open Sans")
	  			.style("font-size", "20px")
	  			.attr("x", 0+d3.select(".vertical-gauge").attr('width')*3/4)
	  			.attr("y", d3.select(".target-fill").attr('y'));
	  		g.append("text")
	  			.attr("class", "target-label-label")
	  			.text(cfg.target_label)
	  			.attr("dy", ".35em")
	  			.style("font-family", "Open Sans")
	  			.style("font-size", "12px")
	  			.attr("x", 0+d3.select(".vertical-gauge").attr('width')*3/4)
	  			.attr("y", d3.select(".target-label").node().getBBox().y + d3.select(".target-label").node().getBBox().height);
	  	} else if (cfg.type == 'horizontal') {

	  	}
	  	doneRendering()
	}
};

looker.plugins.visualizations.add(visObject);
