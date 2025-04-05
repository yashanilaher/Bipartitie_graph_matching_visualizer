

  // Helper function to get the matched partner of a node
  const getMatchedPartner = (nodeId, currentMatching) => {
    const matchedEdge = currentMatching.find(
      (edge) => edge.source.id === nodeId || edge.target.id === nodeId
    );
    if (!matchedEdge) return null;
    return matchedEdge.source.id === nodeId ? matchedEdge.target.id : matchedEdge.source.id;
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




  // #############################
  const getMatchedPartner_vertex=(nodeId,Match)=>{
    for(const key in Match){
      const edge=Match[key];
      if (edge.source.id===nodeId) return edge.target.id;
      if (edge.target.id===nodeId) return edge.source.id;
    }
    return null;
  }

  const dfs_vertex=(node,visited,final_matching)=>{
    if (visited.has(node.id)) return false;
    visited.add(node.id);
    // path.push(node);
    console.log("CurrNode",node)
    if (node.group==="A"){
      const adjacentNodes=links
      .filter(link=>link.source.id===node.id)
      .map(link=>link.target)
      
      for(const adj of adjacentNodes){
        console.log("adj",adj.id);
        const partnerId=getMatchedPartner_vertex(adj.id,final_matching);
        const partnernode=nodes.find(n=>n.id===partnerId);
        if (partnernode && !visited.has(partnernode.id)){
          visited.add(partnerId);
          if (dfs_vertex(partnernode,visited,final_matching)){
            return true;
          }
          // dfs_vertex(partnernode,visited,final_matching);
        }
      }
    }
    else if (node.group==="B"){
      const partnerId=getMatchedPartner_vertex(node.id,final_matching);
      const partnernode=nodes.find(n=>n.id===partnerId);
      if (partnernode && !visited.has(partnernode.id)){
        visited.add(partnerId);
        if (dfs_vertex(partnernode,visited,final_matching)){
          return true;
        }
        // dfs_vertex(partnernode,visited,final_matching);
      }
    }
    return false;
  }

  const minimal_vertex_cover=()=>{
    console.log("pre",precomputedMatchings);
    const final_matching=precomputedMatchings[precomputedMatchings.length-1];
    console.log("lastele",final_matching);
    const LtoR={};
    for (const key in final_matching) {
      const {source,target}=final_matching[key];
      LtoR[source.id] = target.id;
    }
    console.log("ltor",LtoR);
    // console.log(RtoL);
    const unmatched_nodes = nodes.filter(n => n.group === "A" && !(n.id in LtoR));    
    console.log("UM",unmatched_nodes);
    const visited = new Set();

    // for (const node of unmatched_nodes) {
    //   dfs_vertex(node, visited,final_matching);
    // }
    const vertex_cover=[]

    // for(const ele of visited){
    //   console.log("vis",ele);
    // }

    // dfs ends 
    for (const node of nodes) {
      if (node.group === "A" && !visited.has(node.id)) {
        vertex_cover.push(node.id);
      }
    }


    for (const node of nodes) {
      if (node.group === "B" && visited.has(node.id)) {
        vertex_cover.push(node.id);
      }
    }

    console.log("vertex_cover",vertex_cover);
  }