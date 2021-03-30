// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 200};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 350;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = graph_2_width * 3 / 4;
let graph_3_width = (MAX_WIDTH / 2), graph_3_height = 575;

let file_1 = "./data/video_games.csv";
let file_2 = "./data/continents.json";
let file_3 = "./data/top_publishers.csv";

let svg_1 = d3.select("#graph1")
	.append("svg")
	.attr("width", graph_1_width)
	.attr("height", graph_1_height)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let countRef = svg_1.append("g");

function graph_one(filename, num) {

	d3.csv(filename).then(function(data) {

		data = data.sort(function(a, b) {return b.Global_Sales - a.Global_Sales}).slice(0, num);

		// Create Y axis
		let names = data.map(function(d) {return d.Name});
		let y = d3.scaleBand().domain(names).range([0, graph_1_height - margin.top - margin.bottom]).padding(0.1);

		svg_1.append("g").call(d3.axisLeft(y).tickSize(0).tickPadding(10));

		// Create X axis
		let x_max = d3.max(data, function(d) {return d.Global_Sales});
		let x = d3.scaleLinear().domain([0, x_max]).range([0, graph_1_width - margin.left - margin.right]);

		let bars = svg_1.selectAll("rect").data(data);

		bars.enter()
			.append("rect")
			.merge(bars)
			.transition()
			.duration(1000)
			.attr("fill", "#008BFF")
			.attr("x", x(0))
			.attr("y", function(d) {return y(d.Name)})
			.attr("width", function(d) {return x(parseFloat(d.Global_Sales))})
			.attr("height", y.bandwidth());

		let counts = countRef.selectAll("text").data(data);

		counts.enter()
			.append("text")
			.merge(counts)
			.transition()
			.duration(1000)
			.attr("x", function(d) {return x(parseFloat(d.Global_Sales)) + 10})
			.attr("y", function(d) {return y(d.Name) + 16})
			.style("text-anchor", "start")
			.text(function(d) {return d.Global_Sales});

		let x1_center = (graph_1_width - margin.left - margin.right) / 2;
		let x1_label_bottom = (graph_1_height - margin.top) * 0.95;

		// X axis label
		svg_1.append("text")
			.attr("transform", "translate(" + x1_center + "," + x1_label_bottom +")")
			.style("text-anchor", "middle")
			.style("font-size", 16)
			.text("Global Sales (in millions)");

		let y1_center = (graph_1_height - margin.top - margin.bottom) / 2;

		// Y axis label
		svg_1.append("text")
			.attr("transform", "translate(-" + (margin.left - 40) + ","  + y1_center + ")rotate(-90)")
			.style("text-anchor", "middle")
			.style("font-size", 16)
			.text("Video Game Title");

		// Graph 1 Title
		svg_1.append("text")
			.attr("transform", "translate(" + x1_center + ",-" +  ((margin.top / 2) - 10) + ")")
			.style("text-anchor", "middle")
			.style("font-size", 19)
			.style("font-weight", "bold")
			.text("Top 10 Video Games of All Time");

	});
};

var svg_2 = d3.select("#graph2").append("svg")
	.attr("width", graph_2_width)
	.attr("height", graph_2_height)
	.append("g")
	.attr("transform", "translate(0," + margin.top + ")");

var projection = d3.geoNaturalEarth()
	.scale(graph_2_width / 1.4 / Math.PI)
	.translate([graph_2_width / 2 - 16, graph_2_height / 2]);

var path = d3.geoPath().projection(projection);

// Create and format tooltip
var tooltip = d3.select("body").append("div")
	.attr("id", "tooltipDiv")
	.attr("class", "tooltip")
	.style("position", "absolute")
	.style("opacity", 0)
	.style("background-color", "white")
	.style("padding", "2px")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("font-size", "14px");

// Color continent depending on most popular genre
function colorContinent(c) {
	if (c.properties.CONTINENT == "North America" || c.properties.CONTINENT == "Europe") {
		return "#FF3F3F";
	} else if (c.properties.CONTINENT == "Japan") {
		return "#002EFF";
	} else {
		return "#D3D3D3";
	}
};

