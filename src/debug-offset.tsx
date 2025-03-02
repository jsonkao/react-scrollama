import type { TriggerLineDirection } from "./types";

import { isHorizontal, isOffsetInPixels } from "./utils";

const markerStylesVertical: React.CSSProperties = {
  top: 0,
  width: 0,
  height: "100%",
  borderLeft: "2px dashed black",
  zIndex: 9999,
};

const markerStylesHorizontal: React.CSSProperties = {
  left: 0,
  width: "100%",
  height: 0,
  borderTop: "2px dashed black",
  zIndex: 9999,
};

const offsetTextStyles: React.CSSProperties = {
  fontSize: "12px",
  fontFamily: "monospace",
  margin: 0,
  padding: 6,
};

const getOffsetValue = (offset: string | number, containerSize: number) => {
  const offsetInPixels = isOffsetInPixels(offset);

  if (offsetInPixels) {
    return offset.toString();
  }
  return `${Number(offset) * containerSize}px`;
};

interface DebugOffsetProps {
  offset: string | number;
  containerSize: number;
  stickySize: number;
  isHasRoot?: boolean;
  direction: TriggerLineDirection;
}

export const DebugOffset: React.FC<DebugOffsetProps> = ({
  offset,
  direction,
  stickySize,
  isHasRoot,
  containerSize,
}) => {
  const offsetValue = getOffsetValue(offset, containerSize);
  const commonStyles = isHorizontal(direction)
    ? {
        ...markerStylesHorizontal,
        top: offsetValue,
      }
    : {
        ...markerStylesVertical,
        left: offsetValue,
      };

  return isHasRoot ? (
    <div style={{ position: "sticky", top: 0, left: 0 }}>
      <div
        style={{
          ...commonStyles,
          position: "absolute",
          ...(isHorizontal(direction)
            ? { width: stickySize }
            : { height: stickySize }),
        }}
      >
        <p style={offsetTextStyles}>trigger: {offset}</p>
      </div>
    </div>
  ) : (
    <div style={{ ...commonStyles, position: "fixed" }}>
      <p style={offsetTextStyles}>trigger: {offset}</p>
    </div>
  );
};
