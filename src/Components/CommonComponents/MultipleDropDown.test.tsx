import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import CommonMultiSelect from "./MultipleDropDowm";
const options = [
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
];

const mockSetOption = vi.fn();

const renderMultiSelectDropDown = () =>
  render(<CommonMultiSelect options={options} setOption={mockSetOption} />);

describe("CommonMultiSelect", () => {
  test("renders placeholder", () => {
    render(
      <CommonMultiSelect
        options={options}
        setOption={mockSetOption}
        placeHolder="Select Skill"
      />,
    );

    expect(screen.getByText("Select Skill")).toBeInTheDocument();
  });

  test("opens dropdown on click", async () => {
    renderMultiSelectDropDown();
    fireEvent.click(screen.getByTestId("openDropDownIcon"));

    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
  });

  test("selects checkbox", () => {
    renderMultiSelectDropDown();
    fireEvent.click(screen.getByTestId("openDropDownIcon"));
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test("shows send button when onSend is true", () => {
    render(
      <CommonMultiSelect options={options} setOption={mockSetOption} onSend />,
    );

    fireEvent.click(screen.getByTestId("openDropDownIcon"));
    expect(screen.getByText("Send")).toBeInTheDocument();
  });
});
