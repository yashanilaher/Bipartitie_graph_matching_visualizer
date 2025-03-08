import * as d3 from "d3";
import { useRef,useEffect } from "react";

const G2 = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 400, height = 200;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    // Sample bipartite graph (Set A, Set B, Edges)
    const nodes = [
      { id: "a1", group: "A" },
      { id: "a2", group: "A" },
      { id: "a3", group: "A" },
      { id: "b1", group: "B" },
      { id: "b2", group: "B" },
      { id: "b3", group: "B" },
    ];

    const links = [
      { source: "a1", target: "b1" },
      { source: "a1", target: "b2" },
      { source: "a2", target: "b2" },
      { source: "a2", target: "b3" },
      { source: "a3", target: "b3" },
      { source: "a2", target: "b1" }, // Extra edge
    ];

    // Create a force-directed layout
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("c", d3.forceCenter(width/2, height / 2))
      .force("x", d3.forceX((d) => (d.group === "A" ? 200 : 400)).strength(1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Draw links (edges)
    const link = svg.selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Draw nodes (circles)
    const node = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 15)
      .attr("fill", d => (d.group === "A" ? "#ff7f0e" : "#1f77b4"))

    // Add node labels
    svg.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("dx", -5)
      .attr("dy", 5)
      .text(d => d.id)
      .style("font-size", "14px");

    // Update positions during simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      svg.selectAll("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

  }, []);
  
  return (  
    <div className="container">
      <h1 className="h1">Bipartite Graph</h1>
      <svg ref={svgRef} style={{ border: "2px solid black" }} className="graph"></svg>
      <h1 className="h1">Berge Algorithm Visualizer</h1>
    </div>
  );
  
}

export default G2;