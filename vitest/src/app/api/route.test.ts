import { GET } from "@/app/api/route";
import { NextResponse } from "next/server";

vitest.mock("next/server", () => ({
  NextResponse: {
    json: vitest.fn(),
  },
}));
const MockedNextResponse = vitest.mocked(NextResponse);
describe("Get hello world", () => {
  it("should return hello world", async () => {
    GET();
    expect(MockedNextResponse.json).toHaveBeenCalled();
    expect(MockedNextResponse.json).toHaveBeenCalledWith({
      message: "Hello World!",
    });
  });
});
