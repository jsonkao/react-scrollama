import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  marker: {
    position: 'fixed',
    left: 0,
    width: '100%',
    height: 0,
    borderTop: '2px dashed black',
    zIndex: 9999,
  },
  offsetInfo: {
    fontSize: '12px',
    fontFamily: 'monospace',
    margin: 0,
    padding: 6,
  },
};

const DebugOffset = ({ classes, offsetMargin, offsetVal }) => (
  <div className={classes.marker} style={{ top: offsetMargin }}>
    <p className={classes.offsetInfo}>trigger: {offsetVal}</p>
  </div>
);

export default injectSheet(styles)(DebugOffset);
