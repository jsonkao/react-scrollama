import React from 'react';

// Since these styles are the only styles in the library, I opted to use inline
// styling to maintain dependency independence
const markerStyles = {
  position: 'fixed',
  left: 0,
  width: '100%',
  height: 0,
  borderTop: '2px dashed black',
  zIndex: 9999,
};
const offsetTextStyles = {
  fontSize: '12px',
  fontFamily: 'monospace',
  margin: 0,
  padding: 6,
};

const DebugOffset = ({ offsetMargin, offsetVal }) => (
  <div style={{ ...markerStyles, top: offsetMargin }}>
    <p style={offsetTextStyles}>trigger: {offsetVal}</p>
  </div>
);

export default DebugOffset;
