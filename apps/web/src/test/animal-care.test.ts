import AnimalCareForm from "@/components/community/AnimalCareForm";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest matchers with jest-dom matchers
expect.extend(matchers);

describe("AnimalCareForm", () => {
  it("renders without crashing", () => {
    const { getByText } = render(React.createElement(AnimalCareForm));
    expect(getByText("Animal Care Form")).toBeInTheDocument();
  });
});
