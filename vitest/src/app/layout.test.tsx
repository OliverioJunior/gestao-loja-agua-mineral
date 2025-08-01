vi.mock("next/font/google", () => ({
  Geist: () => ({ className: "mock-geist", variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ className: "mock-mono", variable: "--font-geist-mono" }),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

import RootLayout from "@/app/layout";
import { render } from "@testing-library/react";

describe("Layout", () => {
  it("should render", () => {
    const { getByText } = render(
      <RootLayout>
        <div>
          <h1>Hello World</h1>
        </div>
      </RootLayout>
    );
    expect(getByText("Hello World")).toBeInTheDocument();
  });
});
