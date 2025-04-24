import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const VertexCoverVisualization = ({ graph, maximalMatching }) => {
  const svgRef = useRef();
  const { nodes, links } = graph;
  const [vertexCover, setVertexCover] = useState([]);

  // Helper to get matched partner
  const getMatchedPartnerVertex = (nodeId, match) => {
    for (const edge of match) {
      if (edge.source.id === nodeId) return edge.target.id;
      if (edge.target.id === nodeId) return edge.source.id;
    }
    return null;
  };

  // DFS for vertex cover
  const dfsVertex = (node, visited, finalMatching) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    if (node.group === "A") {
      const adjacentNodes = links
        .filter((link) => link.source.id === node.id)
        .map((link) => link.target);

      for (const adj of adjacentNodes) {
        if (!visited.has(adj.id)) {
          visited.add(adj.id);
          const partnerId = getMatchedPartnerVertex(adj.id, finalMatching);
          const partnerNode = nodes.find((n) => n.id === partnerId);
          if (partnerNode && !visited.has(partnerNode.id)) {
            dfsVertex(partnerNode, visited, finalMatching);
          }
        }
      }
    } else if (node.group === "B") {
      const partnerId = getMatchedPartnerVertex(node.id, finalMatching);
      const partnerNode = nodes.find((n) => n.id === partnerId);
      if (partnerNode && !visited.has(partnerNode.id)) {
        dfsVertex(partnerNode, visited, finalMatching);
      }
    }
  };

  // Compute minimal vertex cover
  const minimalVertexCover = (finalMatching) => {
    const LtoR = {};
    for (const edge of finalMatching) {
      // Assume source is A and target is B (from BergeVisualization)
      LtoR[edge.source.id] = edge.target.id;
    }

    const unmatchedNodes = nodes.filter(
      (n) => n.group === "A" && !(n.id in LtoR)
    );
    const visited = new Set();

    for (const node of unmatchedNodes) {
      dfsVertex(node, visited, finalMatching);
    }

    const vertexCover = [];

    // Add visited B nodes
    for (const node of nodes) {
      if (node.group === "B" && visited.has(node.id)) {
        vertexCover.push(node.id);
      }
    }

    // Add unvisited matched A nodes
    const matchedAIds = new Set(finalMatching.map((edge) => edge.source.id));
    for (const node of nodes) {
      if (
        node.group === "A" &&
        !visited.has(node.id) &&
        matchedAIds.has(node.id)
      ) {
        vertexCover.push(node.id);
      }
    }

    setVertexCover(vertexCover);
    console.log("vertex_cover", vertexCover);
  };

  // Run vertex cover computation when maximalMatching or graph changes
  useEffect(() => {
    if (maximalMatching.length > 0) {
      minimalVertexCover(maximalMatching);
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
      <h3>Vertex Cover Visualization</h3>
      <svg ref={svgRef} style={{ border: "2px solid black" }}></svg>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>
          Vertex Cover: {vertexCover.length > 0 ? vertexCover.join(", ") : "None"}
        </p>
        <p>Size: {vertexCover.length}</p>
      </div>
    </div>
  );
};

export default VertexCoverVisualization;