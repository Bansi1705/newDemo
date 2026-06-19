import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { Apiservice } from "../Services/ApiService";
import { vi, describe, test, beforeEach, expect, type Mock } from "vitest";
import type { ApiResponse, User } from "../Interface/types";
import type { HeaderProps } from "../Components/Header";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

const mockNavigateToFormForEdit = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigateToFormForEdit,
  };
});

vi.mock("../Components/Header", () => ({
  default: ({ searchTerm, setSearchTerm }: HeaderProps) => (
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
    />
  ),
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows user data", async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [
        {
          name: "Bansi",
          age: 25,
          birthdate: "2000-01-01",
          uploadFile: [],
        },
      ],
    };

    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Bansi")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

   test("shows spinner when data is loading", async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [],
    };

    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("after clicking on edit navigate to form page", async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [
        {
          id: 1,
          name: "Bansi",
          age: 25,
          birthdate: "2000-01-01",
          uploadFile: [],
        },
      ],
    };

    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const actionsButton = await screen.findByText(/actions/i);
    fireEvent.click(actionsButton);

    const editButton = await screen.findByText(/edit/i);

    fireEvent.click(editButton);

    expect(
      await screen.findByText(/Do You Want To Edit This Item/i),
    ).toBeInTheDocument();

    const editYesButton = await screen.findByText(/yes/i);

    fireEvent.click(editYesButton);

    expect(mockNavigateToFormForEdit).toHaveBeenCalledWith("/edit-user/1");
  });

  test("Delete User", async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [
        {
          id: 1,
          name: "Bansi",
          age: 25,
          birthdate: "2000-01-01",
          uploadFile: [],
        },
      ],
    };

    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);

    vi.mocked(Apiservice.delete as Mock).mockResolvedValue({
      data: [],
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const actionsButton = await screen.findByText(/actions/i);
    fireEvent.click(actionsButton);

    const menuContainer = screen.getByTestId("action-menu");

    const deleteButton = within(menuContainer).getByText("Delete");

    fireEvent.click(deleteButton);

    expect(
      await screen.findByText(/Do You Really Want To Delete This Item/i),
    ).toBeInTheDocument();

    const confirmDeleteButton = await screen.findByTestId("confirm-delete-btn");

    fireEvent.click(confirmDeleteButton);

    expect(Apiservice.delete).toHaveBeenCalledWith("/users/1");
  });

  test("search user by name", async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [
        {
          id: 1,
          name: "Bansi",
          age: 25,
          birthdate: "2000-01-01",
          uploadFile: [],
        },
        {
          id: 2,
          name: "Radha",
          age: 22,
          birthdate: "2002-01-01",
          uploadFile: [],
        },
      ],
    };

    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Bansi")).toBeInTheDocument();
    expect(screen.getByText("Radha")).toBeInTheDocument();

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, {
      target: { value: "Ban" },
    });

    expect(screen.getByText("Bansi")).toBeInTheDocument();
    expect(screen.queryByText("Radha")).not.toBeInTheDocument();
  });

  test("Multiple use delete at a time", async () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [
        {
          id: 1,
          name: "Bansi",
          age: 25,
          birthdate: "2000-01-01",
          uploadFile: [],
        },
        {
          id: 2,
          name: "Radha",
          age: 22,
          birthdate: "2002-01-01",
          uploadFile: [],
        },
        {
          id: 3,
          name: "Khushali",
          age: 22,
          birthdate: "2002-01-01",
          uploadFile: [],
        },
      ],
    };

    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);

    vi.mocked(Apiservice.delete as Mock).mockResolvedValue({
      data: [
        {
          id: 3,
          name: "Khushali",
          age: 22,
          birthdate: "2002-01-01",
          uploadFile: [],
        },
      ],
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bansi")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText("Delete Selected Item"));

    fireEvent.click(screen.getByText(/yes/i));

    await waitFor(() => {
      expect(Apiservice.delete).toHaveBeenCalledTimes(2);
      expect(Apiservice.delete).toHaveBeenCalledWith("/users/1");
      expect(Apiservice.delete).toHaveBeenCalledWith("/users/2");
    });
  });
});
