import React from 'react';

const GaleAlgorithm = () => {
  return (
    <div className="algorithm-container">
      <h2 className="algorithm-title">Gale-Shapley Algorithm</h2>
      <div className="algorithm-card">
        <pre className="algorithm-code">
        <code>
{`function bergeAlgorithm(graph, matching = []):
  while (true):
    // Find an alternating path starting at unmatched vertex in A
    // ending at unmatched vertex in B
    path = findAugmentingPath(graph, matching)
    
    if path == null:
      break  // Maximum Matching Reached
      
    // Augment: flip matched/unmatched edges along the path
    // (Remove matched edges in path, add unmatched edges)
    matching = symmetricDifference(matching, path)
  
  return matching

// Berge's Theorem: There no M Augmenting Path for M Matchng`}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default GaleAlgorithm;