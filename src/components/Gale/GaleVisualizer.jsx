// // // import React, { useState, useEffect } from 'react';
// // // import './S1.css'; 

// // // export default function GaleVisualizer({
// // //   menPreferences,
// // //   womenPreferences,
// // //   initialProposer = 'men'
// // // }) {
// // //   // 1) Algorithm (exactly as before)
// // //   function stableMatchingWithSteps(menPrefs, womenPrefs, proposerGroup) {
// // //     const men = Object.keys(menPrefs);
// // //     const women = Object.keys(womenPrefs);
// // //     const isMenProposer = proposerGroup === 'men';
// // //     const proposers = isMenProposer ? men : women;
// // //     const proposeePrefs = isMenProposer ? womenPrefs : menPrefs;
// // //     const proposerPrefs = isMenProposer ? menPrefs : womenPrefs;

// // //     const steps = [];
// // //     const freeList = [...proposers];
// // //     const proposals = {};
// // //     const engaged = {};
// // //     const manStatus = {}, womanStatus = {};

// // //     men.forEach(m => { manStatus[m] = menPrefs[m].map(() => 0); });
// // //     women.forEach(w => { womanStatus[w] = womenPrefs[w].map(() => 0); });
// // //     proposers.forEach(p => proposals[p] = new Set());

// // //     const capture = () => {
// // //       steps.push({
// // //         manStatus: JSON.parse(JSON.stringify(manStatus)),
// // //         womanStatus: JSON.parse(JSON.stringify(womanStatus)),
// // //         engaged: { ...engaged },
// // //         isMenProposer,
// // //         freeList: [...freeList],
// // //       });
// // //     };
// // //     capture();

// // //     while (freeList.length) {
// // //       const p = freeList[0];
// // //       for (let i = 0; i < proposerPrefs[p].length; i++) {
// // //         const q = proposerPrefs[p][i];
// // //         if (proposals[p].has(q)) continue;
// // //         proposals[p].add(q);

// // //         // mark rejected by default
// // //         if (isMenProposer) {
// // //           manStatus[p][i] = 2;
// // //           const j = womenPrefs[q].indexOf(p);
// // //           womanStatus[q][j] = 2;
// // //         } else {
// // //           womanStatus[p][i] = 2;
// // //           const j = menPrefs[q].indexOf(p);
// // //           manStatus[q][j] = 2;
// // //         }

// // //         if (!engaged[q]) {
// // //           engaged[q] = p;
// // //           if (isMenProposer) {
// // //             manStatus[p][i] = 1;
// // //             const j = womenPrefs[q].indexOf(p);
// // //             womanStatus[q][j] = 1;
// // //           } else {
// // //             womanStatus[p][i] = 1;
// // //             const j = menPrefs[q].indexOf(p);
// // //             manStatus[q][j] = 1;
// // //           }
// // //           freeList.shift();
// // //         } else {
// // //           const current = engaged[q];
// // //           const prefList = proposeePrefs[q];
// // //           if (prefList.indexOf(p) < prefList.indexOf(current)) {
// // //             // swap
// // //             engaged[q] = p;
// // //             if (isMenProposer) {
// // //               manStatus[p][i] = 1;
// // //               const j = womenPrefs[q].indexOf(p);
// // //               womanStatus[q][j] = 1;
// // //             } else {
// // //               womanStatus[p][i] = 1;
// // //               const j = menPrefs[q].indexOf(p);
// // //               manStatus[q][j] = 1;
// // //             }
// // //             // reject old on both sides
// // //             const oldIdx = proposerPrefs[current].indexOf(q);
// // //             if (isMenProposer) {
// // //               manStatus[current][oldIdx] = 2;
// // //               const j0 = womenPrefs[q].indexOf(current);
// // //               womanStatus[q][j0] = 2;
// // //             } else {
// // //               womanStatus[current][oldIdx] = 2;
// // //               const j0 = menPrefs[q].indexOf(current);
// // //               manStatus[q][j0] = 2;
// // //             }
// // //             freeList[0] = current;
// // //           }
// // //         }

