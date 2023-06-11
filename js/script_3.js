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
    const X = d3.map(nodes, d => d.x).map(intern);
    const Y = d3.map(nodes, d => d.y).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
  
    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i], x: X[i], y: Y[i]}));
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
        .attr('cx', function(d){return d;})
        .attr('cy', function(d){return d;})
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

onion = {"directed": false, "multigraph": false, "graph": {}, "nodes": [{"id": 2, "x": 50.0, "y": -1.9989362553501485e-07}, {"id": 37, "x": 49.41402077744081, "y": 7.632464706604979}, {"id": 54, "x": 47.669819000135504, "y": 15.08603074236992}, {"id": 3, "x": 44.80827749388723, "y": 22.18599147836447}, {"id": 51, "x": 40.896466385150276, "y": 28.765934471862607}, {"id": 58, "x": 36.02608145933879, "y": 34.671625254109586}, {"id": 4, "x": 30.3112715715273, "y": 39.76464246859089}, {"id": 44, "x": 23.885989219993547, "y": 43.925612913123636}, {"id": 7, "x": 16.900841930861976, "y": 47.057002527344785}, {"id": 17, "x": 9.519558447730772, "y": 49.085414151764645}, {"id": 61, "x": 1.9151390166819815, "y": 49.963310101998744}, {"id": 8, "x": -5.734169417352193, "y": 49.670105913998206}, {"id": 18, "x": -13.249072357808858, "y": 48.212674003297536}, {"id": 9, "x": -20.453430629004192, "y": 45.625182732473846}, {"id": 13, "x": -27.178382782372857, "y": 41.96826790658553}, {"id": 36, "x": -33.266284963482974, "y": 37.327661866344}, {"id": 10, "x": -38.574463024420346, "y": 31.812119246477987}, {"id": 65, "x": -42.97848034843437, "y": 25.55093444228153}, {"id": 66, "x": -46.37511957228942, "y": 18.690858559366664}, {"id": 12, "x": -48.68477273251752, "y": 11.392674381767035}, {"id": 29, "x": -49.853289009404186, "y": 3.8274669838245075}, {"id": 24, "x": -49.853289009404186, "y": -3.8274644033795235}, {"id": 38, "x": -48.68477273251752, "y": -11.39267180132205}, {"id": 14, "x": -46.37512255252166, "y": -18.69085597892168}, {"id": 39, "x": -42.978483328666606, "y": -25.550928881604307}, {"id": 15, "x": -38.574457063955876, "y": -31.81212262649747}, {"id": 56, "x": -33.26628794371521, "y": -37.32765928589902}, {"id": 47, "x": -27.17838576260509, "y": -41.96826532614054}, {"id": 16, "x": -20.453423178423606, "y": -45.625186112493324}, {"id": 42, "x": -13.249070867692742, "y": -48.212677383317015}, {"id": 55, "x": -5.7341723975844285, "y": -49.67010333355322}, {"id": 28, "x": 1.9151298897207611, "y": -49.96331050178599}, {"id": 31, "x": 9.519566643369421, "y": -49.08541455155189}, {"id": 32, "x": 16.900849381442566, "y": -47.0569999468998}, {"id": 33, "x": 23.885990710109663, "y": -43.92561331291088}, {"id": 40, "x": 30.311265611062833, "y": -39.76464584861038}, {"id": 59, "x": 36.02607251864209, "y": -34.6716316143613}, {"id": 43, "x": 40.89647234561475, "y": -28.765925930953145}, {"id": 67, "x": 44.80827749388723, "y": -22.185990388035606}, {"id": 49, "x": 47.669819000135504, "y": -15.086034122389409}, {"id": 64, "x": 49.41402077744081, "y": -7.632473302030876}, {"id": 0, "x": 33.33333333333333, "y": 6.126142394931732e-07}, {"id": 45, "x": -5.795444194080306e-07, "y": 33.33333306844575}, {"id": 25, "x": -33.33333157832969, "y": -2.3014782362423765e-06}, {"id": 23, "x": 0.0, "y": 0.0}, {"id": 26, "x": -23.57022612499649, "y": -23.570222416241187}, {"id": 52, "x": -23.57022413817505, "y": 23.57022562829111}, {"id": 30, "x": 23.570221919535804, "y": -23.57022837670551}, {"id": 35, "x": 23.570225893178687, "y": 23.57022562829111}, {"id": 60, "x": 1.2749978292790748e-06, "y": -33.33333184321727}, {"id": 63, "x": 7.725427529973612, "y": -23.77641271878519}, {"id": 21, "x": -20.225424922270324, "y": -14.69463302775124}, {"id": 11, "x": 7.725423804683203, "y": 23.776414208901354}, {"id": 50, "x": -20.225426412386486, "y": 14.694631537635075}, {"id": 69, "x": 25.0, "y": 0.0}, {"id": 20, "x": -19.999999403953595, "y": -1.3113416199418567e-06}, {"id": 68, "x": 10.0, "y": 4.371138828673793e-07}, {"id": 34, "x": -7.152952118603109e-07, "y": 20.0}, {"id": 22, "x": 3.974301423251239e-07, "y": -19.999999125772256}, {"id": 41, "x": 19.99999972181866, "y": 4.371138733139522e-07}, {"id": 62, "x": 2.2079452351395768e-07, "y": -11.11111062542903}, {"id": 6, "x": -8.333332091569888, "y": -14.433757276340561}, {"id": 19, "x": -11.111110779974217, "y": -7.285231221899203e-07}, {"id": 27, "x": 11.111110956565923, "y": 2.428410407299734e-07}, {"id": 48, "x": 16.666666666666664, "y": 3.311369187083865e-07}, {"id": 1, "x": -8.333334575096778, "y": 14.433756945203644}, {"id": 46, "x": -10.0, "y": -4.371138828673793e-07}, {"id": 57, "x": -3.973862288112838e-07, "y": 11.11111111111111}, {"id": 5, "x": -12.5, "y": -5.463923535842241e-07}, {"id": 53, "x": 12.5, "y": 5.463923535842241e-07}], "links": [{"source": 2, "target": 37}, {"source": 2, "target": 54}, {"source": 37, "target": 31}, {"source": 54, "target": 4}, {"source": 3, "target": 51}, {"source": 3, "target": 58}, {"source": 51, "target": 32}, {"source": 58, "target": 31}, {"source": 4, "target": 44}, {"source": 44, "target": 8}, {"source": 7, "target": 17}, {"source": 7, "target": 61}, {"source": 17, "target": 55}, {"source": 61, "target": 33}, {"source": 8, "target": 18}, {"source": 18, "target": 14}, {"source": 9, "target": 13}, {"source": 9, "target": 36}, {"source": 13, "target": 38}, {"source": 36, "target": 40}, {"source": 10, "target": 65}, {"source": 10, "target": 66}, {"source": 65, "target": 43}, {"source": 66, "target": 33}, {"source": 12, "target": 29}, {"source": 12, "target": 24}, {"source": 29, "target": 28}, {"source": 24, "target": 42}, {"source": 38, "target": 28}, {"source": 14, "target": 39}, {"source": 39, "target": 56}, {"source": 15, "target": 56}, {"source": 15, "target": 47}, {"source": 47, "target": 32}, {"source": 16, "target": 42}, {"source": 16, "target": 55}, {"source": 40, "target": 59}, {"source": 59, "target": 49}, {"source": 43, "target": 67}, {"source": 67, "target": 64}, {"source": 49, "target": 64}, {"source": 0, "target": 45}, {"source": 0, "target": 25}, {"source": 0, "target": 23}, {"source": 45, "target": 26}, {"source": 45, "target": 30}, {"source": 25, "target": 26}, {"source": 25, "target": 52}, {"source": 23, "target": 1}, {"source": 23, "target": 48}, {"source": 23, "target": 68}, {"source": 23, "target": 5}, {"source": 23, "target": 27}, {"source": 23, "target": 46}, {"source": 26, "target": 30}, {"source": 52, "target": 30}, {"source": 52, "target": 35}, {"source": 35, "target": 60}, {"source": 35, "target": 63}, {"source": 60, "target": 63}, {"source": 60, "target": 21}, {"source": 63, "target": 11}, {"source": 63, "target": 21}, {"source": 21, "target": 11}, {"source": 21, "target": 50}, {"source": 11, "target": 50}, {"source": 11, "target": 69}, {"source": 50, "target": 69}, {"source": 50, "target": 20}, {"source": 69, "target": 68}, {"source": 69, "target": 34}, {"source": 20, "target": 34}, {"source": 20, "target": 22}, {"source": 20, "target": 41}, {"source": 20, "target": 62}, {"source": 68, "target": 1}, {"source": 68, "target": 48}, {"source": 68, "target": 5}, {"source": 68, "target": 53}, {"source": 34, "target": 22}, {"source": 34, "target": 41}, {"source": 34, "target": 6}, {"source": 22, "target": 41}, {"source": 22, "target": 6}, {"source": 22, "target": 19}, {"source": 41, "target": 27}, {"source": 41, "target": 48}, {"source": 62, "target": 48}, {"source": 62, "target": 5}, {"source": 62, "target": 53}, {"source": 6, "target": 1}, {"source": 6, "target": 48}, {"source": 6, "target": 57}, {"source": 6, "target": 19}, {"source": 19, "target": 5}, {"source": 19, "target": 53}, {"source": 27, "target": 1}, {"source": 27, "target": 5}, {"source": 27, "target": 53}, {"source": 48, "target": 1}, {"source": 1, "target": 46}, {"source": 46, "target": 5}, {"source": 46, "target": 53}, {"source": 57, "target": 5}, {"source": 57, "target": 53}, {"source": 5, "target": 53}]}

  chart = ForceGraph(onion, {
    nodeId: d => d.id,
    nodeGroup: d => d.group,
    nodeTitle: d => `${d.id}\n${d.group}`,
    linkStrokeWidth: l => Math.sqrt(l.value),
    width: 1600,
    height: 1600,
  })