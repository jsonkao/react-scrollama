import { useEffect, useMemo, useState } from "react";

import { DebugOffset } from "./debug-offset";
import { ScrollamaProvide } from "./provide";
import { createThreshold, isHorizontal, isOffsetInPixels } from "./utils";

import type { ScrollamaProps } from "./types";

export const Scrollama = <T = unknown,>({
  direction = "horizontal",
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
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [containerSize, setContainerSize] = useState(1);
  const [stickySize, setStickySize] = useState(0);

  const viewportSize = useMemo(() => {
    return isHorizontal(direction) ? window.innerHeight : window.innerWidth;
  }, [direction]);

  const handleSetLastScrollPosition = (scrollPosition: number) => {
    setLastScrollPosition(scrollPosition);
  };

  const handleResize = () => {
    if (rootRef?.current) {
      setContainerSize(
        isHorizontal(direction)
          ? rootRef.current.clientHeight
          : rootRef.current.clientWidth,
      );
      setStickySize(
        !isHorizontal(direction)
          ? rootRef.current.clientHeight
          : rootRef.current.clientWidth,
      );
    } else {
      setContainerSize(viewportSize);
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

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const offsetValue = isOffsetDefinedInPixels
    ? +(offset as string).replace("px", "") / containerSize
    : +offset;

  const progressThreshold = useMemo(
    () => createThreshold(threshold, containerSize),
    [containerSize],
  );

  return (
    <ScrollamaProvide.Provider
      value={{
        offset: offsetValue,
        lastScrollPosition,
        handleSetLastScrollPosition,
        progressThreshold,
        containerSize,
        rootRef,
        direction,
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
          direction={direction}
          isHasRoot={!!rootRef}
          stickySize={stickySize}
          containerSize={containerSize}
        />
      )}
      {children}
    </ScrollamaProvide.Provider>
  );
};
