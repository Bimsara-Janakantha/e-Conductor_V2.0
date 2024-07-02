import { describe, it, expect, vi } from "vitest";
import { handleOTP } from "../handlers";

const mockRequest = {
  body: {
    type: "Req1",
  },
};

const mockResponse = {
  json: vi.fn(),
  status: vi.fn(),
};

describe("send OTP", () => {
  it("should send the OTP as the response", () => {

    handleOTP(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith("qwerty");
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should send status code 404 when request type mismatch", () => {
    const copyMockRequest = {
      ...mockRequest,
      body: { type: "Req2" },
    };

    handleOTP(copyMockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});