// // //         capture();
// // //         if (engaged[q] === p) break;
// // //       }
// // //     //   if (proposals[p].size === 0) freeList.shift();
// // //     // If p has proposed to everyone and didn’t get engaged, remove from freeList
// // //         if (proposals[p].size === proposerPrefs[p].length) {
// // //             freeList.shift();
// // //         }
  
// // //     }

// // //     return steps;
// // //   }

// // //   // 2) React state
// // //   const [steps, setSteps] = useState([]);
// // //   const [idx, setIdx] = useState(0);

// // //   // 3) compute once
// // //   useEffect(() => {
// // //     setSteps(stableMatchingWithSteps(menPreferences, womenPreferences, initialProposer));
// // //   }, [menPreferences, womenPreferences, initialProposer]);

// // //   if (!steps.length) {
// // //     return <div className="loading">Computing…</div>;
// // //   }

// // //   // current snapshot
// // //   const { manStatus, womanStatus, engaged, isMenProposer, freeList } = steps[idx];

// // //   // 4) render exactly as your S1 UI
// // //   return (
// // //     <div className="visualizer">
// // //       <h1 className="title">Gale–Shapley Algorithm Visualizer</h1>

// // //       <div className="status-panel">
// // //         <h3>{isMenProposer ? 'Men proposing' : 'Women proposing'}</h3>
// // //         {freeList.length > 0 && (
// // //           <p>Free {isMenProposer ? 'men' : 'women'}: <strong>{freeList.join(', ')}</strong></p>
// // //         )}
// // //         {Object.keys(engaged).length > 0 && (
// // //           <div className="engagements">
// // //             <p>Current engagements:</p>
// // //             <ul>
// // //               {Object.entries(engaged).map(([q,p]) => (
// // //                 <li key={q}>{p} ↔ {q}</li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="participants-grid">
// // //         <div className="column">
// // //           <h2>Men</h2>
// // //           {Object.keys(menPreferences).map(m => (
// // //             <div key={m} className="person-row">
// // //               <div className={`avatar${Object.values(engaged).includes(m) ? ' engaged' : ''}`}>
// // //                 {m}
// // //               </div>
// // //               <div className="prefs">
// // //                 {menPreferences[m].map((w,i) => (
// // //                   <div key={w} className={`pref${manStatus[m][i]===1?' accepted':manStatus[m][i]===2?' rejected':''}`}>
// // //                     {w}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         <div className="column">
// // //           <h2>Women</h2>
// // //           {Object.keys(womenPreferences).map(w => (
// // //             <div key={w} className="person-row">
// // //               <div className={`avatar${Object.keys(engaged).includes(w) ? ' engaged' : ''}`}>
// // //                 {w}
// // //               </div>
// // //               <div className="prefs">
// // //                 {womenPreferences[w].map((m,i) => (
// // //                   <div key={m} className={`pref${womanStatus[w][i]===1?' accepted':womanStatus[w][i]===2?' rejected':''}`}>
// // //                     {m}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       <div className="controls">
// // //         <button onClick={() => setIdx(0)}>Reset</button>
// // //         <button onClick={() => setIdx(i => Math.max(0, i-1))} disabled={idx===0}>Previous</button>
// // //         <span>Step {idx+1} of {steps.length}</span>
// // //         <button onClick={() => setIdx(i => Math.min(steps.length-1, i+1))} disabled={idx===steps.length-1}>Next</button>
// // //       </div>

// // //       <div className="legend">
// // //         <h3>Legend</h3>
// // //         <div className="legend-items">
// // //           <div className="legend-item"><span className="dot pending"></span> Pending</div>
// // //           <div className="legend-item"><span className="dot accepted"></span> Accepted</div>
// // //           <div className="legend-item"><span className="dot rejected"></span> Rejected</div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import React, { useState, useEffect } from 'react';
// // import './S1.css';

