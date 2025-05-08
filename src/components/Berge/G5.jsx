import * as d3 from "d3";
import { useRef, useEffect, useState,useMemo } from "react";
import BergeVisualization from "../BergeVisualization/BergeVisualization";
// import "./G1.css"; // Add CSS file for layout
import VertexCoverVisualization from "../BergeVisualization/VertexCoverVisualization";
import BergeAlgorithm from '../BergeVisualization/BergeAlgorithm';
import { toast } from "react-toastify";


const G1 = () => {
  const [currentMatching, setCurrentMatching] = useState([]);
  const svgRef = useRef();
  const [nodes, setNodes] = useState([
    { id: "a1", group: "A" },
    { id: "a2", group: "A" },
    { id: "a3", group: "A" },
    { id: "a4", group: "A" },
    // { id: "a5", group: "A" },
    { id: "b1", group: "B" },
    { id: "b2", group: "B" },
    { id: "b3", group: "B" },
    { id: "b4", group: "B" },
    // { id: "b5", group: "B" },
  ]);


  // const [nodes, setNodes] = useState([
  //   { id: "a1", group: "A" },
  //   { id: "a2", group: "A" },
  //   { id: "a3", group: "A" },
  //   { id: "a4", group: "A" },
    // { id: "a5", group: "A" },
    // { id: "a6", group: "A" },
    // { id: "b1", group: "B" },
    // { id: "b2", group: "B" },
    // { id: "b3", group: "B" },
    // { id: "b4", group: "B" },
    // { id: "b5", group: "B" },
    // { id: "b6", group: "B" },
  // ]);

  const [links, setLinks] = useState([
    { source: "a1", target: "b1" },
    { source: "a1", target: "b2" },
    { source: "a2", target: "b1" },
    { source: "a3", target: "b3" },
    { source: "a3", target: "b4" },
    { source: "a4", target: "b3" },
    // { source: "a4", target: "b5" },
    // { source: "a5", target: "b4" },
  ]);
  // const [links, setLinks] = useState([
  //   { source: "a1", target: "b1" },
  //   { source: "a2", target: "b1" },
  //   { source: "a2", target: "b2" },
  //   { source: "a6", target: "b2" },
  //   { source: "a3", target: "b3" },
  //   { source: "a4", target: "b3" },
  //   { source: "a4", target: "b4" },
    // { source: "a5", target: "b5" },
  //   { source: "a6", target: "b4" },
  // ]);

  const graph=useMemo(()=>({nodes,links}),[nodes,links]);

  useEffect(() => {
    const width = 600,
      height = 400;
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
      .attr("fill", (d) => (d.group === "A" ? "#4A90E2" : "#F5A623"));

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

  //callback to get maximal matching
  const onFinalMatching=(matching)=>{
    setCurrentMatching((prev)=>{
      const isDiff=JSON.stringify(prev)!=JSON.stringify(matching);
      if (isDiff){
        console.log("Received Currect Matching", matching);
        return matching;
      }
      else{
        return prev;
      }
    })
  }
  
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
        <h1 className="g1-title">Berge's Algorithm Visualizer</h1>
        <div><BergeVisualization 
            graph={{ nodes, links }} 
            onFinalMatching={onFinalMatching}
            />
        </div>
        <div className="legends-left">
          <div className="legend-line">
            <span className="legend-item">
              <span className="legend-dot purple-dot"></span> Augmenting Path
            </span>
            <span className="legend-item">
              <span className="legend-dot green-dot"></span> Matching in Augmenting Path
            </span>
            <span className="legend-item">
              <span className="legend-dot red-dot"></span> Matching
            </span>
          </div>
        </div>
      </div>
      {/* Left content for future use */}
      <div className="g1-right">
        <BergeAlgorithm/>

        <h1 className="g1-placeholder">Vertex Cover</h1>
        {currentMatching.length===0 ? (
          <div style={{marginTop:"20px",fontStyle:"italic",color:"gray"}}>
            Please Complete the Visualization to see the vertex cover
          </div>
        ) : (
          <VertexCoverVisualization
            graph={{nodes,links}}
            maximalMatching={currentMatching}
          />
        )}
        {/* <div className="legends-right">
          <div className="legend-line">
            <span className="legend-item">
              <span className="legend-dot red-dot"></span>Vertices in Vertex Cover From A part
            </span>
            <span className="legend-item">
              <span className="legend-dot green-dot"></span>Vertices in Vertex Cover From B part
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
  
}




export default G1;