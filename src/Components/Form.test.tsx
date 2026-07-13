import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, expect, type Mock, vi } from "vitest";
import Form from "./Form";
import { Apiservice } from "../Services/ApiService";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));
vi.mock("./CommonComponents/DatePicker", () => ({
  ReactDatePicker: ({ onChange, error }: any) => (
    <>
      <input
        data-testid="date-picker"
        type="date"
        onChange={(e) => onChange(new Date(e.target.value))}
      />
      {error && <span>{error}</span>}
    </>
  ),
}));

vi.mock("./CommonComponents/FileUpload", () => ({
  default: ({ onFileSelect }: any) => (
    <input
      data-testid="file-upload"
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          onFileSelect(file);
        }
      }}
    />
  ),
}));

describe("Form Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    class MockFileReader {
      result = "data:image/png;base64,mockImage";

      onloadend: null | (() => void) = null;

      readAsDataURL() {
        if (this.onloadend) {
          this.onloadend();
        }
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);
  });

  test("Empty Field Validation in Add User Form", () => {
    render(
      <MemoryRouter>
        <Form />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /add user/i,
      }),
    );

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("BirthDate is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter Valid Age")).toBeInTheDocument();
    expect(screen.getByText("UploadFile is required.")).toBeInTheDocument();
  });
  test("should create a new user", async () => {
    (Apiservice.post as Mock).mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter initialEntries={["/add-user"]}>
        <Routes>
          <Route path="/add-user" element={<Form />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {
        value: "Vrunda",
      },
    });

    fireEvent.change(screen.getByLabelText(/age/i), {
      target: {
        value: "20",
      },
    });

    fireEvent.change(screen.getByTestId("date-picker"), {
      target: {
        value: "2025-01-01",
      },
    });

    const file = new File(["hello"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByTestId("file-upload"), {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /add user/i,
      }),
    );

    await waitFor(() => {
      expect(Apiservice.post).toHaveBeenCalledTimes(1);
    });

    expect(Apiservice.post).toHaveBeenCalledWith(
      "/users",
      expect.objectContaining({
        name: "Vrunda",
        age: 20,
        birthdate: "2025-01-01",
        uploadFile: [
          {
            name: "test.pdf",
            url: "data:image/png;base64,mockImage",
          },
        ],
      }),
    );
  });

  test("should load existing user and update", async () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: {
        id: 1,
        name: "John",
        age: 25,
        birthdate: "2024-01-01",
        uploadFile: [],
      },
    });

    (Apiservice.put as Mock).mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter initialEntries={["/edit-user/1"]}>
        <Routes>
          <Route path="/edit-user/:id" element={<Form />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(Apiservice.get).toHaveBeenCalledWith("/users/1");
    });

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {
        value: "Updated John",
      },
    });

    fireEvent.change(screen.getByTestId("date-picker"), {
      target: {
        value: "2024-05-01",
      },
    });

    const file = new File(["hello"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(screen.getByTestId("file-upload"), {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /update user/i,
      }),
    );

    await waitFor(() => {
      expect(Apiservice.put).toHaveBeenCalled();
    });
  });
});
