// setupTests.ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
afterEach(() => {
  cleanup();
});
vi.mock("next/navigation", () => ({
  usePathname: () => "/test-path",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));
