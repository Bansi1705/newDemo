import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import CommonMultiSelect from "./MultipleDropDowm";
const options = [
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
];

const mockSetOption = vi.fn();

const renderMultiSelectDropDown = () =>
  render(
    <CommonMultiSelect
      options={options}
      setOption={mockSetOption}
      placeHolder="Select Item"
    />,
  );

describe("CommonMultiSelect", () => {
  test("opens dropdown on click", async () => {
    renderMultiSelectDropDown();
    fireEvent.click(screen.getByTestId("openDropDownIcon"));

    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
  });

  test("shows send button when onSend is true and mrak checked on selected item", () => {
    render(
      <CommonMultiSelect options={options} setOption={mockSetOption} onSend />,
    );

    fireEvent.click(screen.getByTestId("openDropDownIcon"));
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });
});
