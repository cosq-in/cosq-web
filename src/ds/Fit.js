import React from 'react';

// Shows `children` normally and `short` on phones (see .fit-* in tokens.css),
// so long copy can be paraphrased where it would otherwise wrap awkwardly.
const Fit = ({ short, children }) => (
  <>
    <span className="fit-full">{children}</span>
    <span className="fit-short">{short}</span>
  </>
);

export default Fit;