// // export default function GaleVisualizer({
// //     menPreferences,
// //     womenPreferences,
// //     initialProposer = 'men'
// // }) {
// //     // 1) Algorithm (exactly as before)
// //     function stableMatchingWithSteps(menPrefs, womenPrefs, proposerGroup) {
// //         const men = Object.keys(menPrefs);
// //         const women = Object.keys(womenPrefs);
// //         const isMenProposer = proposerGroup === 'men';
// //         const proposers = isMenProposer ? men : women;
// //         const proposeePrefs = isMenProposer ? womenPrefs : menPrefs;
// //         const proposerPrefs = isMenProposer ? menPrefs : womenPrefs;

// //         const steps = [];
// //         const freeList = [...proposers];
// //         const proposals = {};
// //         const engaged = {};
// //         const manStatus = {}, womanStatus = {};

// //         men.forEach(m => { manStatus[m] = menPrefs[m].map(() => 0); });
// //         women.forEach(w => { womanStatus[w] = womenPrefs[w].map(() => 0); });
// //         proposers.forEach(p => proposals[p] = new Set());

// //         const capture = () => {
// //             steps.push({
// //                 manStatus: JSON.parse(JSON.stringify(manStatus)),
// //                 womanStatus: JSON.parse(JSON.stringify(womanStatus)),
// //                 engaged: { ...engaged },
// //                 isMenProposer,
// //                 freeList: [...freeList],
// //             });
// //         };
// //         capture();

// //         while (freeList.length) {
// //             const p = freeList[0];
// //             for (let i = 0; i < proposerPrefs[p].length; i++) {
// //                 const q = proposerPrefs[p][i];
// //                 if (proposals[p].has(q)) continue;
// //                 proposals[p].add(q);

// //                 // mark rejected by default
// //                 if (isMenProposer) {
// //                     manStatus[p][i] = 2;
// //                     const j = womenPrefs[q].indexOf(p);
// //                     womanStatus[q][j] = 2;
// //                 } else {
// //                     womanStatus[p][i] = 2;
// //                     const j = menPrefs[q].indexOf(p);
// //                     manStatus[q][j] = 2;
// //                 }

// //                 if (!engaged[q]) {
// //                     engaged[q] = p;
// //                     if (isMenProposer) {
// //                         manStatus[p][i] = 1;
// //                         const j = womenPrefs[q].indexOf(p);
// //                         womanStatus[q][j] = 1;
// //                     } else {
// //                         womanStatus[p][i] = 1;
// //                         const j = menPrefs[q].indexOf(p);
// //                         manStatus[q][j] = 1;
// //                     }
// //                     freeList.shift();
// //                 } else {
// //                     const current = engaged[q];
// //                     const prefList = proposeePrefs[q];
// //                     if (prefList.indexOf(p) < prefList.indexOf(current)) {
// //                         // swap
// //                         engaged[q] = p;
// //                         if (isMenProposer) {
// //                             manStatus[p][i] = 1;
// //                             const j = womenPrefs[q].indexOf(p);
// //                             womanStatus[q][j] = 1;
// //                         } else {
// //                             womanStatus[p][i] = 1;
// //                             const j = menPrefs[q].indexOf(p);
// //                             manStatus[q][j] = 1;
// //                         }
// //                         // reject old on both sides
// //                         const oldIdx = proposerPrefs[current].indexOf(q);
// //                         if (isMenProposer) {
// //                             manStatus[current][oldIdx] = 2;
// //                             const j0 = womenPrefs[q].indexOf(current);
// //                             womanStatus[q][j0] = 2;
// //                         } else {
// //                             womanStatus[current][oldIdx] = 2;
// //                             const j0 = menPrefs[q].indexOf(current);
// //                             manStatus[q][j0] = 2;
// //                         }
// //                         freeList[0] = current;
// //                     }
// //                 }

// //                 capture();
// //                 if (engaged[q] === p) break;
// //             }
// //             if (proposals[p].size === proposerPrefs[p].length) {
// //                 freeList.shift();
// //             }
// //         }

// //         return steps;
// //     }

// //     // 2) React state
// //     const [steps, setSteps] = useState([]);
// //     const [idx, setIdx] = useState(0);

