import * as d3 from "d3";
import React, { useState, useRef, useEffect } from "react";
import BergeVisualization from "../BergeVisualization/BergeVisualization";
import "./Custom.css";
import VertexCoverVisualization from "../BergeVisualization/VertexCoverVisualization";
import { toast, ToastContainer } from "react-toastify";

function BipartiteGraph() {
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [fromNode, setFromNode] = useState("");
    const [toNode, setToNode] = useState("");
    const [currentMatching, setCurrentMatching] = useState([]);
    const [point, setPoint] = useState(0);
    const [graphVersion, setGraphVersion] = useState(0);
    // Track used node IDs with counter maps
    const [usedNodeIdsA, setUsedNodeIdsA] = useState(new Map());
    const [usedNodeIdsB, setUsedNodeIdsB] = useState(new Map());

    const Warn1 = () => {
        toast.error("Please Enter Valid Nodes!", {
            position: "top-center",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    };

    const Warn2 = () => {
        toast.info("Edge already exists!!", {
            position: "top-center",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    };

    // Helper function to get node position (or generate one if new)
    const getNodePosition = (nodeId, group) => {
        const existingNode = nodes.find(n => n.id === nodeId);
        if (existingNode) {
            return { x: existingNode.x, y: existingNode.y };
        }
        
        // Generate position based on which group the node belongs to
        const width = 600;
        const height = 400;
        
        if (group === "A") {
            // Left side positioning
            return {
                x: width * 0.25 + Math.random() * (width * 0.2),
                y: height * 0.2 + Math.random() * (height * 0.6)
            };
        } else {
            // Right side positioning
            return {
                x: width * 0.55 + Math.random() * (width * 0.2),
                y: height * 0.2 + Math.random() * (height * 0.6)
            };
        }
    };

    // Get next available node ID
    const getNextAvailableId = (nodeNum, group) => {
        const map = group === "A" ? usedNodeIdsA : usedNodeIdsB;
        
        // If the user provided a specific number
        if (nodeNum !== null && nodeNum !== undefined) {
            return nodeNum.toString();
        }
        
        // Find the next available number
        let nextId = 0;
        while (map.has(nextId.toString())) {
            nextId++;
        }
        return nextId.toString();
    };

    // Update used node IDs
    const updateUsedNodeIds = (nodeId, group) => {
        if (group === "A") {
            setUsedNodeIdsA(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(nodeId, true);
                return newMap;
            });
        } else {
            setUsedNodeIdsB(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(nodeId, true);
                return newMap;
            });
        }
    };

    const isNumericString = function(str) {
        return /^[0-9]+$/.test(str);
    }

    const handleAddEdge = () => {
        if (!fromNode || !toNode) {
            Warn1();
            return;
        }

        if (!isNumericString(fromNode) || !isNumericString(toNode)){
            Warn1();
            return;
        }

        // Check if edge already exists
        const fromNodeId = `a${fromNode}`;
        const toNodeId = `b${toNode}`;

        const edgeExists = links.some(
            (edge) => 
                (edge.source.id === fromNodeId && edge.target.id === toNodeId) ||
                (edge.source === fromNodeId && edge.target === toNodeId)
        );

        if (edgeExists) {
            Warn2();
            return;
        }

        // Check if nodes exist and add them if they don't
        const fromNodeExists = nodes.some((node) => node.id === fromNodeId);
        const toNodeExists = nodes.some((node) => node.id === toNodeId);
        
        let updatedNodes = [...nodes];
        
        if (!fromNodeExists) {
            const fromPosition = getNodePosition(fromNodeId, "A");
            updatedNodes.push({ 
                id: fromNodeId, 
                group: "A",
                x: fromPosition.x,
                y: fromPosition.y
            });
            
            // Update used node IDs for group A
            updateUsedNodeIds(fromNode, "A");
        }

        if (!toNodeExists) {
            const toPosition = getNodePosition(toNodeId, "B");
            updatedNodes.push({ 
                id: toNodeId, 
                group: "B",
                x: toPosition.x,
                y: toPosition.y
            });
            
            // Update used node IDs for group B
            updateUsedNodeIds(toNode, "B");
        }

        setNodes(updatedNodes);
        setLinks((prevLinks) => [...prevLinks, { source: fromNodeId, target: toNodeId }]);
        setFromNode("");
        setToNode("");
        setGraphVersion((prev) => (prev + 1));
        setCurrentMatching([]);
    };

    useEffect(() => {
        const width = 600, height = 400;
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid #ccc")
            .on("click", handleSvgClick);
    
        // Clear existing elements
        svg.selectAll("*").remove();
    
        // Create simulation for better node positions
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("x", d3.forceX().x(d => d.group === "A" ? width * 0.25 : width * 0.75).strength(0.7))
            .force("y", d3.forceY(height / 2).strength(0.1))
            .stop();
        
        // Run simulation a few times to get better initial positions
        simulation.tick(30);
    
        // Draw links
        const link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#aaa")
            .attr("stroke-width", 2)
            .attr("x1", d => {
                const src = nodes.find(n => n.id === d.source.id || n.id === d.source);
                return src?.x || 0;
            })
            .attr("y1", d => {
                const src = nodes.find(n => n.id === d.source.id || n.id === d.source);
                return src?.y || 0;
            })
            .attr("x2", d => {
                const tgt = nodes.find(n => n.id === d.target.id || n.id === d.target);
                return tgt?.x || 0;
            })
            .attr("y2", d => {
                const tgt = nodes.find(n => n.id === d.target.id || n.id === d.target);
                return tgt?.y || 0;
            });
    
        // Draw nodes
        const circle = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 17)
            .attr("fill", d => d.group === "A" ? "#4A90E2" : "#F5A623")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .call(drag(simulation)); // Make nodes draggable
    
        // Draw labels
        const text = svg.selectAll(".label")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("dx", -10)
            .attr("dy", 5)
            .text(d => d.id)
            .attr("x", d => d.x)
            .attr("y", d => d.y);
        
        // Update positions if simulation changes
        simulation.on("tick", () => {
            link
                .attr("x1", d => {
                    const src = nodes.find(n => n.id === d.source.id || n.id === d.source);
                    return src?.x || 0;
                })
                .attr("y1", d => {
                    const src = nodes.find(n => n.id === d.source.id || n.id === d.source);
                    return src?.y || 0;
                })
                .attr("x2", d => {
                    const tgt = nodes.find(n => n.id === d.target.id || n.id === d.target);
                    return tgt?.x || 0;
                })
                .attr("y2", d => {
                    const tgt = nodes.find(n => n.id === d.target.id || n.id === d.target);
                    return tgt?.y || 0;
                });
    
            circle
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
    
            text
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
    
        // Define drag function for nodes
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
                
                // Update node positions in the state
                const updatedNodes = nodes.map(node => {
                    if (node.id === event.subject.id) {
                        return { ...node, x: event.subject.x, y: event.subject.y };
                    }
                    return node;
                });
                setNodes(updatedNodes);
            }
            
            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    
        // Click on canvas to add new node
        function handleSvgClick(event) {
            const coords = d3.pointer(event);
            const [x, y] = coords;
            const isLeft = x < width / 2;
    
            const newGroup = isLeft ? "A" : "B";
            
            // Find next available node ID
            const nodeNumeric = getNextAvailableId(null, newGroup);
            const newId = isLeft ? `a${nodeNumeric}` : `b${nodeNumeric}`;
            
            const newNode = { id: newId, group: newGroup, x, y };
            
            // Update used node IDs
            updateUsedNodeIds(nodeNumeric, newGroup);
            
            setNodes(prev => [...prev, newNode]);
            setGraphVersion(prev => prev + 1);
            setCurrentMatching([]);
        }
    }, [nodes, links, usedNodeIdsA, usedNodeIdsB]);

    const onFinalMatching = (matching) => {
        setCurrentMatching((prev) => {
            const isDiff = JSON.stringify(prev) != JSON.stringify(matching);
            if (isDiff) {
                console.log("Received Current Matching", matching);
                return matching;
            } else {
                return prev;
            }
        });
    };

    return (
        <>
            <div className="container">
                <h1>Bipartite Graph Visualization</h1>
                <div className="main-container">
                    {/* Left Side: Graph and Form */}
                    <div className="left-container">
                        <div className="form-container">
                            <label>
                                Node (Part A):  
                                <input
                                    type="text"
                                    value={fromNode}
                                    onChange={(e) => setFromNode(e.target.value)}
                                    placeholder="Enter Node"
                                />
                            </label>
                            <label>
                                Node (Part B):
                                <input
                                    type="text"
                                    value={toNode}
                                    onChange={(e) => setToNode(e.target.value)}
                                    placeholder="Enter Node"
                                />
                            </label>
                            <button onClick={handleAddEdge}>Add Edge</button>
                        </div>
                        <svg ref={svgRef} className="graph"></svg>
                        <h2>Berge Algorithm Visualization</h2>
                        <BergeVisualization 
                            graph={{ nodes, links }} 
                            onFinalMatching={onFinalMatching} 
                            graphVersion={graphVersion} 
                        />
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

                    {/* Right Side: Reserved for Future Work */}
                    <div className="right-container">
                        <h1 className="g1-placeholder">Vertex Cover</h1>
                        {currentMatching.length === 0 ? (
                            <div style={{marginTop:"20px", fontStyle:"italic", color:"gray"}}>
                                Please Complete the Visualization to see the vertex cover
                            </div>
                        ) : (
                            <VertexCoverVisualization
                                graph={{nodes, links}}
                                maximalMatching={currentMatching}
                            />
                        )}
                    </div>
                </div>
                {/* <ToastContainer /> */}
            </div>
        </>
    );
}

export default BipartiteGraph;