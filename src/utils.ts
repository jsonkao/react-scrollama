/**
 * Checks if the given offset is in pixels.
 * 
 * @param offset - The offset to check.
 * @returns Returns true if the offset is a string and includes 'px', otherwise false.
 */
export function isOffsetInPixels(offset: unknown) {
  return typeof offset === 'string' && offset.includes('px');
}



/**
 * Creates an array of threshold values for intersection observer.
 * 
 * @param theta - The step size for creating thresholds.
 * @param height - The total height to be divided into thresholds.
 * @returns An array of threshold values between 0 and 1.
 */
export const createThreshold = (theta: number, height: number) => {
  const count = Math.ceil(height / theta);
  const t: number[] = [];
  const ratio = 1 / count;
  for (let i = 0; i <= count; i += 1) {
    t.push(i * ratio);
  }
  return t;
};


/**
 * Checks if the current environment is a browser.
 * 
 * @returns {boolean} Returns true if running in a browser environment, false otherwise.
 */
export const isBrowser = typeof window !== 'undefined' && window.document !== undefined;


/**
 * Calculates the root margin for the Intersection Observer based on the given offset.
 * 
 * @param {Object} params - The parameters object.
 * @param {number} params.offset - The offset value, typically between 0 and 1.
 * @returns {string} The calculated root margin string in the format "top right bottom left".
 */
export const getRootMargin = ({ offset }: { offset: number }) => {
  const margins = [
    `${-offset * 100}%`, // Top
    "0px", // Right
    `${-(100 - offset * 100)}%`, // Bottom
    "0px" // Left
  ];

  return margins.join(' ');
}


interface GetProgressRootMarginParams {
  direction: string;
  offset: number;
  node: React.RefObject<HTMLElement>;
  innerHeight: number;
}

/**
 * Calculates the root margin for progress tracking based on scroll direction and element dimensions.
 *
 * @param {Object} params - The parameters for calculating the root margin.
 * @param {string} params.direction - The scroll direction ('up' or 'down').
 * @param {number} params.offset - The offset value, typically between 0 and 1.
 * @param {React.RefObject<HTMLElement>} params.node - Reference to the DOM node being tracked.
 * @param {number} params.innerHeight - The inner height of the viewport.
 * @returns {string} The calculated root margin string in the format "top right bottom left".
 */
export const getProgressRootMargin = ({ direction, offset, node, innerHeight }: GetProgressRootMarginParams) => {
  if (!node.current) return '0px';
  const offsetHeight = (node.current.offsetHeight / innerHeight);
  if (direction === 'down') return `${(offsetHeight - offset) * 100}% 0px ${(offset * 100) - 100}% 0px`;
  return `-${offset * 100}% 0px ${(offsetHeight * 100) - (100 - (offset * 100))}% 0px`;
}
