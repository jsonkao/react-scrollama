import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { vi, beforeEach, afterEach } from "vitest";
import {
  setupIntersectionMocking,
  resetIntersectionMocking,
} from "react-intersection-observer/test-utils";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
  cleanup();
});
