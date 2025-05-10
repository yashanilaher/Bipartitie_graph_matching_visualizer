import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { toast, ToastContainer } from "react-toastify";

const BergeVisualization = ({ graph, onFinalMatching, graphVersion }) => {
  const svgRef = useRef();
  const [step, setStep] = useState(0);
  const [matching, setMatching] = useState([]); // Current matching
  const [augmentingPath, setAugmentingPath] = useState([]); // Current augmenting path

  // New state variables to store precomputed steps
  const [precomputedPaths, setPrecomputedPaths] = useState([]);
  const [precomputedMatchings, setPrecomputedMatchings] = useState([]);

  const { nodes, links } = graph;
  // console.log("BergeVis received nodes:", nodes);
  // console.log("BergeVis received links:", links);

  const Complete = () => {
    toast.success("Done! Verify Cover! 🎉", {
      position: "top-center",
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const Warn = () => {
    toast.error("NO Steps Before!", {
      position: "top-center",
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const Reset = () => {
    toast.info("Reset Done ", {
      position: "top-center",
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  // Normalize an edge to ensure consistent source-target reference
  // const normalizeEdge = (edge) => {
  //   const sourceId = edge.source.id || edge.source;
  //   const targetId = edge.target.id || edge.target;
  //   return { sourceId, targetId };
  // };

  // Helper function to find edge between two nodes
  const findEdge = (sourceId, targetId) => {
    return links.find(
      (link) => {
        const linkSourceId = link.source.id;
        const linkTargetId = link.target.id;
        return (
          (linkSourceId === sourceId && linkTargetId === targetId) ||
          (linkSourceId === targetId && linkTargetId === sourceId)
        );
      }
    );
  };

  // Helper function to check if a node is matched in the current matching
  const isMatched = (nodeId, currentMatching) => {
    return currentMatching.some((edge) => {
      const sourceId = edge.source.id;
      const targetId = edge.target.id;
      return sourceId === nodeId || targetId === nodeId;
    });
  };

  // Helper function to get the matched partner of a node
  const getMatchedPartner = (nodeId, currentMatching) => {
    const matchedEdge = currentMatching.find((edge) => {
      const sourceId = edge.source.id;
      const targetId = edge.target.id;
      return sourceId === nodeId || targetId === nodeId;
    });
    
    if (!matchedEdge) return null;
    
    const sourceId = matchedEdge.source.id;
    const targetId = matchedEdge.target.id;
    
    return sourceId === nodeId ? targetId : sourceId;
  };

  // Modified DFS implementation for finding augmenting paths
  const dfs = (nodeId, visited, currentMatching, path) => {
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    path.push(nodeId);

    // Get node object
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      console.error("Node not found:", nodeId);
      path.pop();
      return false;
    }

    // If node is in group A, look for adjacent nodes in group B
    if (node.group === "A") {
      // Find all connected nodes in group B
      const adjacentNodes = links
        .filter((link) => {
          const sourceId = link.source.id;
          const targetId = link.target.id;
          return sourceId === nodeId || targetId === nodeId;
        })
        .map((link) => {
          const sourceId = link.source.id;
          const targetId = link.target.id;
          return sourceId === nodeId ? targetId : sourceId;
        })
        .filter((id) => {
          const adjacentNode = nodes.find((n) => n.id === id);
          return adjacentNode && adjacentNode.group === "B";
        });

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

    // Process the augmenting path in pairs
    for (let i = 0; i < path.length - 1; i += 2) {
      const u = path[i];
      const v = path[i + 1];

      // Find edge between u and v in the graph
      const edge = findEdge(u, v);
      if (!edge) {
        console.error("Edge not found between", u, "and", v);
        continue;
      }

      // Check if this edge is already in the matching
      const matchedIndex = newMatching.findIndex((e) => {
        const sourceId = e.source.id;
        const targetId = e.target.id;
        return (
          (sourceId === u && targetId === v) ||
          (sourceId === v && targetId === u)
        );
      });

      if (matchedIndex !== -1) {
        // Remove edge from matching
        newMatching.splice(matchedIndex, 1);
      } else {
        // Add edge to matching
        newMatching.push(edge);
      }
      console.log("nn",newMatching);

      // If there's a next pair (v, w) in the path
      if (i + 2 < path.length) {
        const w = path[i + 2];
        const nextEdge = findEdge(v, w);

        if (nextEdge) {
          // If this edge is in the matching, remove it
          const matchedIndex = newMatching.findIndex((e) => {
            const sourceId = e.source.id;
            const targetId = e.target.id;
            return (
              (sourceId === v && targetId === w) ||
              (sourceId === w && targetId === v)
            );
          });

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
    if (!nodes.length || !links.length) {
      setPrecomputedPaths([]);
      setPrecomputedMatchings([[]]);
      return;
    }

    let currentMatching = [];
    const paths = [];
    const matchings = [];

    // Initial state - empty matching
    matchings.push([]);

    // Maximum iterations to prevent infinite loop
    // const maxIterations = Math.min(nodes.length, 100);
    // let iterations = 0;

    // Continue finding augmenting paths until none exist or max iterations reached
    while (true) {
      // iterations++;
      
      const path = computeAugmentingPath(currentMatching);
      console.log("Found path:", path);
      
      if (path && path.length >= 2) {
        paths.push(path);
        const newMatching = computeNewMatching(path, currentMatching);
        currentMatching = newMatching;
        matchings.push([...newMatching]);
        // console.log("Updated matching:", newMatching);
      } else {
        // No more augmenting paths found
        break;
      }
    }

    // console.log("Final precomputed paths:", paths);
    // console.log("Final precomputed matchings:", matchings);
    
    setPrecomputedPaths(paths);
    setPrecomputedMatchings(matchings);
    
    // Immediately send the final matching to the parent component
    // if (onFinalMatching && matchings.length > 0) {
    //   onFinalMatching(matchings[matchings.length - 1]);
    // }
  };

  // Precompute steps when the graph changes or on component mount
  useEffect(() => {
    console.log("Graph changed, recomputing steps. Version:", graphVersion);
    // Reset state
    setStep(0);
    setMatching([]);
    setAugmentingPath([]);
    
    setTimeout(() => {
      precomputeSteps();
    }, 10);
  }, [graph, graphVersion]);

  const handleNextStep = () => {
    if (step < 2 * precomputedPaths.length) {
      if (step % 2 === 0) {
        setAugmentingPath(precomputedPaths[step / 2]);
        if (step >= 2) {
          setMatching(precomputedMatchings[(step - 2) / 2 + 1]);
        } else {
          setMatching([]);
        }
        setStep(step + 1);
      } else if (step % 2 === 1) {
        setMatching(precomputedMatchings[(step - 1) / 2 + 1]); // Use next matching
        setAugmentingPath(precomputedPaths[(step - 1) / 2]);
        setStep(step + 1);
      }
    } else if (step === 2 * precomputedPaths.length) {
      setAugmentingPath([]);
      setMatching(precomputedMatchings[precomputedMatchings.length - 1]);
      setStep(step + 1);
    } else {
      if (onFinalMatching && precomputedMatchings.length > 0) {
        onFinalMatching(precomputedMatchings[precomputedMatchings.length - 1]);
      }
      Complete();
    }
  };

  const handlePreviousStep = () => {
    let newStep = step - 1;

    if (newStep >= 2 * precomputedPaths.length) {
      newStep = 2 * precomputedPaths.length - 1;
    }

    if (newStep >= 0) {
      setStep(newStep);

      if (newStep === 0) {
        setAugmentingPath([]);
        setMatching([]);
      } else if (newStep === 1) {
        setAugmentingPath(precomputedPaths[0]);
        setMatching([]);
      } else if (newStep % 2 === 0) {
        setAugmentingPath(precomputedPaths[newStep / 2 - 1]);
        setMatching(precomputedMatchings[(newStep - 2) / 2 + 1]);
      } else {
        setMatching(precomputedMatchings[(newStep - 1) / 2]);
        setAugmentingPath(precomputedPaths[(newStep - 1) / 2]);
      }
    } else {
      Warn();
    }
  };

  const handleReset = () => {
    setStep(0);
    setMatching([]);
    setAugmentingPath([]);
    precomputeSteps();
    onFinalMatching([]);
    Reset();
  };

  useEffect(() => {
    const width = 600,
      height = 400;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    svg.selectAll("*").remove();

    // Skip rendering if no nodes or links
    if (!nodes.length) return;

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
        // Get consistent IDs
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        
        // Check if this edge is part of the augmenting path
        const isInPath = augmentingPath.length >= 2 && augmentingPath.some((id, index) => {
          if (index === augmentingPath.length - 1) return false;
          const u = augmentingPath[index];
          const v = augmentingPath[index + 1];
          return (u === sourceId && v === targetId) || (u === targetId && v === sourceId);
        });
        
        // Check if this edge is in the current matching
        const isInMatching = matching.some((e) => {
          const matchSourceId = e.source.id;
          const matchTargetId = e.target.id;
          return (
            (matchSourceId === sourceId && matchTargetId === targetId) ||
            (matchSourceId === targetId && matchTargetId === sourceId)
          );
        });

        if (isInMatching && isInPath) return "green";
        if (isInMatching) return "red";
        if (isInPath) return "#9013FE";
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
      .attr("fill", (d) => (d.group === "A" ? "#4A90E2" : "#F5A623"));

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

  const formatID=(id)=>(  //not using return as not using {} parathesis
    <>
      {id[0]}
      <sub>
        {id.slice(1)}
      </sub>
    </>
  )

  return (
    <div>
      <svg ref={svgRef} style={{ border: "2px solid black" }}></svg>
      <ToastContainer />
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <button onClick={handleNextStep}>Next Step</button>
        <button onClick={() => handlePreviousStep()}>Previous Step</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>Step {step}</h3>
        <p>
          {augmentingPath.length > 0 ? (
            <>
              Augmenting path found:&nbsp;
              {
                augmentingPath.map((id,index)=>(
                  <React.Fragment key={index}>
                    {formatID(id)}
                    {index!==augmentingPath.length-1 && " -> "}
                  </React.Fragment>
                ))
              }
            </>

          ) : (
            "No augmenting path found yet. Click 'Next Step' to start."
            )}
        </p>
        <p>
          Current matching size: {matching.length}
          {matching.length > 0 && (
            <span>
              {" ("}
              {matching.map((edge,index) => {
                  const sourceId = edge.source.id;
                  const targetId = edge.target.id;
                  return (
                    <span key={index}>
                      {formatID(sourceId)}-{formatID(targetId)}
                      {index!==matching.length - 1 && ", "}
                    </span>
                  );
              
              })}
              {")"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default BergeVisualization;