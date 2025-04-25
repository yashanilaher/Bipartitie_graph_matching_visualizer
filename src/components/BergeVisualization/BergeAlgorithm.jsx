import React from 'react';

const BergeAlgorithm = () => {
  return (
    <div className="algorithm-container">
      <h2 className="algorithm-title">Berge's Algorithm</h2>
      <div className="algorithm-card">
        <pre className="algorithm-code">
        <code>
{`function bergeAlgorithm(graph, matching = []):
  while (true):
    // Find an alternating path starting at unmatched vertex in A
    // ending at unmatched vertex in B
    path = findAugmentingPath(graph, matching)
    
    if path == null:
      break  // No more augmenting paths, matching is maximum
      
    // Augment: flip matched/unmatched edges along the path
    // (Remove matched edges in path, add unmatched edges)
    matching = symmetricDifference(matching, path)
  
  return matching

// Berge's Theorem: A matching is maximum if and only if
// there is no augmenting path.`}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default BergeAlgorithm;