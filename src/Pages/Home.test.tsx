import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { Apiservice } from "../Services/ApiService";
import { vi, describe, test, beforeEach, expect } from "vitest";
import type { AxiosResponse } from "axios";
import type { User } from "../Interface/types";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("../Components/Header", () => ({
  default: () => <div>Header</div>,
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows user data", async () => {
    const mockResponse: AxiosResponse<User[]> = {
      data: [
        {
          name: "Bansi",
          age: 25,
          birthdate: "2000-01-01",
          uploadFile: [],
        },
      ],
    };

    vi.mocked(Apiservice.get).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Bansi")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
