import { render, screen, fireEvent } from "@testing-library/react";
import FileUpload from "./FileUpload";
import Toaster from "../../Services/CommonService/ToasterHelper";
import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../../Services/CommonService/ToasterHelper", () => ({
  default: {
    warning: vi.fn(),
  },
}));

const mockOnFileSelect = vi.fn();
const renderFileUpload = () =>
  render(<FileUpload onFileSelect={mockOnFileSelect} />);

describe("Fileupload Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls onFileSelect when valid file is uploaded", () => {
    renderFileUpload();
    const file = new File(["dummy"], "profile.png", {
      type: "image/png",
    });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    expect(screen.getByText("profile.png")).toBeInTheDocument();
  });

  test("shows warning when image file size exceeds 5 MB", () => {
    renderFileUpload();
    const largeImage = new File(["dummy"], "large.png", {
      type: "image/png",
    });

    Object.defineProperty(largeImage, "size", {
      value: 6 * 1024 * 1024,
    });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: {
        files: [largeImage],
      },
    });

    expect(Toaster.warning).toHaveBeenCalled();
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  test("shows warning when video file size exceeds 10 MB", () => {
    renderFileUpload();
    const largeVideo = new File(["dummy"], "video.mp4", {
      type: "video/mp4",
    });

    Object.defineProperty(largeVideo, "size", {
      value: 11 * 1024 * 1024,
    });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: {
        files: [largeVideo],
      },
    });

    expect(Toaster.warning).toHaveBeenCalled();
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  test("shows warning for unsupported file type", () => {
    renderFileUpload();
    const invalidFile = new File(["dummy"], "test.zip", {
      type: "application/zip",
    });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: {
        files: [invalidFile],
      },
    });

    expect(Toaster.warning).toHaveBeenCalled();
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  test("supports multiple file selection", () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} multipleFile={true} />);
    const file1 = new File(["dummy"], "file1.png", {
      type: "image/png",
    });

    const file2 = new File(["dummy"], "file2.png", {
      type: "image/png",
    });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: {
        files: [file1, file2],
      },
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith([file1, file2]);
    expect(screen.getByText("2 files selected")).toBeInTheDocument();
  });
});