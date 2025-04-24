// berge.jsx:(Visualizing maximal matching)
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BergeVisualization = ({ graph , onFinalMatching }) => {
  const svgRef = useRef();
  const [step, setStep] = useState(0);
  const [matching, setMatching] = useState([]); // Current matching
  const [augmentingPath, setAugmentingPath] = useState([]); // Current augmenting path

  // New state variables to store precomputed steps
  const [precomputedPaths, setPrecomputedPaths] = useState([]);
  const [precomputedMatchings, setPrecomputedMatchings] = useState([]);

  const { nodes, links } = graph;
  // console.log("nodes",nodes);
  // console.log("links",links);

  // Helper function to find edge between two nodes
  const findEdge = (sourceId, targetId) => {
    return links.find(
      (link) => 
        (link.source.id === sourceId && link.target.id === targetId) || 
        (link.source.id === targetId && link.target.id === sourceId)
    );
  };

  // Helper function to check if a node is matched in the current matching
  const isMatched = (nodeId, currentMatching) => {
    return currentMatching.some(
      (edge) => edge.source.id === nodeId || edge.target.id === nodeId
    );
  };

  // Helper function to get the matched partner of a node
  const getMatchedPartner = (nodeId, currentMatching) => {
    const matchedEdge = currentMatching.find(
      (edge) => edge.source.id === nodeId || edge.target.id === nodeId
    );
    if (!matchedEdge) return null;
    return matchedEdge.source.id === nodeId ? matchedEdge.target.id : matchedEdge.source.id;
  };

  // Modified DFS implementation for finding augmenting paths
  const dfs = (nodeId, visited, currentMatching, path) => {
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    path.push(nodeId);
    
    // Get node object
    const node = nodes.find(n => n.id === nodeId);
    
    // If node is in group A, look for adjacent nodes in group B
    if (node.group === "A") {
      // Find all connected nodes in group B
      const adjacentNodes = links
        .filter(link => link.source.id === nodeId || link.target.id === nodeId)
        .map(link => link.source.id === nodeId ? link.target.id : link.source.id)
        .filter(id => nodes.find(n => n.id === id).group === "B");
      
      for (const adjacentId of adjacentNodes) {
        path.push(adjacentId);

        // If adjacent node is unmatched, we found an augmenting path
        if (!isMatched(adjacentId, currentMatching)) {
          return true;
        }
        
        // If adjacent node is matched, continue DFS through its partner
        const partnerId = getMatchedPartner(adjacentId, currentMatching);
        if (partnerId && !visited.has(partnerId)) {
          if (dfs(partnerId, visited, currentMatching, path)) {
            return true;
          }
        }
        
        // Remove adjacent node from path if no augmenting path found through it
        path.pop();
      }
    } 
    // If node is in group B, look for the matched node in group A (if any)
    else if (node.group === "B") {
      const partnerId = getMatchedPartner(nodeId, currentMatching);
      if (partnerId && !visited.has(partnerId)) {
        if (dfs(partnerId, visited, currentMatching, path)) {
          return true;
        }
      }
    }
    
    // Remove current node from path if no augmenting path found
    path.pop();
    return false;
  };

  // Find augmenting path using DFS
  const computeAugmentingPath = (currentMatching) => {
    // Start from all unmatched nodes in group "A"
    for (const node of nodes) {
      if (node.group === "A" && !isMatched(node.id, currentMatching)) {
        const visited = new Set();
        const path = [];
        
        if (dfs(node.id, visited, currentMatching, path)) {
          return path;
        }
      }
    }
    return null; // No augmenting path found
  };

  // Pure helper function: given an augmenting path and current matching,
  // compute the new matching state.
  const computeNewMatching = (path, currentMatching) => {
    if (!path || path.length < 2) return currentMatching;
    
    // Create a copy of the current matching
    const newMatching = [...currentMatching];
    
    // Process the augmenting path
    for (let i = 0; i < path.length - 1; i += 2) {
      const u = path[i];
      const v = path[i + 1];
      
      // Find edge between u and v
      const edge = findEdge(u, v);
      
      if (edge) {
        // If this edge is in the matching, remove it
        const matchedIndex = newMatching.findIndex(
          e => (e.source.id === u && e.target.id === v) || 
               (e.source.id === v && e.target.id === u)
        );
        
        if (matchedIndex !== -1) {
          newMatching.splice(matchedIndex, 1);
        } else {
          // Otherwise add it to the matching
          newMatching.push(edge);
        }
      }
      
      // If there's a next pair (v, w) in the path
      if (i + 2 < path.length) {
        const w = path[i + 2];
        const nextEdge = findEdge(v, w);
        
        if (nextEdge) {
          // If this edge is in the matching, remove it
          const matchedIndex = newMatching.findIndex(
            e => (e.source.id === v && e.target.id === w) || 
                 (e.source.id === w && e.target.id === v)
          );
          
          if (matchedIndex !== -1) {
            newMatching.splice(matchedIndex, 1);
          }
        }
      }
    }
    
    return newMatching;
  };

  // Precompute all steps of the algorithm
  const precomputeSteps = () => {
    let currentMatching = [];
    const paths = [];
    const matchings = [];
    
    // Initial state
    matchings.push([]);
    
    while (true) {
      const path = computeAugmentingPath(currentMatching);
      console.log("path",path)
      if (path) {
        paths.push(path);
        currentMatching = computeNewMatching(path, currentMatching);
        console.log("CurrentMatching",currentMatching)
        // Store a deep copy of currentMatching at this step
        matchings.push([...currentMatching]);
        console.log("matching",matchings);
      } else {
        break;
      }
    }
    
    setPrecomputedPaths(paths);
    setPrecomputedMatchings(matchings);
    console.log("prec_matchings", matchings);
    console.log("type",typeof(precomputedMatchings));
    // console.log("prec_paths", paths);
    if (onFinalMatching && matchings.length>0){
      console.log("hahahaha")
      onFinalMatching(matchings[matchings.length-1]);
    }
  };

  // Precompute steps when the graph changes or on component mount
  useEffect(() => {
    precomputeSteps();
    //Also reset step counter and state if graph changes
    setStep(0);
    setMatching([]);
    setAugmentingPath([]);
  }, [graph]);

  // useEffect(() => {
  //   if (onFinalMatching && precomputedMatchings.length > 0) {
  //     console.log("hahahaha");
  //     onFinalMatching(precomputedMatchings[precomputedMatchings.length - 1]);
  //   }
  // }, [precomputedMatchings, onFinalMatching]);


  // Instead of computing on each click, simply show the precomputed step.
  const handleNextStep = () => {
    if (step < 2*precomputedPaths.length) {

      if (step%2 == 0){
        setAugmentingPath(precomputedPaths[step/2]);
        setMatching(precomputedMatchings[ ( (step-2) / 2) + 1]);
        setStep(step + 1);
      }

      if (step%2 == 1){
        setMatching(precomputedMatchings[ ( (step-1) / 2) + 1]); // Use next matching since we've already applied the path
        setAugmentingPath(precomputedPaths[(step-1)/2]);
        setStep(step + 1);
      }

      // setStep(step + 1);
    }

    else if (step == 2 * precomputedPaths.length) {
      setAugmentingPath([]);
      setMatching(precomputedMatchings[precomputedMatchings.length - 1]); 
      setStep(step + 1);
    }
    else{
      alert("No more steps available. Maximum matching reached!");
    }
  };


  
  
  const handlePreviousStep = () => {
    let newStep = step - 1;

    if (newStep >= 2*precomputedPaths.length) {
      newStep = 2*precomputedPaths.length - 1;
    }
    

    if (newStep >= 0) {
      setStep(newStep);

      if (newStep == 0){
        setAugmentingPath([]);
        setMatching([]);
      } 
      else if (newStep == 1){
        setAugmentingPath(precomputedPaths[0]);
        setMatching([]);
      }

      else if (newStep%2 == 0){
        setAugmentingPath(precomputedPaths[newStep/2 - 1]);
        setMatching(precomputedMatchings[ ( (newStep-2) / 2) + 1]);
    
      }
      else {
        setMatching(precomputedMatchings[ ( (newStep-1) / 2) ]); 
        setAugmentingPath(precomputedPaths[(newStep-1)/2]);
      }

      // setStep(step + 1);
    }
    else{
      alert("No steps before this.");
    }
  };
  
  

  const handleReset = () => {
    setStep(0);
    setMatching([]);
    setAugmentingPath([]);
    precomputeSteps();
  };

  
  useEffect(() => {
    const width = 600,
      height = 400;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id).distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "x",
        d3.forceX((d) => (d.group === "A" ? 200 : 400)).strength(1)
      )
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Draw links
    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        // Check if this edge is part of the augmenting path
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        
        const isInPath = augmentingPath.length >= 2 && augmentingPath.some((id, index) => {
          if (index === augmentingPath.length - 1) return false;
          const u = augmentingPath[index];
          const v = augmentingPath[index + 1];
          return (u === sourceId && v === targetId) || (u === targetId && v === sourceId);
        });
        
        
        // Check if this edge is in the current matching
        const isInMatching = matching.some(
          (e) => 
            (e.source.id === sourceId && e.target.id === targetId) || 
            (e.source.id === targetId && e.target.id === sourceId)
        );

        if (isInMatching && isInPath) return "green";
        
        if (isInMatching) return "red";

        if (isInPath) return "blue";


        return "#999";
      })
      .attr("stroke-width", 2);

    // Draw nodes
    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d) => (d.group === "A" ? "#ff7f0e" : "#1f77b4"));

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

      svg.selectAll("text").attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [nodes, links, matching, augmentingPath, step]);

  
  return (
    <div>
      <svg ref={svgRef} style={{ border: "2px solid black" }}></svg>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px",
                   justifyContent: "center" }}>
        <button onClick={handleNextStep}>Next Step</button>
      
        <button onClick={() => handlePreviousStep()}>Previous Step</button>


        <button onClick={handleReset}>Reset</button>

      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>Step {step}</h3>
        <p>
          {augmentingPath.length > 0
            ? `Augmenting path found: ${augmentingPath.join(" -> ")}`
            : "No augmenting path found yet. Click 'Next Step' to start."}
        </p>
        <p>
          Current matching size: {matching.length}
          {matching.length > 0 && (
            <span>
              {" "}
              (
              {matching
                .map(
                  (edge) => `${edge.source.id || edge.source}-${edge.target.id || edge.target}`
                )
                .join(", ")}
              )
            </span>
          )}
        </p>
      </div>
    </div>
  );
};



export default BergeVisualization;