// // src/components/Gale/GaleVisualization.jsx
// import React from 'react';
// import '../Gale/S1.css'; // reuse the same stylesheet

// function PersonRow({ person, prefs, status = [], engaged, isProposer }) {
//   const isEngaged = isProposer
//     ? Object.values(engaged).includes(person)
//     : Object.keys(engaged).includes(person);

//   return (
//     <div className="person-row">
//       <div className={`avatar${isEngaged ? ' engaged' : ''}`}>
//         {person}
//       </div>
//       <div className="prefs">
//         {prefs.map((p, i) => (
//           <div
//             key={p}
//             className={`pref${
//               status[i] === 1 ? ' accepted' :
//               status[i] === 2 ? ' rejected' : ''
//             }`}
//           >
//             {p}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function GaleVisualization({
//   menPrefs,
//   womenPrefs,
//   steps,
//   currentStep,
//   onNext,
//   onPrev,
//   onReset,
//   onSwitch
// }) {
//   const {
//     manStatus = {},
//     womanStatus = {},
//     engaged = {},
//     isMenProposer,
//     freeList = []
//   } = steps[currentStep];

//   return (
//     <div className="visualizer">
//       <h1 className="title">Gale–Shapley Algorithm Visualizer</h1>

//       <div className="status-panel">
//         <h3>
//           {isMenProposer ? 'Men proposing' : 'Women proposing'}
//         </h3>
//         {freeList.length > 0 && (
//           <p>
//             Free {isMenProposer ? 'men' : 'women'}:&nbsp;
//             <strong>{freeList.join(', ')}</strong>
//           </p>
//         )}
//         {Object.keys(engaged).length > 0 && (
//           <div className="engagements">
//             <p>Current engagements:</p>
//             <ul>
//               {Object.entries(engaged).map(([q, p]) => (
//                 <li key={q}>{p} ↔ {q}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <div className="participants-grid">
//         <div className="column">
//           <h2>Men</h2>
//           {Object.keys(menPrefs).map(m => (
//             <PersonRow
//               key={m}
//               person={m}
//               prefs={menPrefs[m]}
//               status={manStatus[m]}
//               engaged={engaged}
//               isProposer={isMenProposer}
//             />
//           ))}
//         </div>
//         <div className="column">
//           <h2>Women</h2>
//           {Object.keys(womenPrefs).map(w => (
//             <PersonRow
//               key={w}
//               person={w}
//               prefs={womenPrefs[w]}
//               status={womanStatus[w]}
//               engaged={engaged}
//               isProposer={!isMenProposer}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="controls">
//         <button onClick={onReset}>Reset</button>
//         <button onClick={onPrev} disabled={currentStep === 0}>
//           Previous
//         </button>
//         <span>Step {currentStep + 1} of {steps.length}</span>
//         <button onClick={onNext} disabled={currentStep === steps.length - 1}>
//           Next
//         </button>
//         <button onClick={onSwitch}>Switch Proposers</button>
//       </div>

//       <div className="legend">
//         <h3>Legend</h3>
//         <div className="legend-items">
//           <div className="legend-item">
//             <span className="dot pending"></span> Pending
//           </div>
//           <div className="legend-item">
//             <span className="dot accepted"></span> Accepted
//           </div>
//           <div className="legend-item">
//             <span className="dot rejected"></span> Rejected
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


////////////////////////


