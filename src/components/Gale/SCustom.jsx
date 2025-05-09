import React, { useState } from 'react';
import GaleVisualizer from './GaleVisualizer';
import './SCustom.css';

export default function SCustom() {
  const [stage, setStage] = useState('setup'); // 'setup' | 'prefs' | 'run'
  const [numMen, setNumMen] = useState(3);
  const [numWomen, setNumWomen] = useState(3);

  const [men, setMen] = useState([]);
  const [women, setWomen] = useState([]);
  const [menPrefs, setMenPrefs] = useState({});
  const [womenPrefs, setWomenPrefs] = useState({});

  // initialize names & default prefs
  const handleSetup = () => {
    const m = Array.from({ length: numMen }, (_, i) => `M${i+1}`);
    const w = Array.from({ length: numWomen }, (_, i) => `W${i+1}`);
    setMen(m); setWomen(w);
    setMenPrefs(Object.fromEntries(m.map(x => [x, [...w]])));
    setWomenPrefs(Object.fromEntries(w.map(x => [x, [...m]])));
    setStage('prefs');
  };

  // swap in array
  function move(arr, from, to) {
    const c = [...arr], [x] = c.splice(from,1);
    c.splice(to,0,x); return c;
  }

  // up/down buttons
  const movePref = (group, who, i, dir) => {
    const prefs = group==='men'? menPrefs[who] : womenPrefs[who];
    const j = dir==='up'? i-1 : i+1;
    if (j<0 || j>=prefs.length) return;
    const updated = move(prefs,i,j);
    group==='men'
      ? setMenPrefs({...menPrefs, [who]:updated})
      : setWomenPrefs({...womenPrefs, [who]:updated});
  };

  if (stage==='setup') {
    return (
      <div className="custom-vis">
        <h2>Custom Gale–Shapley</h2>
        <label>#Men: <input type="number" min="1" value={numMen} onChange={e=>setNumMen(+e.target.value)}/></label>
        <label>#Women: <input type="number" min="1" value={numWomen} onChange={e=>setNumWomen(+e.target.value)}/></label>
        <button onClick={handleSetup}>Next: Preferences</button>
      </div>
    );
  }

  if (stage==='prefs') {
    return (
      <div className="custom-vis">
        <h2>Arrange Preferences</h2>
        <div className="prefs-grid">
          <div>
            <h3>Men</h3>
            {men.map(m => (
              <div key={m} className="prefs-list">
                <strong>{m}</strong>
                {menPrefs[m].map((w,i) => (
                  <div key={w} className="prefs-item">
                    <button onClick={()=>movePref('men',m,i,'up')} disabled={i===0}>▲</button>
                    <span>{w}</span>
                    <button onClick={()=>movePref('men',m,i,'down')} disabled={i===menPrefs[m].length-1}>▼</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <h3>Women</h3>
            {women.map(w => (
              <div key={w} className="prefs-list">
                <strong>{w}</strong>
                {womenPrefs[w].map((m,i) => (
                  <div key={m} className="prefs-item">
                    <button onClick={()=>movePref('women',w,i,'up')} disabled={i===0}>▲</button>
                    <span>{m}</span>
                    <button onClick={()=>movePref('women',w,i,'down')} disabled={i===womenPrefs[w].length-1}>▼</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>setStage('run')} className="run-btn">Run Algorithm</button>
      </div>
    );
  }

  // stage === 'run'
  return (
    <GaleVisualizer
      menPreferences={menPrefs}
      womenPreferences={womenPrefs}
      initialProposer="men"
    />
  );
}
