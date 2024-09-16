import { isOffsetInPixels } from './utils';

const markerStyles: React.CSSProperties = {
  left: 0,
  width: '100%',
  height: 0,
  borderTop: '2px dashed black',
  zIndex: 9999,
};

const offsetTextStyles: React.CSSProperties = {
  fontSize: '12px',
  fontFamily: 'monospace',
  margin: 0,
  padding: 6,
};

const getTop = (offset: string | number, innerHeight: number) => {
  const offsetInPixels = isOffsetInPixels(offset);

  if (offsetInPixels) {
    return offset.toString();
  } else {
    return `${Number(offset) * innerHeight}px`;
  }
}

interface DebugOffsetProps {
  offset: string | number;
  innerHeight: number;
  isHasRoot?: boolean;
}

export const DebugOffset: React.FC<DebugOffsetProps> = ({ offset, isHasRoot, innerHeight }) => {
  const top = getTop(offset, innerHeight);
  const commonStyles = { ...markerStyles, top }

  return isHasRoot ? (
    <div style={{ position: 'sticky', top: 0 }}>
      <div style={{ ...commonStyles, position: 'absolute' }}>
        <p style={offsetTextStyles}>trigger: {offset}</p>
      </div>
    </div>
  ) : (
    <div style={{ ...commonStyles, position: 'fixed' }}>
      <p style={offsetTextStyles}>trigger: {offset}</p>
    </div>
  );
};
