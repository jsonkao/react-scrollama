import React from 'react';
import { isOffsetInPixels } from './utils';

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

const useTop = offset => {
  const offsetInPixels = isOffsetInPixels(offset);
  if (offsetInPixels) {
    return offset;
  } else {
    return `${offset * 100}%`;
  }
};

const DebugOffset = ({ offset }) => {
  const top = useTop(offset);
  return (
    <div style={{ ...markerStyles, top }}>
      <p style={offsetTextStyles}>trigger: {offset}</p>
    </div>
  );
};

export default DebugOffset;
