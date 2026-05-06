import { useEffect, useState } from "react";
import Header from "./Header";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse } from "../Interface/types";
import CommonMultiSelect from "./CommonComponents/MultipleDropDowm";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";

interface ApprovelName {
  approvalName: string;
}

interface propertyInterface {
  id: number;
  comment: string;
  property: {
    propertyName: string;
  };
  user: {
    name: string;
  };
  expense: {
    invoiceNumber: string;
    expenseApprovalWorkFlow: ApprovelName[];
  };
  defaultSupportEmails: string[];
  createdAt: string;
}

export const Property: React.FC = () => {
  const [data, setData] = useState<propertyInterface[]>([]);

  const getOptions = (item: propertyInterface) => [
    ...item.defaultSupportEmails.map((e) => ({ label: e, value: e })),
    ...item.expense.expenseApprovalWorkFlow
      .filter((wf) => wf.approvalName)
      .map((wf) => ({
        label: wf.approvalName!,
        value: wf.approvalName!,
      })),
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res: ApiResponse<propertyInterface[]> =
        await Apiservice.get("/property");

      console.log(res.data);
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />

      <div className="p-4 bg-gray-100 min-h-screen">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-4 mb-4 border"
          >
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-lg font-semibold text-gray-800">
                {item.property.propertyName}
              </h1>
              <span className="text-sm text-gray-500">
                {COMMON_SERVICES.formatDate(item.createdAt)}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md mb-3 text-sm">
              Invoice No : {item.expense.invoiceNumber}
            </div>

            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-medium text-gray-700">{item.user.name}</p>
                <p className="text-sm text-gray-600">{item.comment}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <CommonMultiSelect
                options={getOptions(item)}
                setOption={() => {}}
                isAdd={false}
                isDelete={false}
                placeHolder="Other"
                onSend={true}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
