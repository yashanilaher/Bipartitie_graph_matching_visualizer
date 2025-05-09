// // src/components/Gale/S1.jsx
// import React, { useState, useEffect } from 'react';
// import './S1.css';

// function stableMatchingWithSteps(menPreferences, womenPreferences) {
//   if (!menPreferences || !womenPreferences) return [];

//   const men = Object.keys(menPreferences);
//   const women = Object.keys(womenPreferences);
//   if (!men.length || !women.length) return [];

//   const steps = [];
//   const freeList = [...men];
//   const proposals = {}, engaged = {}, manStatus = {}, womanStatus = {};

//   // Initialize status arrays
//   men.forEach(m => {
//     proposals[m] = new Set();
//     manStatus[m] = new Array(menPreferences[m].length).fill(0);
//   });
//   women.forEach(w => {
//     womanStatus[w] = new Array(womenPreferences[w].length).fill(0);
//   });

//   // Capture snapshot
//   const capture = () => steps.push({
//     manStatus: JSON.parse(JSON.stringify(manStatus)),
//     womanStatus: JSON.parse(JSON.stringify(womanStatus)),
//     engaged: { ...engaged },
//     freeList: [...freeList],
//   });
//   capture();

//   while (freeList.length) {
//     const m = freeList[0];
//     for (let i = 0; i < menPreferences[m].length; i++) {
//       const w = menPreferences[m][i];
//       if (proposals[m].has(w)) continue;
//       proposals[m].add(w);
//       manStatus[m][i] = 2;
//       const rankM = womenPreferences[w].indexOf(m);
//       womanStatus[w][rankM] = 2;

//       if (!engaged[w]) {
//         engaged[w] = m;
//         manStatus[m][i] = 1;
//         womanStatus[w][rankM] = 1;
//         freeList.shift();
//       } else {
//         const m0 = engaged[w];
//         if (womenPreferences[w].indexOf(m) < womenPreferences[w].indexOf(m0)) {
//           // w prefers m over previous
//           engaged[w] = m;
//           manStatus[m][i] = 1;
//           womanStatus[w][rankM] = 1;
//           // reject old
//           const i0 = menPreferences[m0].indexOf(w);
//           manStatus[m0][i0] = 2;
//           freeList[0] = m0;
//         }
//       }

//       capture();
//       if (engaged[w] === m) break;
//     }

//     // If m exhausted all proposals, remove
//     if (proposals[m].size === 0) {
//       freeList.shift();
//     }
//   }

//   return steps;
// }

// function PersonRow({ person, prefs, status, engagedPartner }) {
//   return (
//     <div className="person-row">
//       <div className={`person-avatar ${engagedPartner ? 'engaged' : ''}`}>
//         {person}
//       </div>
//       <div className="preferences">
//         {prefs.map((p, i) => (
//           <div
//             key={p}
//             className={`pref ${
//               status[i] === 1 ? 'accepted' :
//               status[i] === 2 ? 'rejected' :
//               ''
//             }`}
//           >
//             {p}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function S1() {
//   // 1) State hooks at top
//   const [steps, setSteps] = useState([]);
//   const [idx, setIdx] = useState(0);

//   const menPrefs = {
//     A: ['X','Y','Z'],
//     B: ['Y','X','Z'],
//     C: ['Y','Z','X'],
//     D: ['X','Y','Z'],
//   };
//   const womenPrefs = {
//     X: ['B','A','C','D'],
//     Y: ['C','B','A','D'],
//     Z: ['C','B','D','A'],
//   };

//   // 2) Single effect to generate steps
//   useEffect(() => {
//     const output = stableMatchingWithSteps(menPrefs, womenPrefs);
//     console.log("Steps generated:", output);
//     setSteps(output);
//   }, []);

//   // 3) Safe defaults so destructuring never tries `Object.values(undefined)`
//   const rawStep = steps[idx] || {};
//   const {
//     manStatus = {},
//     womanStatus = {},
//     engaged = {},
//   } = rawStep;

//   // If no steps yet, show loading
//   if (!steps.length) {
//     return <div className="s1-container">Loading steps…</div>;
//   }

