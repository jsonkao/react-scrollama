import { act, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { mockIsIntersecting } from "react-intersection-observer/test-utils";
import { describe, expect, it } from "vitest";

import { Scrollama, Step } from "../src";

const stepStyle = {
  border: "5px solid #cccccc",
  height: "300px",
  width: "500px",
  margin: "100px",
};

const HookComponent = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  return (
    <div data-testid="wrapper" data-step={currentStep}>
      <Scrollama<number> debug onStepEnter={({ data }) => setCurrentStep(data)}>
        {[1, 2, 3].map((stepNumber) => (
          <Step key={stepNumber} data={stepNumber}>
            <div style={stepStyle} data-testid={`step-${stepNumber}`}>
              Step {stepNumber}
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  );
};

describe("Scrollama", () => {
  it("should render correctly", async () => {
    render(
      <>
        <div style={{ height: window.innerHeight }} />
        <HookComponent />
        <div style={{ height: window.innerHeight }} />
      </>,
    );
    const wrapper = screen.getByTestId("wrapper");

    // Should not be updated until intersection observer triggers
    expect(wrapper).toHaveAttribute("data-step", "0");

    const step1 = screen.getByTestId("step-1");
    const step2 = screen.getByTestId("step-2");
    const step3 = screen.getByTestId("step-3");

    act(() => {
      mockIsIntersecting(step1, true);
    });
    expect(wrapper).toHaveAttribute("data-step", "1");
    act(() => {
      mockIsIntersecting(step1, false);
    });
    expect(wrapper).toHaveAttribute("data-step", "1");

    act(() => {
      mockIsIntersecting(step2, true);
    });
    expect(wrapper).toHaveAttribute("data-step", "2");
    act(() => {
      mockIsIntersecting(step2, false);
    });
    expect(wrapper).toHaveAttribute("data-step", "2");

    act(() => {
      mockIsIntersecting(step3, true);
    });
    expect(wrapper).toHaveAttribute("data-step", "3");
    act(() => {
      mockIsIntersecting(step3, false);
    });
    expect(wrapper).toHaveAttribute("data-step", "3");

    // use screen.debug() to see the DOM
    // screen.debug();
  });
});
