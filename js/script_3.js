// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
function ForceGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
  }, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 5, // node radius, in pixels
    nodeStrength,
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    invalidation // when this promise resolves, stop the simulation
  } = {}) {
    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
  
    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));
  
    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
  
    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
  
    const simulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center",  d3.forceCenter())
        .on("tick", ticked);
  
    const body = d3.select("#my_dataviz");

    const svg = body.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    const link = svg.append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
      .selectAll("line")
      .data(links)
      .join("line");
  
    const node = svg.append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", nodeRadius)
        .call(drag(simulation));
  
    if (W) link.attr("stroke-width", ({index: i}) => W[i]);
    if (L) link.attr("stroke", ({index: i}) => L[i]);
    if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (T) node.append("title").text(({index: i}) => T[i]);
    if (invalidation != null) invalidation.then(() => simulation.stop());
  
    function intern(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }
  
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
  
    function drag(simulation) {    
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  
    return Object.assign(svg.node(), {scales: {color}});
  }

onion = {"directed": false, "multigraph": false, "graph": {}, "nodes": [{"id": 0}, {"id": 44}, {"id": 16}, {"id": 1}, {"id": 35}, {"id": 59}, {"id": 2}, {"id": 63}, {"id": 29}, {"id": 3}, {"id": 10}, {"id": 5}, {"id": 56}, {"id": 18}, {"id": 8}, {"id": 17}, {"id": 62}, {"id": 9}, {"id": 40}, {"id": 68}, {"id": 14}, {"id": 34}, {"id": 15}, {"id": 51}, {"id": 52}, {"id": 60}, {"id": 22}, {"id": 55}, {"id": 26}, {"id": 57}, {"id": 30}, {"id": 27}, {"id": 67}, {"id": 38}, {"id": 39}, {"id": 48}, {"id": 61}, {"id": 7}, {"id": 45}, {"id": 53}, {"id": 20}, {"id": 13}, {"id": 32}, {"id": 47}, {"id": 43}, {"id": 41}, {"id": 6}, {"id": 12}, {"id": 58}, {"id": 24}, {"id": 46}, {"id": 54}, {"id": 28}, {"id": 25}, {"id": 50}, {"id": 42}, {"id": 65}, {"id": 66}, {"id": 37}, {"id": 11}, {"id": 36}, {"id": 33}, {"id": 31}, {"id": 49}, {"id": 69}, {"id": 64}, {"id": 21}, {"id": 4}, {"id": 19}, {"id": 23}], "links": [{"source": 0, "target": 44}, {"source": 0, "target": 16}, {"source": 44, "target": 3}, {"source": 16, "target": 52}, {"source": 1, "target": 35}, {"source": 1, "target": 59}, {"source": 35, "target": 15}, {"source": 59, "target": 30}, {"source": 2, "target": 63}, {"source": 2, "target": 29}, {"source": 63, "target": 38}, {"source": 29, "target": 14}, {"source": 3, "target": 10}, {"source": 10, "target": 68}, {"source": 5, "target": 56}, {"source": 5, "target": 18}, {"source": 56, "target": 38}, {"source": 18, "target": 60}, {"source": 8, "target": 17}, {"source": 8, "target": 62}, {"source": 17, "target": 9}, {"source": 62, "target": 22}, {"source": 9, "target": 40}, {"source": 40, "target": 39}, {"source": 68, "target": 39}, {"source": 14, "target": 34}, {"source": 34, "target": 57}, {"source": 15, "target": 51}, {"source": 51, "target": 67}, {"source": 52, "target": 61}, {"source": 52, "target": 13}, {"source": 60, "target": 48}, {"source": 22, "target": 55}, {"source": 55, "target": 27}, {"source": 26, "target": 57}, {"source": 26, "target": 30}, {"source": 27, "target": 67}, {"source": 48, "target": 61}, {"source": 7, "target": 45}, {"source": 7, "target": 53}, {"source": 7, "target": 20}, {"source": 45, "target": 32}, {"source": 45, "target": 41}, {"source": 53, "target": 41}, {"source": 53, "target": 43}, {"source": 20, "target": 13}, {"source": 20, "target": 47}, {"source": 13, "target": 32}, {"source": 32, "target": 43}, {"source": 47, "target": 41}, {"source": 47, "target": 43}, {"source": 6, "target": 12}, {"source": 6, "target": 58}, {"source": 6, "target": 24}, {"source": 6, "target": 46}, {"source": 12, "target": 24}, {"source": 12, "target": 58}, {"source": 12, "target": 54}, {"source": 58, "target": 24}, {"source": 58, "target": 46}, {"source": 24, "target": 46}, {"source": 46, "target": 28}, {"source": 54, "target": 25}, {"source": 54, "target": 28}, {"source": 54, "target": 42}, {"source": 54, "target": 50}, {"source": 28, "target": 25}, {"source": 28, "target": 42}, {"source": 28, "target": 50}, {"source": 25, "target": 50}, {"source": 25, "target": 42}, {"source": 25, "target": 65}, {"source": 50, "target": 42}, {"source": 50, "target": 37}, {"source": 42, "target": 66}, {"source": 65, "target": 11}, {"source": 65, "target": 31}, {"source": 65, "target": 33}, {"source": 65, "target": 36}, {"source": 65, "target": 19}, {"source": 66, "target": 23}, {"source": 37, "target": 36}, {"source": 37, "target": 19}, {"source": 37, "target": 21}, {"source": 37, "target": 64}, {"source": 37, "target": 49}, {"source": 37, "target": 4}, {"source": 11, "target": 36}, {"source": 11, "target": 33}, {"source": 11, "target": 31}, {"source": 11, "target": 49}, {"source": 11, "target": 69}, {"source": 36, "target": 31}, {"source": 36, "target": 33}, {"source": 36, "target": 69}, {"source": 33, "target": 31}, {"source": 33, "target": 4}, {"source": 33, "target": 19}, {"source": 31, "target": 64}, {"source": 31, "target": 21}, {"source": 49, "target": 64}, {"source": 49, "target": 4}, {"source": 49, "target": 69}, {"source": 49, "target": 23}, {"source": 69, "target": 19}, {"source": 69, "target": 21}, {"source": 69, "target": 64}, {"source": 69, "target": 4}, {"source": 69, "target": 23}, {"source": 64, "target": 19}, {"source": 64, "target": 21}, {"source": 64, "target": 4}, {"source": 21, "target": 19}, {"source": 21, "target": 23}, {"source": 21, "target": 4}, {"source": 4, "target": 19}, {"source": 4, "target": 23}]}


  chart = ForceGraph(onion, {
    nodeId: d => d.id,
    nodeGroup: d => d.group,
    nodeTitle: d => `${d.id}\n${d.group}`,
    linkStrokeWidth: l => Math.sqrt(l.value),
    width: 1600,
    height: 1600,
  })