//   return (
//     <div className="s1-container">
//       <h1>Gale–Shapley Step-by-Step</h1>
//       <div className="tables">
//         <div>
//           <h2>Men</h2>
//           {Object.keys(menPrefs).map(m => (
//             <PersonRow
//               key={m}
//               person={m}
//               prefs={menPrefs[m]}
//               status={manStatus[m] || []}
//               engagedPartner={Object.values(engaged).includes(m)}
//             />
//           ))}
//         </div>
//         <div>
//           <h2>Women</h2>
//           {Object.keys(womenPrefs).map(w => (
//             <PersonRow
//               key={w}
//               person={w}
//               prefs={womenPrefs[w]}
//               status={womanStatus[w] || []}
//               engagedPartner={!!engaged[w]}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="controls">
//         <button
//           onClick={() => setIdx(i => Math.max(0, i - 1))}
//           disabled={idx === 0}
//         >
//           Back
//         </button>
//         <span>Step {idx + 1} of {steps.length}</span>
//         <button
//           onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))}
//           disabled={idx === steps.length - 1}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

////////////////////////////////////


// import { useState, useEffect } from 'react';

// // Modified stableMatching function to collect steps
// function stableMatchingWithSteps(menPreferences, womenPreferences, proposerGroup = 'men') {
//   const men = Object.keys(menPreferences);
//   const women = Object.keys(womenPreferences);

//   const isMenProposer = proposerGroup === 'men';
//   const proposers = isMenProposer ? men : women;
//   const proposees = isMenProposer ? women : men;
//   const proposerPrefs = isMenProposer ? menPreferences : womenPreferences;
//   const proposeePrefs = isMenProposer ? womenPreferences : menPreferences;

//   const steps = [];
//   const freeList = [...proposers];
//   const proposals = {};
//   const engaged = {};
//   const manStatus = {};
//   const womanStatus = {};

//   // Initialize data structures
//   for (const m of men) manStatus[m] = menPreferences[m].map(() => 0);
//   for (const w of women) womanStatus[w] = womenPreferences[w].map(() => 0);
//   for (const p of proposers) proposals[p] = new Set();

//   function captureStep() {
//     steps.push({
//       manStatus: JSON.parse(JSON.stringify(manStatus)),
//       womanStatus: JSON.parse(JSON.stringify(womanStatus)),
//       engaged: JSON.parse(JSON.stringify(engaged)),
//       isMenProposer,
//       freeList: [...freeList],
//     });
//   }

//   captureStep(); // Initial state

//   while (freeList.length > 0) {
//     const p = freeList[0];
//     const prefs = proposerPrefs[p];
//     let madeProposal = false;

//     for (let i = 0; i < prefs.length; i++) {
//       const q = prefs[i];
//       if (proposals[p].has(q)) continue;
//       proposals[p].add(q);
//       madeProposal = true;

//       // Update statuses
//       manStatus[p][i] = 2; // Assume rejection first
//       const qPrefs = proposeePrefs[q];
//       const j = qPrefs.indexOf(p);
//       if (isMenProposer) womanStatus[q][j] = 2;
//       else manStatus[q][j] = 2;

//       if (!engaged[q]) {
//         // Engagement
//         engaged[q] = p;
//         manStatus[p][i] = 1;
//         if (isMenProposer) womanStatus[q][j] = 1;
//         else manStatus[q][j] = 1;
//         freeList.shift();
//       } else {
//         const p0 = engaged[q];
//         if (qPrefs.indexOf(p) < qPrefs.indexOf(p0)) {
//           // Swap engagement
//           engaged[q] = p;
//           manStatus[p][i] = 1;
//           if (isMenProposer) womanStatus[q][j] = 1;
//           else manStatus[q][j] = 1;

//           // Reject previous
//           const i0 = proposerPrefs[p0].indexOf(q);
//           manStatus[p0][i0] = 2;
//           const j0 = proposeePrefs[q].indexOf(p0);
//           if (isMenProposer) womanStatus[q][j0] = 2;
//           else manStatus[q][j0] = 2;

//           freeList[0] = p0;
//         }
//       }

//       captureStep();
//       if (engaged[q] === p) break;
//     }

//     if (!madeProposal) freeList.shift();
//   }

//   return steps;
// }

// // Example preferences
// const menPrefs = {
//   A: ['X', 'Y', 'Z'],
//   B: ['Y', 'X', 'Z'],
//   C: ['Y', 'Z', 'X'],
//   D: ['X', 'Y', 'Z']
// };

// const womenPrefs = {
//   X: ['B', 'A', 'C', 'D'],
//   Y: ['C', 'B', 'A', 'D'],
//   Z: ['C', 'B', 'D', 'A']
// };

// function PersonRow({ person, type, prefs, status, engaged, isProposer }) {
//   const isEngaged = isProposer 
//     ? Object.values(engaged).includes(person)
//     : Object.keys(engaged).includes(person);

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 1: return 'bg-green-500 text-white';
//       case 2: return 'bg-red-500 text-white';
//       default: return 'bg-gray-300';
//     }
//   };

