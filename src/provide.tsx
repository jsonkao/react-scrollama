import { createContext } from "react";

import type { ScrollamaProvideProps } from "./types";

/**
 * @see https://react.dev/reference/react/createContext#createcontext
 */
export const ScrollamaProvide = createContext<ScrollamaProvideProps<unknown>>(
	{},
);
