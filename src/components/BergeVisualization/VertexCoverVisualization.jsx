import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const VertexCoverVisualization = ({ graph, maximalMatching }) => {
  const svgRef = useRef();
  const { nodes, links } = graph;
  const [vertexCover, setVertexCover] = useState([]);


  // DFS for vertex cover
  const dfsVertex = (node, visited, finalMatching) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    if (node.group==="A"){
      const unmatchedEdges=links.filter((link)=>{
        const isMatching=finalMatching.some(
          (m)=>
            (m.source.id===link.source.id && m.target.id===link.target.id) ||
            (m.source.id===link.target.id && m.target.id===link.source.id)
          
        );
        return(
          link.source.id==node.id && !isMatching && link.target.group==="B"
        );
      });

      for (const link of unmatchedEdges){
        const bNode=link.target
        dfsVertex(bNode,visited,finalMatching);
      }
    }
    else if(node.group=="B"){
      const matchedEdge=finalMatching.find(
        (m)=>m.target.id===node.id || m.source.id===node.id
      );
      if (matchedEdge){
        const aNode=matchedEdge.source.group==="A" ? matchedEdge.source : matchedEdge.target;
        dfsVertex(aNode,visited,finalMatching);
      }
    }
  };

  // // Compute minimal vertex cover
  const minimalVertexCover = (finalMatching) => {
    const matchedA=new Set(
      finalMatching.map((edge)=>edge.source.group==="A" ? edge.source.id : edge.target.id)
    )

    const unmatchedNodes = nodes.filter(
      (node) => node.group === "A" && !(matchedA.has(node.id))
    );

    const visited = new Set();

    for (const node of unmatchedNodes) {
      dfsVertex(node, visited, finalMatching);
    }

    const Cover = [];

    //vertex Cover = A-Visited A + Visited B
    for(const node of nodes){
      if (node.group==="A" && !visited.has(node.id) && matchedA.has(node.id)){
        Cover.push(node.id);
      }
      if (node.group==="B" && visited.has(node.id)){
        Cover.push(node.id);
      }
    }

    setVertexCover(Cover);
    console.log("vertex_cover", vertexCover);
  };

  // Run vertex cover computation when maximalMatching or graph changes
  useEffect(() => {
    if (maximalMatching.length > 0) {
      minimalVertexCover(maximalMatching);
      // setVertexCover([]);
    } else {
      setVertexCover([]); // Clear vertex cover if no matching
    }
  }, [maximalMatching, graph]);

  // D3 visualization
  useEffect(() => {
    const width = 600;
    const height = 400;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX((d) => (d.group === "A" ? 200 : 400)).strength(1))
      .force("buffering", d3.forceY(height / 2).strength(0.1));

    // Draw links
    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Draw nodes
    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d) =>
        vertexCover.includes(d.id)
          ? d.group === "A"
            ? "#ff0000" // Red for A in vertex cover
            : "#00ff00" // Green for B in vertex cover
          : d.group === "A"
          ? "#ff7f0e" // Original orange for A
          : "#1f77b4" // Original blue for B
      );

    // Add labels
    svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dx", -5)
      .attr("dy", 5)
      .text((d) => d.id)
      .style("font-size", "14px");

    // Update positions during simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      svg
        .selectAll("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });
  }, [nodes, links, vertexCover]);

  return (
    <div>
      <svg ref={svgRef} style={{ border: "2px solid black" }}></svg>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p className="pp1">
          Vertex Cover: {vertexCover.length > 0 ? vertexCover.join(", ") : "None"}
        </p>
        <p className="pp2">Size: {vertexCover.length}</p>
      </div>
      <div className="legends-right">
          <div className="legend-line">
            <span className="legend-item">
              <span className="legend-dot red-dot"></span>Vertices in Vertex Cover From A part
            </span>
            <span className="legend-item">
              <span className="legend-dot green-dot"></span>Vertices in Vertex Cover From B part
            </span>
          </div>
        </div>
    </div>
  );
};

export default VertexCoverVisualization;