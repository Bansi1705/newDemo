import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import FilePreview from "./FilePreview";

const mockFilePreviewClose = vi.fn();
const mockHandelRemoveFilePreview = vi.fn();
const file = [
  {
    name: "test.txt",
    url: `data:text/plain;base64,${btoa("abcText")}`,
  },
  {
    name: "image.png",
    url: "data:image/png;base64,test",
  },
  {
    name: "samplePdf.pdf",
    url: "data:application/pdf;base64,samplePdfText",
  },
  {
    name: "sampleExcel.xlsx",
    url: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,sampleExcelText",
  },
  {
    name: "sampleVideo.mp4",
    url: "data:video/mp4;base64,sampleVideo",
  },
];

describe("FilePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <FilePreview
        file={file}
        onClose={mockFilePreviewClose}
        handleRemovePreViewFile={mockHandelRemoveFilePreview}
      />,
    );
  });
  test("shows all supperted file content when click on file name", () => {
    expect(screen.getByText("abcText")).toBeInTheDocument();

    fireEvent.click(screen.getByText("image.png"));
    expect(screen.getByRole("img")).toBeInTheDocument();

    fireEvent.click(screen.getByText("samplePdf.pdf"));
    expect(screen.getByTestId("PDF-Preview")).toBeInTheDocument();

    fireEvent.click(screen.getByText("sampleExcel.xlsx"));
    expect(screen.getByTestId("Excel-Preview")).toBeInTheDocument();

    fireEvent.click(screen.getByText("sampleVideo.mp4"));
    expect(screen.getByTestId("Video-preview")).toBeInTheDocument();
  });

  test("Preview close wwhen close button clicked", () => {
    fireEvent.click(screen.getByTestId("fileCloseIcon"));
    expect(mockFilePreviewClose).toHaveBeenCalled();
  });

  test("When handleRemovePreViewFile is defined than remove file", () => {
    fireEvent.click(screen.getAllByTestId("removeFilePreviewButton")[0]);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockHandelRemoveFilePreview).toHaveBeenCalled();
  });
});
