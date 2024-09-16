import { render, screen } from "@testing-library/react";
import React from "react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { DebugOffset } from "../src";

describe("DebugOffset", () => {
	it("renders correctly with pixel offset", () => {
		render(<DebugOffset offset="50px" innerHeight={100} />);
		const triggerText = screen.getByText("trigger: 50px");
		expect(triggerText).toBeInTheDocument();
		const markerDiv = triggerText.closest("div");
		expect(markerDiv).toHaveStyle({ top: "50px" });
	});

	it("renders correctly with percentage offset", () => {
		render(<DebugOffset offset={0.3} innerHeight={100} />);
		const triggerText = screen.getByText("trigger: 0.3");
		expect(triggerText).toBeInTheDocument();
		const markerDiv = triggerText.closest("div");
		expect(markerDiv).toHaveStyle("top: 30px");
	});

	it("applies correct styles to the div element", () => {
		render(<DebugOffset offset="100px" innerHeight={100} />);
		const markerDiv = screen.getByText("trigger: 100px").closest("div");
		expect(markerDiv).toHaveStyle({
			position: "fixed",
			left: 0,
			width: "100%",
			height: 0,
			borderTop: "2px dashed black",
			zIndex: 9999,
		});
	});

	it("applies correct styles to the p element", () => {
		render(<DebugOffset offset="100px" innerHeight={100} />);
		const markerP = screen.getByText("trigger: 100px").closest("p");
		expect(markerP).toHaveStyle({
			fontSize: "12px",
			fontFamily: "monospace",
			margin: "0",
			padding: "6px",
		});
	});
});

const HookComponent = ({ offset }: { offset: string | number }) => {
	const innerHeight = 500;
	const rootRef = useRef<HTMLDivElement>(null);

	return (
		<div ref={rootRef} data-testid="wrapper" style={{ height: innerHeight }}>
			<DebugOffset
				offset={offset}
				innerHeight={innerHeight}
				isHasRoot={!!rootRef}
			/>
		</div>
	);
};

describe("HookComponent", () => {
	it("should render correctly with pixel offset", async () => {
		const { getByTestId } = render(<HookComponent offset="100px" />);
		const wrapperDiv = getByTestId("wrapper");
		const markerDiv = wrapperDiv.firstChild as HTMLElement;
		expect(markerDiv).toHaveStyle({
			position: "sticky",
			top: "0px",
		});
		const markerInnerDiv = markerDiv.firstChild as HTMLElement;
		expect(markerInnerDiv).toHaveStyle({
			position: "absolute",
			top: "100px",
		});

		expect(window.getComputedStyle(markerInnerDiv).top).toBe("100px");
	});

	it("should render correctly with percentage offset", async () => {
		const { getByTestId } = render(<HookComponent offset={0.3} />);
		const wrapperDiv = getByTestId("wrapper");
		const markerDiv = wrapperDiv.firstChild as HTMLElement;
		expect(markerDiv).toHaveStyle({
			position: "sticky",
			top: "0px",
		});
		const markerInnerDiv = markerDiv.firstChild as HTMLElement;
		expect(markerInnerDiv).toHaveStyle({
			position: "absolute",
			top: "150px",
		});

		expect(window.getComputedStyle(markerInnerDiv).top).toBe("150px");
	});
});
