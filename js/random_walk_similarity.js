 var rw_colors = d3.scaleLinear([0.95, 0.975, 1], ["#ed3faa", "white", "#3fed82"])


// set the dimensions and margins of the graph
var margin = {top: 0, right: 10, bottom: 10, left: 10},
    width = 650 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#random_walk")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function graph(data) {

    const pos_scale = 30;
    const posx_offset = 300;
    const posy_offset = 200;
    
    var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
        .style("stroke", "#aaa")
        .style("stroke-width", 2)

    var nodes = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
        .attr("r", 10)
        .attr("fill", "white")
        .attr("id", function(d,i) { return i; })
        .attr("stroke", "rgb(170, 170, 170)").style('stroke-width', 3)
        .attr("cx", function (d) { return posx_offset+pos_scale*d.ox; })
        .attr("cy", function(d) { return posy_offset+pos_scale*d.oy; });

    var simulation = d3.forceSimulation(data.nodes) 
        .force("link", d3.forceLink()               
            .id(function(d) { return d.id; })    
            .links(data.links)            
        )
        .on("end", ticked);

    function ticked() {
    link
        .attr("x1", function(d) {return posx_offset+pos_scale*d.source.ox; })
        .attr("y1", function(d) { return posy_offset+pos_scale*d.source.oy; })
        .attr("x2", function(d) { return posx_offset+pos_scale*d.target.ox; })
        .attr("y2", function(d) { return posy_offset+pos_scale*d.target.oy; });
    }

    nodes
    .on('mouseover', function (d) {
        index=this.__data__.id;
        d3.select(this).style('stroke-width', 5).attr("r", 11)
        nodes.style("fill", function(d) {return rw_colors(d.random_walk[index])});
    }).on('mouseout', function (d) {d3.select(this).style('stroke-width', 3).attr("r", 10)})

}

graph(data)