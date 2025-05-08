import * as d3 from "d3";
import React, { useState, useRef, useEffect } from "react";
import BergeVisualization from "../BergeVisualization/BergeVisualization";
import "./Custom.css";
import VertexCoverVisualization from "../BergeVisualization/VertexCoverVisualization";
import { toast,ToastContainer } from "react-toastify";

function BipartiteGraph() {
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [fromNode, setFromNode] = useState("");
    const [toNode, setToNode] = useState("");
    const [currentMatching,setCurrentMatching]=useState([]);
    const [point,setPoint]=useState(0);
    const [graphVersion, setGraphVersion] = useState(0)

    const Warn1=()=>{
        toast.error("Please Enter Valid Nodes!",{
          position: "top-center",
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          // theme: "colored",
        })
      }

    const Warn2=()=>{
        toast.info("Edge already exists!!",{
          position: "top-center",
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          // theme: "colored",
        })
      }

    

    const handleAddEdge = () => {
        if (!fromNode || !toNode) {
            Warn1();
            return;
        }
        if ((fromNode[0]!='a' && fromNode[0]!='b') || (toNode[0]!='a' && toNode[0]!='b') || (fromNode[0]==toNode[0])){
            Warn1();
            return;
        }

        const fromNodeExists = nodes.some((node) => node.id === fromNode);
        const toNodeExists = nodes.some((node) => node.id === toNode);
        const edgeExists = links.some(
            (edge) => edge.source.id === fromNode && edge.target.id === toNode
        );

        if (edgeExists) {
            Warn2();
            // alert("Edge already exists!");
            return;
        }

        if (!fromNodeExists) {
            setNodes((prevNodes) => [
                ...prevNodes,
                { id: fromNode, group: fromNode.startsWith("a") ? "A" : "B" },
            ]);
        }

        if (!toNodeExists) {
            setNodes((prevNodes) => [
                ...prevNodes,
                { id: toNode, group: toNode.startsWith("b") ? "B" : "A" },
            ]);
        }

        setLinks((prevLinks) => [...prevLinks, { source: fromNode, target: toNode }]);

        setFromNode("");
        setToNode("");
        setGraphVersion((prev)=>(prev+1));
    };

    useEffect(() => {
        const width = 600, height = 400;
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid #ccc")
            .on("click", handleSvgClick);
    
        svg.selectAll("*").remove();
    
        let selectedNode = null;
    
        // Setup simulation
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));
    
        const link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#aaa")
            .attr("stroke-width", 2);

        const node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 15)
            .attr("fill", d => d.group === "A" ? "#4A90E2" : "#F5A623")
            .on("click", (event, d) => {
                event.stopPropagation(); // prevent SVG click
                if (!selectedNode) {
                    selectedNode = d;
                } else if (selectedNode.id !== d.id) {
                    setLinks(prev => [...prev, { source: selectedNode.id, target: d.id }]);
                    selectedNode = null;
                } else {
                    selectedNode = null; // deselect if clicked same
                }
            });
    
        const label = svg.selectAll(".label")
            .data(nodes)
            .enter()
            .append("text")
            .attr("dx", -5)
            .attr("dy", 5)
            .text(d => d.id)
            .style("font-size", "14px");
    
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
    
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
    
            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
    
        function handleSvgClick(event) {
            const coords = d3.pointer(event);
            let newId = `n${nodes.length}`;
            let newGroup="";
            if (point%2==0){
                newId=`a${point/2}`;
                newGroup="A";
            }
            else{
                newId=`b${(point-1)/2}`;
                newGroup="B";
            }
            setPoint((prev)=>(prev+1));
            // const newGroup = nodes.length % 2 === 0 ? "A" : "B";
            const newNode = { id: newId, group: newGroup, x: coords[0], y: coords[1] };
            setNodes(prev => [...prev, newNode]);
            setGraphVersion((prev) => prev + 1); // Increment graphVersion after adding edge
            setCurrentMatching([]);
        }
    
    }, [nodes, links]);

    const onFinalMatching=(matching)=>{
        setCurrentMatching((prev)=>{
            const isDiff=JSON.stringify(prev)!=JSON.stringify(matching);
            if (isDiff){
                console.log("Received Current Matching",matching);
                return matching;
            }
            else{
                return prev;
            }
        })
        // setCurrentMatching(matching);
    }
    
    console.log("nodes",nodes);
    console.log("links",links);

    return (
        <>
            <div className="container">
                <h1>Bipartite Graph Visualization</h1>
                <div className="main-container">
                    {/* Left Side: Graph and Form */}
                    <div className="left-container">
                        <div className="form-container">
                            <label>
                                From Node (Part A):
                                <input
                                    type="text"
                                    value={fromNode}
                                    onChange={(e) => setFromNode(e.target.value)}
                                    placeholder="e.g., a1"
                                />
                            </label>
                            <label>
                                To Node (Part B):
                                <input
                                    type="text"
                                    value={toNode}
                                    onChange={(e) => setToNode(e.target.value)}
                                    placeholder="e.g., b1"
                                />
                            </label>
                            <button onClick={handleAddEdge}>Add Edge</button>
                        </div>
                        <svg ref={svgRef} className="graph"></svg>
                        <h2>Berge Algorithm Visualization</h2>
                        <BergeVisualization graph={{ nodes, links }} onFinalMatching={onFinalMatching} graphVersion={graphVersion} />
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default BipartiteGraph;
