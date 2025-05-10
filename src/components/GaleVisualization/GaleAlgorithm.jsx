import React from 'react';

const GaleAlgorithm = () => {
  return (
    <div className="algorithm-container">
      <h2 className="algorithm-title">Gale-Shapley Algorithm</h2>
      <div className="algorithm-card">
        <pre className="algorithm-code">
        <code>
{

`function galeShapley(menPreference, womenPreference):

   Everyone begins unmatched and has a ranked list of partners they prefer.

    While there is an unmatched proposer with someone left on their list:
    a. That proposer asks the next person on their list.
    b. If the person is unmatched or prefers this new proposer over their current
       match, they say “yes” and form or switch the match.
    c. Otherwise, they say “no,” and the proposer remains unmatched for now.

   Repeat until no proposer can make any more proposals.

The remaining matches are stable.`


}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default GaleAlgorithm;