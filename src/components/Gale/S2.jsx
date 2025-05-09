
// import React, { useState, useEffect } from 'react';
// import GaleVisualizer from './GaleVisualizer';

// import './S1.css';

// export default function S2() {
//   const menPrefs = {
//     A: ['X','Y','Z'],
//     B: ['Y','X','Z'],
//     C: ['Y','Z','X'],
//     D: ['X','Y','Z']
//   };
//   const womenPrefs = {
//     X: ['B','A','C','D'],
//     Y: ['C','B','A','D'],
//     Z: ['C','B','D','A']
//   };

//   return (
//     <GaleVisualizer
//       menPreferences={menPrefs}
//       womenPreferences={womenPrefs}
//       initialProposer="men"
//     />
//   );

  
// }
import React from 'react';
import GaleVisualizer from './GaleVisualizer';
import { instances } from './StaticInputs'; 
import './S1.css';

export default function S2() {
  const { menPrefs, womenPrefs, initialProposer } = instances[1]; 

  return (
    <GaleVisualizer
      menPreferences={menPrefs}
      womenPreferences={womenPrefs}
      initialProposer={initialProposer}
    />
  );
}