//   return (
//     <div className="flex items-center my-2 p-3 bg-gray-100 rounded-lg">
//       <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold ${isEngaged ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
//         {person}
//       </div>
//       <div className="flex gap-2 overflow-x-auto py-2">
//         {prefs.map((pref, idx) => (
//           <div
//             key={pref}
//             className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${getStatusClass(status[idx])}`}
//           >
//             {pref}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function S1() {
//   const [steps, setSteps] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);

//   useEffect(() => {
//     const generatedSteps = stableMatchingWithSteps(menPrefs, womenPrefs, 'men');
//     setSteps(generatedSteps);
//   }, []);

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
//   };

//   const handlePrev = () => {
//     if (currentStep > 0) setCurrentStep(s => s - 1);
//   };

//   const handleReset = () => {
//     setCurrentStep(0);
//   };

//   const handleSwitch = () => {
//     const newSteps = stableMatchingWithSteps(menPrefs, womenPrefs, 
//       steps[0]?.isMenProposer ? 'women' : 'men');
//     setSteps(newSteps);
//     setCurrentStep(0);
//   };

//   if (!steps.length) return <div className="p-4">Loading...</div>;

//   const currentState = steps[currentStep];
//   const { manStatus, womanStatus, engaged, isMenProposer, freeList } = currentState;
//   const men = Object.keys(menPrefs);
//   const women = Object.keys(womenPrefs);

//   return (
//     <div className="p-5 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-6">Gale-Shapley Algorithm Visualizer</h1>
      
//       <div className="mb-4 p-4 bg-blue-50 rounded-lg">
//         <h3 className="font-bold mb-2">
//           {isMenProposer ? 'Men proposing to women' : 'Women proposing to men'}
//         </h3>
//         {freeList.length > 0 && (
//           <p>Free {isMenProposer ? 'men' : 'women'}: {freeList.join(', ')}</p>
//         )}
//         {Object.keys(engaged).length > 0 && (
//           <div className="mt-2">
//             <p>Current engagements:</p>
//             <ul className="list-disc ml-5">
//               {Object.entries(engaged).map(([k, v]) => (
//                 <li key={k}>{v} — {k}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
//         <div>
//           <h2 className="text-xl font-bold mb-2">Men</h2>
//           {men.map(man => (
//             <PersonRow
//               key={man}
//               person={man}
//               type="man"
//               prefs={menPrefs[man]}
//               status={manStatus[man]}
//               engaged={engaged}
//               isProposer={isMenProposer}
//             />
//           ))}
//         </div>

//         <div>
//           <h2 className="text-xl font-bold mb-2">Women</h2>
//           {women.map(woman => (
//             <PersonRow
//               key={woman}
//               person={woman}
//               type="woman"
//               prefs={womenPrefs[woman]}
//               status={womanStatus[woman]}
//               engaged={engaged}
//               isProposer={!isMenProposer}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="text-center space-x-2">
//         <button 
//           onClick={handleReset} 
//           className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
//           Reset
//         </button>
//         <button 
//           onClick={handlePrev} 
//           disabled={currentStep <= 0}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
//           Previous
//         </button>
//         <button 
//           onClick={handleNext} 
//           disabled={currentStep >= steps.length - 1}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
//           Next
//         </button>
//         <button 
//           onClick={handleSwitch}
//           className="px-4 py-2 bg-purple-500 text-white rounded">
//           Switch Proposers
//         </button>
//       </div>
      
//       <div className="text-center mt-4">
//         Step {currentStep + 1} of {steps.length}
//       </div>
      
//       <div className="mt-8 p-4 bg-gray-50 rounded-lg">
//         <h3 className="font-bold mb-2">Legend</h3>
//         <div className="flex gap-4 justify-center flex-wrap">
//           <div className="flex items-center">
//             <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
//             <span>Pending</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-6 h-6 rounded-full bg-green-500 mr-2"></div>
//             <span>Accepted</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-6 h-6 rounded-full bg-red-500 mr-2"></div>
//             <span>Rejected</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

////////////////////////////////

import React, { useState, useEffect } from 'react';
import GaleVisualizer from './GaleVisualizer';

import './S1.css';

export default function S1() {
  const menPrefs = {
    A: ['X','Y','Z'],
    B: ['Y','X','Z'],
    C: ['Y','Z','X'],
    D: ['X','Y','Z']
  };
  const womenPrefs = {
    X: ['B','A','C','D'],
    Y: ['C','B','A','D'],
    Z: ['C','B','D','A']
  };

  return (
    <GaleVisualizer
      menPreferences={menPrefs}
      womenPreferences={womenPrefs}
      initialProposer="men"
    />
  );

  
}
