import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import BergeVisualization from "../BergeVisualization/BergeVisualization";
// import "./G5.css"; // Add CSS file for layout

const G5 = () => {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([
    { id: "a1", group: "A" },
    { id: "a2", group: "A" },
    { id: "a3", group: "A" },
    { id: "a4", group: "A" },
    { id: "b1", group: "B" },
    { id: "b2", group: "B" },
    { id: "b3", group: "B" },
    { id: "b4", group: "B" },
  ]);

  const [links, setLinks] = useState([
    { source: "a1", target: "b1" },
    { source: "a1", target: "b2" },
    { source: "a2", target: "b1" },
    { source: "a3", target: "b3" },
    { source: "a3", target: "b4" },
    { source: "a4", target: "b3" },
  ]);

  useEffect(() => {
    const width = 400,
      height = 200;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("c", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX((d) => (d.group === "A" ? 200 : 400)).strength(1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Draw links (edges)
    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Draw nodes (circles)
    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d) => (d.group === "A" ? "#ff7f0e" : "#1f77b4"));

    // Add node labels
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
  }, [nodes, links]);
  
  return (  
    <div className="g1-container">

      {/* Right content with graph and visualizer */}
      <div className="g1-left">
        <h1 className="g1-title">Bipartite Graph</h1>
        <svg
          ref={svgRef}
          style={{ border: "2px solid black" }}
          className="g1-graph"
        ></svg>
        <h1 className="g1-title">Berge Algorithm Visualizer</h1>
        <div><BergeVisualization graph={{ nodes, links }} /></div>
      </div>
      {/* Left content for future use */}
      <div className="g1-right">
        <h2 className="g1-placeholder">Left Space (For Future Work)</h2>
      </div>
    </div>
  );
  
}
const styles = {
  
};



export default G5;