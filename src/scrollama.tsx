import { useEffect, useMemo, useState } from "react";

import { DebugOffset } from "./debug-offset";
import { ScrollamaProvide } from "./provide";
import { createThreshold, isBrowser, isOffsetInPixels } from "./utils";

import type { ScrollamaProps } from "./types";

export const Scrollama = <T = unknown>({
	debug,
	children,
	offset = 0.3,
	onStepEnter,
	onStepExit,
	onStepProgress,
	threshold = 4,
	rootRef,
}: ScrollamaProps<T>) => {
	const isOffsetDefinedInPixels = isOffsetInPixels(offset);
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);

	const handleSetLastScrollTop = (scrollTop: number) => {
		setLastScrollTop(scrollTop);
	};

	const handleResize = () => {
		if (rootRef?.current) {
			setContainerHeight(rootRef.current.clientHeight);
		} else {
			setContainerHeight(window.innerHeight);
		}
	};

	useEffect(() => {
		if (isOffsetDefinedInPixels) {
			if (rootRef?.current) {
				const resizeObserver = new ResizeObserver(() => {
					handleResize();
				});
				resizeObserver.observe(rootRef.current);
				return () => {
					resizeObserver.disconnect();
				};
			}

			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, []);

	const innerHeight = isBrowser ? containerHeight || window.innerHeight : 0;

	const offsetValue = isOffsetDefinedInPixels
		? +(offset as string).replace("px", "") / innerHeight
		: +offset;

	const progressThreshold = useMemo(
		() => createThreshold(threshold, innerHeight),
		[innerHeight],
	);

	return (
		<ScrollamaProvide.Provider
			value={{
				offset: offsetValue,
				lastScrollTop,
				handleSetLastScrollTop,
				progressThreshold,
				innerHeight,
				rootRef,
				// @ts-ignore ts(2345)
				onStepEnter,
				// @ts-ignore ts(2345)
				onStepExit,
				// @ts-ignore ts(2345)
				onStepProgress,
			}}
		>
			{debug && (
				<DebugOffset
					offset={offset}
					isHasRoot={!!rootRef}
					innerHeight={innerHeight}
				/>
			)}
			{children}
		</ScrollamaProvide.Provider>
	);
};
