import { useEffect, useState } from "react";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse } from "../Interface/types";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import Loader from "../Components/CommonComponents/Loader";
import Header from "../Components/Header";
import CommonMultiSelect from "../Components/CommonComponents/MultipleDropDowm";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";

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

const Property: React.FC = () => {
  const [data, setData] = useState<propertyInterface[]>([]);
  const [loadingData, setLodingData] = useState<boolean>(true);

  const getOptions = (item: propertyInterface) => {
    const options: { label: string; value: string }[] = [];

    item.defaultSupportEmails.forEach((email) => {
      options.push({
        label: email,
        value: email,
      });
    });

    item.expense.expenseApprovalWorkFlow.forEach((workflow) => {
      if (workflow.approvalName) {
        options.push({
          label: workflow.approvalName,
          value: workflow.approvalName,
        });
      }
    });

    return options;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLodingData(true);
        const res: ApiResponse<propertyInterface[]> =
          await Apiservice.get("/property");
        console.log(res.data);
        setData(res.data);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.NOT_FOUND);
      } finally {
        setLodingData(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loadingData ? (
        <Loader />
      ) : (
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
                    <p className="font-medium text-gray-700">
                      {item.user.name}
                    </p>
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
      )}
    </>
  );
};
export default Property;
