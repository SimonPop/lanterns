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

    // const forcePostionX = forceX
    // const forcePostionX = forceY

    d3.forceRadial(100, 100)

    // const forceNode = d3.forceManyBody();
    const forceNode = d3.forceRadial(d => d.radius*100, 100, 100).strength(0.1);
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
  
    const simulation = d3.forceSimulation(nodes)
        // .force("link", forceLink)
        .force("radial", forceNode)
        // .force("center",  d3.forceCenter())
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
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
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

onion = {"directed": false, "multigraph": false, "graph": {}, "nodes": [{"id": 0, "x": 50.0, "y": -2.1264787370481903e-07, "radius": 2.0, "color": "#9ecae1"}, {"id": 33, "x": -41.573478316100385, "y": -27.778514990810976, "radius": 2.0, "color": "#9ecae1"}, {"id": 63, "x": 41.57347990554931, "y": -27.778514990810976, "radius": 2.0, "color": "#9ecae1"}, {"id": 1, "x": 49.0392625484583, "y": 9.75451581663906, "radius": 2.0, "color": "#9ecae1"}, {"id": 16, "x": -9.754515234562469, "y": 49.03926154108596, "radius": 2.0, "color": "#9ecae1"}, {"id": 37, "x": -27.778519943903024, "y": -41.57347336300834, "radius": 2.0, "color": "#9ecae1"}, {"id": 5, "x": 46.19397527068464, "y": 19.134172280427286, "radius": 2.0, "color": "#9ecae1"}, {"id": 30, "x": -46.19397368123571, "y": -19.13417270572303, "radius": 2.0, "color": "#9ecae1"}, {"id": 28, "x": -49.039263939241565, "y": -9.754512516644569, "radius": 2.0, "color": "#9ecae1"}, {"id": 6, "x": 41.57347990554931, "y": 27.778511585283038, "radius": 2.0, "color": "#9ecae1"}, {"id": 18, "x": -27.778508022974258, "y": 41.57348187840916, "radius": 2.0, "color": "#9ecae1"}, {"id": 7, "x": 35.35533868701594, "y": 35.3553376796436, "radius": 2.0, "color": "#9ecae1"}, {"id": 64, "x": 46.19397825091683, "y": -19.134171215606937, "radius": 2.0, "color": "#9ecae1"}, {"id": 8, "x": 27.778512592655375, "y": 41.57347889817697, "radius": 2.0, "color": "#9ecae1"}, {"id": 60, "x": 27.778500671726608, "y": -41.5734852839371, "radius": 2.0, "color": "#9ecae1"}, {"id": 10, "x": 19.134173287799623, "y": 46.193974263312306, "radius": 2.0, "color": "#9ecae1"}, {"id": 17, "x": -19.134168718118502, "y": 46.193977243544495, "radius": 2.0, "color": "#9ecae1"}, {"id": 13, "x": 9.754518314127495, "y": 49.03926154108596, "radius": 2.0, "color": "#9ecae1"}, {"id": 21, "x": -35.35533709756701, "y": 35.3553376796436, "radius": 2.0, "color": "#9ecae1"}, {"id": 15, "x": -1.3908449143373766e-06, "y": 49.99999899262767, "radius": 2.0, "color": "#9ecae1"}, {"id": 55, "x": 19.134179248264008, "y": -46.193971708375855, "radius": 2.0, "color": "#9ecae1"}, {"id": 61, "x": 35.35533272655155, "y": -35.355344065403735, "radius": 2.0, "color": "#9ecae1"}, {"id": 22, "x": -41.573481296332574, "y": 27.778508605050845, "radius": 2.0, "color": "#9ecae1"}, {"id": 46, "x": -9.75451821479466, "y": -49.03926196638171, "radius": 2.0, "color": "#9ecae1"}, {"id": 23, "x": -46.19397368123571, "y": 19.13417377054338, "radius": 2.0, "color": "#9ecae1"}, {"id": 50, "x": 9.754521294359686, "y": -49.03926196638171, "radius": 2.0, "color": "#9ecae1"}, {"id": 24, "x": -49.039263939241565, "y": 9.754515071581011, "radius": 2.0, "color": "#9ecae1"}, {"id": 66, "x": 49.03926552869049, "y": -9.754511026528473, "radius": 2.0, "color": "#9ecae1"}, {"id": 26, "x": -49.99999841055107, "y": -4.583786632901593e-06, "radius": 2.0, "color": "#9ecae1"}, {"id": 35, "x": -35.355340077799205, "y": -35.35533512470715, "radius": 2.0, "color": "#9ecae1"}, {"id": 41, "x": -19.134177658815076, "y": -46.193971708375855, "radius": 2.0, "color": "#9ecae1"}, {"id": 49, "x": 1.3909684877091684e-06, "y": -49.999999417923405, "radius": 2.0, "color": "#9ecae1"}, {"id": 53, "x": -16.66666268475632, "y": -28.867513693100598, "radius": 3.0, "color": "#c6dbef"}, {"id": 32, "x": 33.33333333333333, "y": 6.56762177153692e-07, "radius": 3.0, "color": "#c6dbef"}, {"id": 3, "x": 28.867513030826768, "y": 16.666666989536118, "radius": 3.0, "color": "#c6dbef"}, {"id": 67, "x": -7.892608038514964e-07, "y": 33.33333332231007, "radius": 3.0, "color": "#c6dbef"}, {"id": 4, "x": 16.666666007148663, "y": 28.867515006624956, "radius": 3.0, "color": "#c6dbef"}, {"id": 39, "x": -16.666667651809952, "y": 28.867513019803496, "radius": 3.0, "color": "#c6dbef"}, {"id": 62, "x": 16.666664020327207, "y": -28.867513693100598, "radius": 3.0, "color": "#c6dbef"}, {"id": 45, "x": -33.33333199776244, "y": -2.2573303169158453e-06, "radius": 3.0, "color": "#c6dbef"}, {"id": 31, "x": 28.86751104400531, "y": -16.666671636476128, "radius": 3.0, "color": "#c6dbef"}, {"id": 58, "x": 1.0652814565034457e-06, "y": -33.33333200878571, "radius": 3.0, "color": "#c6dbef"}, {"id": 40, "x": -28.86751169525588, "y": 16.666668976357574, "radius": 3.0, "color": "#c6dbef"}, {"id": 52, "x": -28.867513682077334, "y": -16.66666468260104, "radius": 3.0, "color": "#c6dbef"}, {"id": 9, "x": -20.225424922270324, "y": -14.69463302775124, "radius": 4.0, "color": "#e6550d"}, {"id": 34, "x": 25.0, "y": 0.0, "radius": 4.0, "color": "#e6550d"}, {"id": 57, "x": 7.725427529973612, "y": -23.77641271878519, "radius": 4.0, "color": "#e6550d"}, {"id": 36, "x": 7.725423804683203, "y": 23.776414208901354, "radius": 4.0, "color": "#e6550d"}, {"id": 68, "x": -20.225426412386486, "y": 14.694631537635075, "radius": 4.0, "color": "#e6550d"}, {"id": 11, "x": -7.152952118603109e-07, "y": 20.0, "radius": 5.0, "color": "#fd8d3c"}, {"id": 54, "x": 3.974301423251239e-07, "y": -19.999999125772256, "radius": 5.0, "color": "#fd8d3c"}, {"id": 69, "x": -19.999999403953595, "y": -1.3113416199418567e-06, "radius": 5.0, "color": "#fd8d3c"}, {"id": 43, "x": 19.99999972181866, "y": 4.371138733139522e-07, "radius": 5.0, "color": "#fd8d3c"}, {"id": 44, "x": -8.333334575096778, "y": 14.433756945203644, "radius": 6.0, "color": "#fdae6b"}, {"id": 56, "x": 14.285714285714285, "y": 6.244484040962561e-07, "radius": 7.0, "color": "#fdd0a2"}, {"id": 27, "x": 4.545453800396497, "y": -7.872958276691859, "radius": 11.0, "color": "#c7e9c0"}, {"id": 12, "x": -4.999999254941933, "y": -8.660254365804338, "radius": 10.0, "color": "#a1d99b"}, {"id": 65, "x": 11.11111111111111, "y": 4.856820920748659e-07, "radius": 9.0, "color": "#74c476"}, {"id": 29, "x": -8.333332091569888, "y": -14.433757276340561, "radius": 6.0, "color": "#fdae6b"}, {"id": 59, "x": 16.666666666666664, "y": 3.311369187083865e-07, "radius": 6.0, "color": "#fdae6b"}, {"id": 51, "x": 10.0, "y": 1.986821512250319e-07, "radius": 10.0, "color": "#a1d99b"}, {"id": 47, "x": -14.285714285714285, "y": -6.244484040962561e-07, "radius": 7.0, "color": "#fdd0a2"}, {"id": 42, "x": 0.0, "y": 0.0, "radius": 8.0, "color": "#31a354"}, {"id": 19, "x": -5.000000745058067, "y": 8.660254167122188, "radius": 10.0, "color": "#a1d99b"}, {"id": 25, "x": -11.11111111111111, "y": -4.856820920748659e-07, "radius": 9.0, "color": "#74c476"}, {"id": 38, "x": 4.545454342256896, "y": 7.872958722229494, "radius": 11.0, "color": "#c7e9c0"}, {"id": 14, "x": -4.545454884117294, "y": 7.8729581803690944, "radius": 11.0, "color": "#c7e9c0"}, {"id": 48, "x": -9.09090881997889, "y": -5.719836855555496e-07, "radius": 11.0, "color": "#c7e9c0"}, {"id": 20, "x": -4.545453529466297, "y": -7.872958276691859, "radius": 11.0, "color": "#c7e9c0"}, {"id": 2, "x": 9.090909090909092, "y": 2.2276881690604123e-07, "radius": 11.0, "color": "#c7e9c0"}], "links": [{"source": 0, "target": 33}, {"source": 0, "target": 63}, {"source": 33, "target": 7}, {"source": 63, "target": 8}, {"source": 1, "target": 16}, {"source": 1, "target": 37}, {"source": 16, "target": 6}, {"source": 37, "target": 22}, {"source": 5, "target": 30}, {"source": 5, "target": 28}, {"source": 30, "target": 13}, {"source": 28, "target": 15}, {"source": 6, "target": 18}, {"source": 18, "target": 10}, {"source": 7, "target": 64}, {"source": 64, "target": 26}, {"source": 8, "target": 60}, {"source": 60, "target": 15}, {"source": 10, "target": 17}, {"source": 17, "target": 55}, {"source": 13, "target": 21}, {"source": 21, "target": 61}, {"source": 55, "target": 35}, {"source": 61, "target": 41}, {"source": 22, "target": 46}, {"source": 46, "target": 35}, {"source": 23, "target": 50}, {"source": 23, "target": 24}, {"source": 50, "target": 41}, {"source": 24, "target": 66}, {"source": 66, "target": 26}, {"source": 49, "target": 53}, {"source": 49, "target": 32}, {"source": 53, "target": 3}, {"source": 53, "target": 32}, {"source": 32, "target": 3}, {"source": 3, "target": 67}, {"source": 67, "target": 52}, {"source": 67, "target": 58}, {"source": 4, "target": 39}, {"source": 4, "target": 62}, {"source": 4, "target": 45}, {"source": 39, "target": 52}, {"source": 39, "target": 45}, {"source": 62, "target": 40}, {"source": 62, "target": 52}, {"source": 45, "target": 31}, {"source": 31, "target": 58}, {"source": 31, "target": 40}, {"source": 58, "target": 40}, {"source": 9, "target": 34}, {"source": 9, "target": 57}, {"source": 9, "target": 36}, {"source": 9, "target": 68}, {"source": 34, "target": 57}, {"source": 34, "target": 68}, {"source": 34, "target": 36}, {"source": 57, "target": 36}, {"source": 57, "target": 68}, {"source": 36, "target": 68}, {"source": 11, "target": 54}, {"source": 11, "target": 69}, {"source": 11, "target": 43}, {"source": 11, "target": 44}, {"source": 11, "target": 56}, {"source": 54, "target": 43}, {"source": 54, "target": 27}, {"source": 54, "target": 69}, {"source": 54, "target": 65}, {"source": 69, "target": 43}, {"source": 69, "target": 29}, {"source": 69, "target": 44}, {"source": 43, "target": 27}, {"source": 43, "target": 12}, {"source": 44, "target": 29}, {"source": 44, "target": 59}, {"source": 44, "target": 47}, {"source": 44, "target": 42}, {"source": 56, "target": 29}, {"source": 56, "target": 47}, {"source": 56, "target": 65}, {"source": 56, "target": 12}, {"source": 56, "target": 42}, {"source": 56, "target": 19}, {"source": 27, "target": 42}, {"source": 27, "target": 25}, {"source": 27, "target": 19}, {"source": 27, "target": 51}, {"source": 27, "target": 2}, {"source": 12, "target": 29}, {"source": 12, "target": 59}, {"source": 12, "target": 42}, {"source": 12, "target": 65}, {"source": 12, "target": 14}, {"source": 12, "target": 19}, {"source": 12, "target": 51}, {"source": 12, "target": 48}, {"source": 65, "target": 42}, {"source": 65, "target": 25}, {"source": 65, "target": 14}, {"source": 65, "target": 20}, {"source": 65, "target": 48}, {"source": 65, "target": 51}, {"source": 29, "target": 59}, {"source": 29, "target": 51}, {"source": 59, "target": 19}, {"source": 59, "target": 25}, {"source": 59, "target": 38}, {"source": 51, "target": 47}, {"source": 51, "target": 25}, {"source": 51, "target": 19}, {"source": 51, "target": 2}, {"source": 51, "target": 38}, {"source": 51, "target": 20}, {"source": 47, "target": 25}, {"source": 47, "target": 14}, {"source": 47, "target": 42}, {"source": 47, "target": 38}, {"source": 42, "target": 19}, {"source": 42, "target": 25}, {"source": 19, "target": 25}, {"source": 19, "target": 20}, {"source": 19, "target": 48}, {"source": 19, "target": 14}, {"source": 25, "target": 14}, {"source": 25, "target": 48}, {"source": 38, "target": 2}, {"source": 14, "target": 2}, {"source": 48, "target": 2}, {"source": 20, "target": 2}]}
  
chart = ForceGraph(onion, {
    nodeId: d => d.id,
    nodeGroup: d => d.group,
    nodeTitle: d => `${d.id}\n${d.group}`,
    linkStrokeWidth: l => Math.sqrt(l.value),
    width: 1600,
    height: 1600,
    linkStrength: 10
  })