// //     // 3) compute once
// //     useEffect(() => {
// //         setSteps(stableMatchingWithSteps(menPreferences, womenPreferences, initialProposer));
// //     }, [menPreferences, womenPreferences, initialProposer]);

// //     if (!steps.length) {
// //         return <div className="loading">Computing…</div>;
// //     }

// //     // current snapshot
// //     const { manStatus, womanStatus, engaged, isMenProposer, freeList } = steps[idx];

// //     // 4) render
// //     return (
// //         <div className="visualizer">
// //             <h1 className="title">Gale–Shapley Algorithm Visualizer</h1>

// //             <div className="status-panel">
// //                 <h3>{isMenProposer ? 'Men proposing' : 'Women proposing'}</h3>
// //                 {freeList.length > 0 && (
// //                     <p>Free {isMenProposer ? 'men' : 'women'}: <strong>{freeList.join(', ')}</strong></p>
// //                 )}
// //                 {Object.keys(engaged).length > 0 && (
// //                     <div className="engagements">
// //                         <p>Current engagements:</p>
// //                         <ul>
// //                             {Object.entries(engaged).map(([q, p]) => (
// //                                 <li key={q}>
// //                                     <span className="person-name">{p}</span> ↔ <span className="person-name">{q}</span>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     </div>
// //                 )}
// //             </div>

// //             <div className="participants-grid">
// //                 <div className="column men-column">
// //                     <h2>Men</h2>
// //                     {Object.keys(menPreferences).map(m => {
// //                         const isEngaged = Object.values(engaged).includes(m);
// //                         return (
// //                             <div key={m} className="person-row">
// //                                 <div className={`avatar ${isEngaged ? 'engaged' : ''} ${isEngaged ? 'highlight-circle' : ''}`}>
// //                                     <span className="person-name">{m}</span>
// //                                 </div>
// //                                 <div className="prefs">
// //                                     {menPreferences[m].map((w, i) => (
// //                                         <div key={w} className={`pref ${manStatus[m][i] === 1 ? 'accepted' : manStatus[m][i] === 2 ? 'rejected' : ''}`}>
// //                                             <span className="person-name">{w}</span>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             </div>
// //                         );
// //                     })}
// //                 </div>

// //                 <div className="column women-column">
// //                     <h2>Women</h2>
// //                     {Object.keys(womenPreferences).map(w => {
// //                         const isEngaged = Object.keys(engaged).includes(w);
// //                         return (
// //                             <div key={w} className="person-row">
// //                                 <div className={`avatar ${isEngaged ? 'engaged' : ''} ${isEngaged ? 'highlight-circle' : ''}`}>
// //                                     <span className="person-name">{w}</span>
// //                                 </div>
// //                                 <div className="prefs">
// //                                     {womenPreferences[w].map((m, i) => (
// //                                         <div key={m} className={`pref ${womanStatus[w][i] === 1 ? 'accepted' : womanStatus[w][i] === 2 ? 'rejected' : ''}`}>
// //                                             <span className="person-name">{m}</span>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             </div>
// //                         );
// //                     })}
// //                 </div>
// //             </div>

// //             <div className="controls">
// //                 <button onClick={() => setIdx(0)}>Reset</button>
// //                 <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>Previous</button>
// //                 <span>Step {idx + 1} of {steps.length}</span>
// //                 <button onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))} disabled={idx === steps.length - 1}>Next</button>
// //             </div>

// //             <div className="legend">
// //                 <h3>Legend</h3>
// //                 <div className="legend-items">
// //                     <div className="legend-item"><span className="dot pending"></span> Pending</div>
// //                     <div className="legend-item"><span className="dot accepted"></span> Accepted</div>
// //                     <div className="legend-item"><span className="dot rejected"></span> Rejected</div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// import React, { useState, useEffect } from 'react';
// import './S1.css';