function graph_two(filename) {

	d3.json(filename).then(function(data) {

		var continents = svg_2.selectAll("path").data(data.features);

		continents.enter().append("path")
			.attr("class", "continent")
			.attr("d", path)
			.attr("fill", function(d) {return colorContinent(d)})
			.on("mouseover", function(d) { // Tooltip implementation
				d3.select("#tooltipDiv").style("opacity", 1).text("Top Genre: " + d.genre)})
			.on("mouseout", function() {
				d3.select("#tooltipDiv").style("opacity", 0)})
			.on("mousemove", function() {
				d3.select("#tooltipDiv")
				.style("left", (d3.event.pageX - 55) + "px")
				.style("top", (d3.event.pageY - 35) + "px")
			});

		// Creation of map legend 
		svg_2.append("circle")
			.attr("cx", graph_2_width * 7 / 10)
			.attr("cy", graph_2_height * 4 / 7)
			.attr("r", 5).style("fill", "#FF3F3F");

		svg_2.append("text")
			.attr("transform", "translate(" + (graph_2_width * 7 / 10 + 12) + "," + (graph_2_height * 4 / 7 + 5) + ")")
			.style("text-anchor", "start")
			.text("Action")

		svg_2.append("circle")
			.attr("cx", graph_2_width * 7 / 10)
			.attr("cy", graph_2_height * 6 / 10)
			.attr("r", 5).style("fill", "#002EFF");

		svg_2.append("text")
			.attr("transform", "translate(" + (graph_2_width * 7 / 10 + 12) + "," + (graph_2_height * 6 / 10 + 5) + ")")
			.style("text-anchor", "start")
			.text("Role-Playing")

		let x2_center = graph_2_width / 2;

		// Graph 2 Title
		svg_2.append("text")
			.attr("transform", "translate(" + x2_center + "," + (margin.top / 2 + 12) + ")")
			.style("text-anchor", "middle")
			.style("font-size", 19)
			.style("font-weight", "bold")
			.text("Top Genres in the NA, EU, and JP Regions");
	});
};

let svg_3 = d3.select("#graph3")
	.append("svg")
    .attr("width", graph_3_width)    
    .attr("height", graph_3_height + 110)     
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + 5) + ")");    

let width_3 = graph_3_width - margin.left - margin.right;
let height_3 = graph_3_height - margin.top - margin.bottom;
let x3 = d3.scaleBand().range([0, width_3]).padding(0.1);
let y3 = d3.scaleLinear().range([height_3, 0]);

let countRef3 = svg_3.append("g");
let x_axis = svg_3.append("g");
let y_axis = svg_3.append("g");

// X axis label 
svg_3.append("text")
	.attr("transform", "translate(" + (width_3 / 2) + "," + (graph_3_height + 30) + ")")       
	.style("text-anchor", "middle")
	.style("font-size", 16)
	.text("Publishers");

// Y axis label
svg_3.append("text")
    .attr("transform", "translate(-50," + (height_3 / 2) + ")rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .text("Global Sales (in millions)");

// Graph 3 Title 
let title3 = svg_3.append("text")
    .attr("transform", "translate(" + (width_3 / 2) + ",-30)")       
    .style("text-anchor", "middle")
    .style("font-size", 19)
    .style("font-weight", "bold");

function graph_three(filename, genre, num) {

	d3.csv(filename).then(function(data) {

		data = data.filter(function(d) {return d.Genre == genre})
			.sort(function(a,b) {return b.Global_Sales - a.Global_Sales})
			.slice(0, num);

		var y_max = d3.max(data, function(d) {return parseFloat(d.Global_Sales)});
		y3.domain([0, y_max]);

		var names = data.map(function(d) {return d.Publisher});
		x3.domain(names);

		x_axis.attr("transform", "translate(0, " + height_3 + ")")
			.call(d3.axisBottom(x3).tickPadding(10))
			.selectAll("text").attr("transform", "translate(-10, 0)rotate(-25)")
			.style("text-anchor", "end");

		y_axis.call(d3.axisLeft(y3));
		title3.text("Top Publishers in the " + genre + " Genre");

		let bars = svg_3.selectAll("rect").data(data);
		bars.enter()
			.append("rect")
			.merge(bars)
			.transition()
			.duration(1000)
			.attr("x", function(d) {return x3(d.Publisher)})
			.attr("y", function(d) {return y3(parseFloat(d.Global_Sales))})
			.attr("width", x3.bandwidth())
			.attr("height", function(d) {return height_3 - y3(parseFloat(d.Global_Sales))})
			.attr("fill", "#FFC500");

		let counts = countRef3.selectAll("text").data(data);
		counts.enter()
			.append("text")
			.merge(counts)
			.transition()
			.duration(1000)
			.attr("x", function(d) {return x3(d.Publisher) + (width_3 / 40) - 5})
			.attr("y", function(d) {return y3(parseFloat(d.Global_Sales)) - 5})
			.style("text-anchor", "start")
			.text(function(d) {return parseFloat(d.Global_Sales).toFixed(0)});
	});
};

// Allows for graph 3 to update when selecting a new genre
function changeGenre(g) {
	var genre = g.options[g.selectedIndex].value;
	graph_three(file_3, genre, 10);
};

// Initialize the three graphs for the assignment
graph_one(file_1, 10);
graph_two(file_2);
graph_three(file_3, "Action", 10);