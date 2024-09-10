import { isOffsetInPixels } from './utils';

const markerStyles: React.CSSProperties = {
  position: 'fixed',
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

const useTop = (offset: string | number) => {
  const offsetInPixels = isOffsetInPixels(offset);

  if (offsetInPixels) {
    return offset.toString();
  } else {
    return `${Number(offset) * 100}%`
  }
}

interface DebugOffsetProps {
  offset: string | number;
}

export const DebugOffset: React.FC<DebugOffsetProps> = ({ offset }) => {
  const top = useTop(offset);
  return (
    <div style={{ ...markerStyles, top, }}>
      <p style={offsetTextStyles}>trigger: {offset}</p>
    </div>
  );
}

