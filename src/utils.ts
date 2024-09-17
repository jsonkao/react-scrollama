import type { TriggerLineDirection } from "./types";

/**
 * Checks if the given offset is in pixels.
 *
 * @param offset - The offset to check.
 * @returns Returns true if the offset is a string and includes 'px', otherwise false.
 */
export function isOffsetInPixels(offset: unknown) {
	return typeof offset === "string" && offset.includes("px");
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
export const isBrowser =
	typeof window !== "undefined" && window.document !== undefined;

export const isHorizontal = (direction: TriggerLineDirection) =>
	direction === "horizontal";

/**
 * Calculates the root margin for the Intersection Observer based on the given offset.
 *
 * @param {Object} params - The parameters object.
 * @param {number} params.offset - The offset value, typically between 0 and 1.
 * @param {TriggerLineDirection} params.direction - The direction of the trigger line.
 * @returns {string} The calculated root margin string in the format "top right bottom left".
 */
export const getRootMargin = ({
	offset,
	direction,
}: { offset: number; direction: TriggerLineDirection }) => {
	const calculateMargin = (offset: number) => `${-offset * 100}%`;
	const calculateOppositeMargin = (offset: number) =>
		`${-(100 - offset * 100)}%`;

	if (isHorizontal(direction)) {
		return [
			calculateMargin(offset), // Top
			"0px", // Right
			calculateOppositeMargin(offset), // Bottom
			"0px", // Left
		].join(" ");
	}

	return [
		"0px", // Top
		calculateOppositeMargin(offset), // Right
		"0px", // Bottom
		calculateMargin(offset), // Left
	].join(" ");
};

interface GetProgressRootMarginParams {
	offset: number;
	nodeSize: number;
	containerSize: number;
	direction: TriggerLineDirection;
}

/**
 * Calculates the root margin for progress tracking based on scroll direction and element dimensions.
 *
 * @param {Object} params - The parameters for calculating the root margin.
 * @param {number} params.offset - The offset value, typically between 0 and 1.
 * @param {number} params.nodeSize - The size of the node.
 * @param {number} params.containerSize - The size of the container.
 * @param {TriggerLineDirection} params.direction - The direction of the trigger line.
 * @returns {string} The calculated root margin string in the format "top right bottom left".
 */
export const getProgressRootMargin = ({
	offset,
	nodeSize,
	containerSize,
	direction,
}: GetProgressRootMarginParams) => {
	if (!nodeSize) return "0px";
	const offsetSizeRatio = nodeSize / containerSize;
	if (!isHorizontal(direction)) {
		return `0px ${offset * 100 - 100}% 0px ${(offsetSizeRatio - offset) * 100 + 1}%`;
	}
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
	 * Add an extra 1% to prevent the "zero intersection rectangle" phenomenon:
	 *
	 * 1. Prevents the root intersection rectangle from overlapping with the scrolling element, which could prevent triggering.
	 * 2. Due to rounding of decimal points in calculations, the height of the root intersection rectangle might be smaller than the scrolling element's height, preventing triggering.
	 *
	 * Why adding 1% doesn't affect progress calculation:
	 *
	 * When the intersection ratio of the scrolling observer is 1, the other observer's isIntersecting is false.
	 * Therefore, we don't need to worry about the impact of adding this extra value.
	 */
	return `${(offsetSizeRatio - offset) * 100 + 1}% 0px ${offset * 100 - 100}% 0px`;
};