// export default function GaleVisualizer({
//     menPreferences,
//     womenPreferences,
//     initialProposer = 'men'
// }) {
//     // 1) Algorithm (exactly as before)
//     function stableMatchingWithSteps(menPrefs, womenPrefs, proposerGroup) {
//         const men = Object.keys(menPrefs);
//         const women = Object.keys(womenPrefs);
//         const isMenProposer = proposerGroup === 'men';
//         const proposers = isMenProposer ? men : women;
//         const proposeePrefs = isMenProposer ? womenPrefs : menPrefs;
//         const proposerPrefs = isMenProposer ? menPrefs : womenPrefs;

//         const steps = [];
//         const freeList = [...proposers];
//         const proposals = {};
//         const engaged = {};
//         const manStatus = {}, womanStatus = {};

//         men.forEach(m => { manStatus[m] = menPrefs[m].map(() => 0); });
//         women.forEach(w => { womanStatus[w] = womenPrefs[w].map(() => 0); });
//         proposers.forEach(p => proposals[p] = new Set());

//         const capture = () => {
//             steps.push({
//                 manStatus: JSON.parse(JSON.stringify(manStatus)),
//                 womanStatus: JSON.parse(JSON.stringify(womanStatus)),
//                 engaged: { ...engaged },
//                 isMenProposer,
//                 freeList: [...freeList],
//             });
//         };
//         capture();

//         while (freeList.length) {
//             const p = freeList[0];
//             for (let i = 0; i < proposerPrefs[p].length; i++) {
//                 const q = proposerPrefs[p][i];
//                 if (proposals[p].has(q)) continue;
//                 proposals[p].add(q);

//                 // mark rejected by default
//                 if (isMenProposer) {
//                     manStatus[p][i] = 2;
//                     const j = womenPrefs[q].indexOf(p);
//                     womanStatus[q][j] = 2;
//                 } else {
//                     womanStatus[p][i] = 2;
//                     const j = menPrefs[q].indexOf(p);
//                     manStatus[q][j] = 2;
//                 }

//                 if (!engaged[q]) {
//                     engaged[q] = p;
//                     if (isMenProposer) {
//                         manStatus[p][i] = 1;
//                         const j = womenPrefs[q].indexOf(p);
//                         womanStatus[q][j] = 1;
//                     } else {
//                         womanStatus[p][i] = 1;
//                         const j = menPrefs[q].indexOf(p);
//                         manStatus[q][j] = 1;
//                     }
//                     freeList.shift();
//                 } else {
//                     const current = engaged[q];
//                     const prefList = proposeePrefs[q];
//                     if (prefList.indexOf(p) < prefList.indexOf(current)) {
//                         // swap
//                         engaged[q] = p;
//                         if (isMenProposer) {
//                             manStatus[p][i] = 1;
//                             const j = womenPrefs[q].indexOf(p);
//                             womanStatus[q][j] = 1;
//                         } else {
//                             womanStatus[p][i] = 1;
//                             const j = menPrefs[q].indexOf(p);
//                             manStatus[q][j] = 1;
//                         }
//                         // reject old on both sides
//                         const oldIdx = proposerPrefs[current].indexOf(q);
//                         if (isMenProposer) {
//                             manStatus[current][oldIdx] = 2;
//                             const j0 = womenPrefs[q].indexOf(current);
//                             womanStatus[q][j0] = 2;
//                         } else {
//                             womanStatus[current][oldIdx] = 2;
//                             const j0 = menPrefs[q].indexOf(current);
//                             manStatus[q][j0] = 2;
//                         }
//                         freeList[0] = current;
//                     }
//                 }

//                 capture();
//                 if (engaged[q] === p) break;
//             }
//             if (proposals[p].size === proposerPrefs[p].length) {
//                 freeList.shift();
//             }
//         }

//         return steps;
//     }

//     // 2) React state
//     const [steps, setSteps] = useState([]);
//     const [idx, setIdx] = useState(0);

//     // 3) compute once
//     useEffect(() => {
//         setSteps(stableMatchingWithSteps(menPreferences, womenPreferences, initialProposer));
//     }, [menPreferences, womenPreferences, initialProposer]);

