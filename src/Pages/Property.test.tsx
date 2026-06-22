import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, type Mock } from "vitest";
import Property from "./Property";
import { Apiservice } from "../Services/ApiService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
  },
}));

const mockResponse = {
  data: [
    {
      id: 1,
      comment: "Test Comment",
      createdAt: "2026-06-20",
      property: {
        propertyName: "Test Property",
      },
      user: {
        name: "John",
      },
      expense: {
        invoiceNumber: "INV001",
        expenseApprovalWorkFlow: [
          {
            approvalUserId: 327,
            approvalName: "Monish Chatrath",
            status: "APPROVED",
            stepOrder: 0,
            approvedDate: null,
            conditionType: "ALWAYS",
            amount: 0,
            isAbleToNotify: true,
          },
        ],
      },
      defaultSupportEmails: ["qa-developer@techroversolutions.com"],
    },
  ],
};

const renderPropertyPage = () =>
  render(
    <MemoryRouter>
      <Property />
    </MemoryRouter>,
  );

const getPropertyPageData = () =>
  (Apiservice.get as Mock).mockResolvedValue(mockResponse);

describe("Property Page testing", () => {
  test("Spinner Loads until data fetched", () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: [],
    });
    renderPropertyPage();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
  test("Property page renders", async () => {
    getPropertyPageData();
    renderPropertyPage();
    expect(await screen.findByTestId("propertyData")).toBeInTheDocument();
  });
  test("common multi select work or not", async () => {
    getPropertyPageData();
    renderPropertyPage();
    await screen.findByTestId("propertyData");
    expect(screen.getByText("Other")).toBeInTheDocument();
  });
 
});
