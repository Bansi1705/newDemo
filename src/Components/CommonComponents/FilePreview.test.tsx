import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import FilePreview from "./FilePreview";

describe("FilePreview", () => {
  test("renders image preview", () => {
    const file = {
      name: "image.png",
      url: "data:image/png;base64,test",
    };

    render(<FilePreview file={file} onClose={vi.fn()} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("shows txt file content", () => {
    const text = btoa("Hello World");

    const file = {
      name: "test.txt",
      url: `data:text/plain;base64,${text}`,
    };

    render(<FilePreview file={file} onClose={vi.fn()} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("shows all files in sidebar", () => {
    const files = [
      {
        name: "file1.txt",
        url: `data:text/plain;base64,${btoa("File 1")}`,
      },
      {
        name: "file2.txt",
        url: `data:text/plain;base64,${btoa("File 2")}`,
      },
    ];

    render(<FilePreview file={files} onClose={vi.fn()} />);

    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("file2.txt")).toBeInTheDocument();
  });

  test("changes preview when another file clicked", () => {
    const files = [
      {
        name: "file1.txt",
        url: `data:text/plain;base64,${btoa("First File")}`,
      },
      {
        name: "file2.txt",
        url: `data:text/plain;base64,${btoa("Second File")}`,
      },
    ];

    render(<FilePreview file={files} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("file2.txt"));
    expect(screen.getByText("Second File")).toBeInTheDocument();
  });
});