//     if (!steps.length) {
//         return <div className="loading">Computing…</div>;
//     }

//     // current snapshot
//     const { manStatus, womanStatus, engaged, isMenProposer, freeList } = steps[idx];

//     // Helper function to render names with subscripts
//     const renderSubscript = (name) => {
//         return name.split('').map((char, index) => {
//             return <span key={index}>{char}</span>;
//         });
//     };

//     // 4) render
//     return (
//         <div className="visualizer">
//             <h1 className="title">Gale–Shapley Algorithm Visualizer</h1>

//             <div className="status-panel">
//                 <h3>{isMenProposer ? 'Men proposing' : 'Women proposing'}</h3>
//                 {freeList.length > 0 && (
//                     <p>
//                         Free {isMenProposer ? 'men' : 'women'}:{' '}
//                         <strong>{freeList.map(name => <span key={name} className="person-name">{renderSubscript(name)}</span>)}</strong>
//                     </p>
//                 )}
//                 {Object.keys(engaged).length > 0 && (
//                     <div className="engagements">
//                         <p>Current engagements:</p>
//                         <ul className="matches-list">
//                             {Object.entries(engaged).map(([q, p]) => (
//                                 <li key={q}>
//                                     <span className="person-name">{renderSubscript(p)}</span> ↔ <span className="person-name">{renderSubscript(q)}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>

//             <div className="participants-grid">
//                 <div className="column men-column">
//                     <h2>Men</h2>
//                     {Object.keys(menPreferences).map(m => {
//                         const isEngaged = Object.values(engaged).includes(m);
//                         const partner = Object.keys(engaged).find(w => engaged[w] === m);
//                         return (
//                             <div key={m} className="person-row">
//                                 <div className={`avatar ${isEngaged ? 'engaged' : ''} ${isEngaged ? 'highlight-circle' : ''}`}>
//                                     <span className="person-name">{renderSubscript(m)}</span>
//                                 </div>
//                                 <div className="prefs">
//                                     {menPreferences[m].map((w, i) => {
//                                         const isMatch = w === partner;
//                                         return (
//                                             <div key={w} className={`pref ${manStatus[m][i] === 1 ? 'accepted' : manStatus[m][i] === 2 ? 'rejected' : ''} ${isMatch ? 'matched-pref' : ''}`}>
//                                                 <span className="person-name">{renderSubscript(w)}</span>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="column women-column">
//                     <h2>Women</h2>
//                     {Object.keys(womenPreferences).map(w => {
//                         const isEngaged = Object.keys(engaged).includes(w);
//                         const partner = engaged[w];
//                         return (
//                             <div key={w} className="person-row">
//                                 <div className={`avatar ${isEngaged ? 'engaged' : ''} ${isEngaged ? 'highlight-circle' : ''}`}>
//                                     <span className="person-name">{renderSubscript(w)}</span>
//                                 </div>
//                                 <div className="prefs">
//                                     {womenPreferences[w].map((m, i) => {
//                                          const isMatch = m === partner;
//                                         return (
//                                             <div key={m} className={`pref ${womanStatus[w][i] === 1 ? 'accepted' : womanStatus[w][i] === 2 ? 'rejected' : ''} ${isMatch ? 'matched-pref' : ''}`}>
//                                                 <span className="person-name">{renderSubscript(m)}</span>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <div className="controls">
//                 <button onClick={() => setIdx(0)}>Reset</button>
//                 <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>Previous</button>
//                 <span>Step {idx + 1} of {steps.length}</span>
//                 <button onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))} disabled={idx === steps.length - 1}>Next</button>
//             </div>

//             <div className="legend">
//                 <h3>Legend</h3>
//                 <div className="legend-items">
//                     <div className="legend-item"><span className="dot pending"></span> Pending</div>
//                     <div className="legend-item"><span className="dot accepted"></span> Accepted</div>
//                     <div className="legend-item"><span className="dot rejected"></span> Rejected</div>
//                     <div className="legend-item"><span className="match-circle"></span> Matched Partner</div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import './S1.css';

