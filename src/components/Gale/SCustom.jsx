
import React, { useState } from 'react';
import GaleVisualizer from './GaleVisualizer';
import './SCustom.css';

export default function SCustom() {
  const [stage, setStage] = useState('setup'); // 'setup' | 'prefs' | 'run'
  const [numMen, setNumMen] = useState(3);
  const [numWomen, setNumWomen] = useState(3);
  const [initialProposer, setInitialProposer] = useState('men');

  const [men, setMen] = useState([]);
  const [women, setWomen] = useState([]);
  const [menPrefs, setMenPrefs] = useState({});
  const [womenPrefs, setWomenPrefs] = useState({});

  // initialize names & default prefs
  const handleSetup = () => {
    const m = Array.from({ length: numMen }, (_, i) => `M${i+1}`);
    const w = Array.from({ length: numWomen }, (_, i) => `W${i+1}`);
    setMen(m);
    setWomen(w);
    setMenPrefs(Object.fromEntries(m.map(x => [x, [...w]])));
    setWomenPrefs(Object.fromEntries(w.map(x => [x, [...m]])));
    setStage('prefs');
  };

  // swap in array
  function move(arr, from, to) {
    const c = [...arr],
      [x] = c.splice(from, 1);
    c.splice(to, 0, x);
    return c;
  }

  // up/down buttons
  const movePref = (group, who, i, dir) => {
    const prefs = group === 'men' ? menPrefs[who] : womenPrefs[who];
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= prefs.length) return;
    const updated = move(prefs, i, j);
    group === 'men'
      ? setMenPrefs({ ...menPrefs, [who]: updated })
      : setWomenPrefs({ ...womenPrefs, [who]: updated });
  };

  if (stage === 'setup') {
    return (
      <div className="custom-vis">
        <h2 className="setup-title">Custom Gale–Shapley Setup</h2>
        <div className="setup-cards">
          <div className="card">
            <label>
              <span>Number of Men</span>
              <input
                type="number"
                min="1"
                value={numMen}
                onChange={(e) => setNumMen(+e.target.value)}
              />
            </label>
          </div>
          <div className="card">
            <label>
              <span>Number of Women</span>
              <input
                type="number"
                min="1"
                value={numWomen}
                onChange={(e) => setNumWomen(+e.target.value)}
              />
            </label>
          </div>
          <div className="card proposer-card">
            <p>Who proposes?</p>
            <label>
              <input
                type="radio"
                name="proposer"
                value="men"
                checked={initialProposer === 'men'}
                onChange={() => setInitialProposer('men')}
              />
              <div className='names'>
                Men 
              </div>
            </label>
            <label>
              <input
                type="radio"
                name="proposer"
                value="women"
                checked={initialProposer === 'women'}
                onChange={() => setInitialProposer('women')}
              />
              <div className='names'>
                Women
              </div>
            </label>
          </div>
        </div>
        <div className="setup-instructions">
          <h3>📘 How to Use</h3>
          <ol>
            <li>Enter the number of men and women.</li>
            <li>Select who proposes in the algorithm.</li>
            <li>Click "Next" to arrange preferences.</li>
            <li>Use ▲▼ buttons to reorder individual preferences.</li>
            <li>Run the Gale–Shapley algorithm and observe the matching!</li>
          </ol>
        </div>
        <div className='btn-div'>
          <button className="btn-primary" onClick={handleSetup}>
            Next &mdash; Arrange Preferences
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'prefs') {
  return (
    <div className="custom-vis prefs-stage">
      <h2 className="prefs-title">Arrange Preferences</h2>
      <div className="prefs-grid">
        <div className="prefs-column">
          <h3>Men</h3>
          {men.map((m) => (
            <div key={m} className="prefs-list">
              <strong>{m}</strong>
              {menPrefs[m].map((w, i) => (
                <div key={w} className="prefs-item">
                  <button
                    className="move-btn"
                    onClick={() => movePref('men', m, i, 'up')}
                    disabled={i === 0}
                  >
                    ▲
                  </button>
                  <span className="pref-name">{w}</span>
                  <button
                    className="move-btn"
                    onClick={() => movePref('men', m, i, 'down')}
                    disabled={i === menPrefs[m].length - 1}
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="prefs-column">
          <h3>Women</h3>
          {women.map((w) => (
            <div key={w} className="prefs-list">
              <strong>{w}</strong>
              {womenPrefs[w].map((m, i) => (
                <div key={m} className="prefs-item">
                  <button
                    className="move-btn"
                    onClick={() => movePref('women', w, i, 'up')}
                    disabled={i === 0}
                  >
                    ▲
                  </button>
                  <span className="pref-name">{m}</span>
                  <button
                    className="move-btn"
                    onClick={() => movePref('women', w, i, 'down')}
                    disabled={i === womenPrefs[w].length - 1}
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="run-btn-wrapper">
        <button onClick={() => setStage('run')} className="run-btn">
          Run Algorithm
        </button>
      </div>
    </div>
  );
}


  // stage === 'run'
  return (
    <GaleVisualizer
      menPreferences={menPrefs}
      womenPreferences={womenPrefs}
      initialProposer={initialProposer}
    />
  );
}
