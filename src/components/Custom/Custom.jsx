import * as d3 from "d3";
import React, { useState } from 'react'
import { useRef,useEffect } from 'react'

function Custom() {
    const svgRef=useRef();
    const [nodes,setNodes]=useState([]);
    const [links,setLinks]=useState([]);
    const [fromNode,setFromNode]=useState("");
    const [toNode,setToNode]=useState("");

    useEffect(()=>{
        const width = 400, height = 200;
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        svg.selectAll("*").remove();
        // console.log(nodes);
        // console.log(links);

        // Create a force-directed layout
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
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

    },[nodes,links])


    const handleAddEdge=()=>{
        if (!fromNode || !toNode){
            alert("Please enter the edge");
            return;
        }

        const fromNodeExists=nodes.some((node)=>node.id===fromNode);
        const toNodeExists=nodes.some((node)=>node.id===toNode);

        if (fromNodeExists && toNodeExists){
            alert("Edge Already Present");
            return;
        }


        if (!fromNodeExists){
            setNodes((prevNode)=>[
                ...prevNode,
                {id:fromNode,group:fromNode.startsWith("a") ? "A" : "B"}
            ]);
        }
        
        if (!toNodeExists){
            setNodes((prevNode)=>[
                ...prevNode,
                {id:toNode,group:toNode.startsWith("b") ? "B" : "A"}
            ])
        }

        setLinks((prevLinks)=>[
            ...prevLinks,
            {source:fromNode,target:toNode},
        ])

        setFromNode("");
        setToNode("");
    }

    return (
        <div className='container'>
            <h1>Custom Bipartite Graph</h1>
            <div>
                <label>
                    From Node (Part A):
                    <input 
                        type="text"
                        value={fromNode}
                        onChange={(e)=>setFromNode(e.target.value)}
                        placeholder="e.g.,a1"
                    />
                </label>
                <label>
                    From Node (Part B):
                    <input 
                        type="text"
                        value={toNode}
                        onChange={(e)=>setToNode(e.target.value)}
                        placeholder="e.g.,b1"
                    />
                </label>
                <button onClick={handleAddEdge}>Add Edge</button>
            </div>
            <svg ref={svgRef} style={{ border: "2px solid black" }} className="graph"></svg>
            <h2>Visualization of Berge Algorithm</h2>
            
        </div>

    )
}

export default Custom