export default function GaleVisualizer({
    menPreferences,
    womenPreferences,
    initialProposer = 'men'
}) {
    // 1) Algorithm (exactly as before)
    function stableMatchingWithSteps(menPrefs, womenPrefs, proposerGroup) {
        const men = Object.keys(menPrefs);
        const women = Object.keys(womenPrefs);
        const isMenProposer = proposerGroup === 'men';
        const proposers = isMenProposer ? men : women;
        const proposeePrefs = isMenProposer ? womenPrefs : menPrefs;
        const proposerPrefs = isMenProposer ? menPrefs : womenPrefs;

        const steps = [];
        const freeList = [...proposers];
        const proposals = {};
        const engaged = {};
        const manStatus = {}, womanStatus = {};

        men.forEach(m => { manStatus[m] = menPrefs[m].map(() => 0); });
        women.forEach(w => { womanStatus[w] = womenPrefs[w].map(() => 0); });
        proposers.forEach(p => proposals[p] = new Set());

        const capture = () => {
            steps.push({
                manStatus: JSON.parse(JSON.stringify(manStatus)),
                womanStatus: JSON.parse(JSON.stringify(womanStatus)),
                engaged: { ...engaged },
                isMenProposer,
                freeList: [...freeList],
            });
        };
        capture();

        while (freeList.length) {
            const p = freeList[0];
            for (let i = 0; i < proposerPrefs[p].length; i++) {
                const q = proposerPrefs[p][i];
                if (proposals[p].has(q)) continue;
                proposals[p].add(q);

                // mark rejected by default
                if (isMenProposer) {
                    manStatus[p][i] = 2;
                    const j = womenPrefs[q].indexOf(p);
                    womanStatus[q][j] = 2;
                } else {
                    womanStatus[p][i] = 2;
                    const j = menPrefs[q].indexOf(p);
                    manStatus[q][j] = 2;
                }

                if (!engaged[q]) {
                    engaged[q] = p;
                    if (isMenProposer) {
                        manStatus[p][i] = 1;
                        const j = womenPrefs[q].indexOf(p);
                        womanStatus[q][j] = 1;
                    } else {
                        womanStatus[p][i] = 1;
                        const j = menPrefs[q].indexOf(p);
                        manStatus[q][j] = 1;
                    }
                    freeList.shift();
                } else {
                    const current = engaged[q];
                    const prefList = proposeePrefs[q];
                    if (prefList.indexOf(p) < prefList.indexOf(current)) {
                        // swap
                        engaged[q] = p;
                        if (isMenProposer) {
                            manStatus[p][i] = 1;
                            const j = womenPrefs[q].indexOf(p);
                            womanStatus[q][j] = 1;
                        } else {
                            womanStatus[p][i] = 1;
                            const j = menPrefs[q].indexOf(p);
                            manStatus[q][j] = 1;
                        }
                        // reject old on both sides
                        const oldIdx = proposerPrefs[current].indexOf(q);
                        if (isMenProposer) {
                            manStatus[current][oldIdx] = 2;
                            const j0 = womenPrefs[q].indexOf(current);
                            womanStatus[q][j0] = 2;
                        } else {
                            womanStatus[current][oldIdx] = 2;
                            const j0 = menPrefs[q].indexOf(current);
                            manStatus[q][j0] = 2;
                        }
                        freeList[0] = current;
                    }
                }

                capture();
                if (engaged[q] === p) break;
            }
            if (proposals[p].size === proposerPrefs[p].length) {
                freeList.shift();
            }
        }

        return steps;
    }

    // 2) React state
    const [steps, setSteps] = useState([]);
    const [idx, setIdx] = useState(0);

    // 3) compute once
    useEffect(() => {
        setSteps(stableMatchingWithSteps(menPreferences, womenPreferences, initialProposer));
    }, [menPreferences, womenPreferences, initialProposer]);

    if (!steps.length) {
        return <div className="loading">Computing…</div>;
    }

    // current snapshot
    const { manStatus, womanStatus, engaged, isMenProposer, freeList } = steps[idx];

    // Helper function to render names with subscripts
    const renderSubscript = (name) => {
        return name.split('').map((char, index) => {
            if (char === 'M' || char === 'W') {
                return <span key={index}>{char}</span>; // Keep M and W as regular text
            } else {
                return <sub key={index}>{char}</sub>; // Subscript for numbers
            }
        });
    };

    // 4) render
    return (
        <div className="visualizer">
            <h1 className="title">Gale–Shapley Algorithm Visualizer</h1>

            <div className="status-panel">
                <h3>{isMenProposer ? 'Men proposing' : 'Women proposing'}</h3>
                {freeList.length > 0 && (
                    <p>
                        Free {isMenProposer ? 'men' : 'women'}:{' '}
                        {/* <strong>{freeList.map(name => <span key={name} className="person-name">{renderSubscript(name)}</span>).join(', ')}</strong> */}
                        <strong>
                            {freeList.map((name, index) => (
                                <React.Fragment key={name}>
                                    {index > 0 && ', '}
                                    <span className="person-name">{renderSubscript(name)}</span>
                                </React.Fragment>
                            ))}
                        </strong>
                    </p>
                )}
                {Object.keys(engaged).length > 0 && (
                    <div className="engagements">
                        <p>Current engagements:</p>
                        <ul className="matches-list">
                            {Object.entries(engaged).map(([q, p]) => (
                                <li key={q}>
                                    <span className="person-name">{renderSubscript(p)}</span> ↔ <span className="person-name">{renderSubscript(q)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="participants-grid">
                <div className="column men-column">
                    <h2>Men</h2>
                    {Object.keys(menPreferences).map(m => {
                        const isEngaged = Object.values(engaged).includes(m);
                        const partner = Object.keys(engaged).find(w => engaged[w] === m);
                        return (
                            <div key={m} className="person-row">
                                <div className={`avatar ${isEngaged ? 'engaged' : ''} ${isEngaged ? 'highlight-circle' : ''}`}>
                                    <span className="person-name">{renderSubscript(m)}</span>
                                </div>
                                <div className="prefs">
                                    {menPreferences[m].map((w, i) => {
                                        const isMatch = w === partner;
                                        return (
                                            <div key={w} className={`pref ${manStatus[m][i] === 1 ? 'accepted' : manStatus[m][i] === 2 ? 'rejected' : ''} ${isMatch ? 'matched-pref' : ''}`}>
                                                <span className="person-name">{renderSubscript(w)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="column women-column">
                    <h2>Women</h2>
                    {Object.keys(womenPreferences).map(w => {
                        const isEngaged = Object.keys(engaged).includes(w);
                        const partner = engaged[w];
                        return (
                            <div key={w} className="person-row">
                                <div className={`avatar ${isEngaged ? 'engaged' : ''} ${isEngaged ? 'highlight-circle' : ''}`}>
                                    <span className="person-name">{renderSubscript(w)}</span>
                                </div>
                                <div className="prefs">
                                    {womenPreferences[w].map((m, i) => {
                                        const isMatch = m === partner;
                                        return (
                                            <div key={m} className={`pref ${womanStatus[w][i] === 1 ? 'accepted' : womanStatus[w][i] === 2 ? 'rejected' : ''} ${isMatch ? 'matched-pref' : ''}`}>
                                                <span className="person-name">{renderSubscript(m)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="controls">
                <button onClick={() => setIdx(0)}>Reset</button>
                <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>Previous</button>
                <span>Step {idx + 1} of {steps.length}</span>
                <button onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))} disabled={idx === steps.length - 1}>Next</button>
            </div>

            <div className="legend">
                <h3>Legend</h3>
                <div className="legend-items">
                    <div className="legend-item"><span className="dot pending"></span> Pending</div>
                    <div className="legend-item"><span className="dot accepted matched"></span> Accepted & Matched</div>
                    <div className="legend-item"><span className="dot rejected"></span> Rejected</div>
                </div>
            </div>
        </div>
    );
}

