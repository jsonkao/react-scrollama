/**
 * Represents the direction of scrolling.
 */
export type ScrollamaDirection = "up" | "down";

/**
 * Interface for the data passed to Scrollama callback functions.
 * @template T - The type of custom data associated with each step.
 */
export interface ScrollamaCallbackData<T = unknown> {
	/** The DOM element of the step */
	element: Element;
	/** Custom data associated with the step */
	data: T;
	/** The direction of scrolling */
	direction: ScrollamaDirection;
	/** The IntersectionObserverEntry for the step */
	entry: IntersectionObserverEntry;
}

/**
 * Interface for the data passed to Scrollama progress callback functions.
 * Extends ScrollamaCallbackData with progress information.
 * @template T - The type of custom data associated with each step.
 */
export interface ScrollamaProgressCallbackData<T = unknown>
	extends ScrollamaCallbackData<T> {
	/** The progress of the step through the threshold, from 0 to 1 */
	progress: number;
}

/**
 * Type for Scrollama callback functions.
 * @template T - The type of custom data associated with each step.
 */
export type ScrollamaCallback<T = unknown> = (
	data: ScrollamaCallbackData<T>,
) => void;

/**
 * Type for Scrollama progress callback functions.
 * @template T - The type of custom data associated with each step.
 */
export type ScrollamaProgressCallback<T = unknown> = (
	data: ScrollamaProgressCallbackData<T>,
) => void;

/**
 * Interface for the props of the Scrollama component.
 * @template T - The type of data associated with each step.
 */
export interface ScrollamaProps<T = unknown> {
	/**
	 * Whether to show visual debugging tools.
	 * @default false
	 */
	debug?: boolean;

	/**
	 * The child elements to be wrapped by Scrollama.
	 */
	children: React.ReactNode;

	/**
	 * How far from the top of the viewport to trigger a step.
	 * Can be a number from 0 to 1 (as a proportion of view height) or a pixel value (e.g. "300px").
	 * @default 0.3
	 */
	offset?: string | number;

	/**
	 * Callback that fires when the top or bottom edge of a step enters the offset threshold.
	 */
	onStepEnter?: ScrollamaCallback<T>;

	/**
	 * Callback that fires when the top or bottom edge of a step exits the offset threshold.
	 */
	onStepExit?: ScrollamaCallback<T>;

	/**
	 * Callback that fires the progress a step has made through the threshold.
	 */
	onStepProgress?: ScrollamaProgressCallback<T>;

	/**
	 * Granularity of the progress interval in pixels (smaller = more granular).
	 * @default 4
	 */
	threshold?: number;

	/**
	 * The root element of the IntersectionObserver.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#root
	 */
	rootRef?: React.RefObject<Element>;
}

/**
 * Interface for the props of a Step component in Scrollama.
 * @template T - The type of data associated with the step.
 */
export interface StepProps<T = unknown> {
	/**
	 * The child element to be rendered within the Step.
	 * Must be a valid React element with class attributes.
	 */
	children: React.ReactElement & React.ClassAttributes<React.ReactElement>;

	/**
	 * Optional data associated with this step.
	 */
	data?: T;
}

export interface ScrollamaProvideProps<T = unknown> {
	/**
	 * The last known scroll position.
	 */
	lastScrollTop?: number;

	/**
	 * The offset value for triggering the step.
	 */
	offset?: number;

	/**
	 * The threshold for progress calculations.
	 */
	progressThreshold?: number | number[];

	/**
	 * The inner height of the viewport.
	 */
	innerHeight?: number;

	/**
	 * The root element of the IntersectionObserver.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#root
	 */
	rootRef?: React.RefObject<Element>;

	/**
	 * Callback fired when the step enters the viewport.
	 */
	onStepEnter?: ScrollamaCallback<T>;

	/**
	 * Callback fired when the step exits the viewport.
	 */
	onStepExit?: ScrollamaCallback<T>;

	/**
	 * Callback fired to report progress as the step moves through the viewport.
	 */
	onStepProgress?: ScrollamaProgressCallback<T>;

	/**
	 * Function to update the last known scroll position.
	 */
	handleSetLastScrollTop?: (scrollTop: number) => void;
}
