import { fireEvent, render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import AddComment from "./AddComment";

const mockProps = {
  payRollCommentText: "",
  setpayRollCommentText: vi.fn(),
  handlePayRollAddComment: vi.fn(),
  handleCancelPayRollAddComment: vi.fn(),
  payRollCommentCategoryName: "Salaries",
  payRollCommentsList: ["Comment 1", "Comment 2"],
  handlePayRollDeleteComment: vi.fn(),
};

const renderAddComment = () => render(<AddComment {...mockProps} />);

describe("AddComment Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("renders component correctly", () => {
    renderAddComment();
    expect(screen.getByText("Add Comment")).toBeInTheDocument();
    expect(screen.getByText("Salaries")).toBeInTheDocument();
    expect(screen.getByText("Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Comment 2")).toBeInTheDocument();
  });

  test("shows validation error when Add clicked with empty comment", () => {
    renderAddComment();
    fireEvent.click(screen.getByText("Add"));
    expect(
      screen.getByText("Please Enter a Comment First"),
    ).toBeInTheDocument();
  });

  test("calls handleAddComment when valid comment exists", () => {
    render(<AddComment {...mockProps} payRollCommentText="New Comment" />);
    fireEvent.click(screen.getByText("Add"));
    expect(mockProps.handlePayRollAddComment).toHaveBeenCalled();
  });

  test("calls cancel handler when Cancel button clicked", () => {
    renderAddComment();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockProps.handleCancelPayRollAddComment).toHaveBeenCalled();
  });

  test("calls delete handler when Remove icon clicked", () => {
    renderAddComment();
    fireEvent.click(screen.getAllByTestId("deletePayRollIcon")[0]);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockProps.handlePayRollDeleteComment).toHaveBeenCalled();
  });
});
