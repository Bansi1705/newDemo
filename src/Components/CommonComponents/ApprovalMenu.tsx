import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { COMMON_SERVICES } from "../../Services/CommonService/CommonServices";

interface ApprovalUser {
  name: string;
}

interface Workflow {
  approvalUsers: ApprovalUser[];
  status: string;
}

interface Props {
  workflows: Workflow[];
  approverName: string[];
}

export default function ApprovalMenu({ workflows, approverName }: Props) {
  const getStatusColor = (
    status: string,
    onlyText?: boolean,
    onlyBg?: boolean,
  ) => {
    const color = status.toLowerCase();
    switch (color) {
      case "approved":
        if (onlyText) return "text-green-500";
        if (onlyBg) return "bg-green-500";
        return "bg-green-500 text-green-100";

      case "in_progress":
        if (onlyText) return "text-blue-500";
        if (onlyBg) return "bg-blue-500";
        return "bg-blue-400 text-blue-100";

      case "pending":
        if (onlyText) return "text-yellow-500";
        if (onlyBg) return "bg-yellow-500";
        return "bg-yellow-100 text-yellow-700";

      default:
        if (onlyText) return "text-gray-500";
        if (onlyBg) return "bg-gray-500";
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="cursor-pointer text-sm text-blue-300">
        {approverName.join("/ ") || "-"}
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        className="z-50 mt-3 bg-white rounded-xl shadow-xl border p-6 min-w-[420px]"
      >
        <div className="flex items-start justify-center gap-8 relative">
          {workflows.map((workflow, i) => (
            <div
              className="relative z-10 flex flex-col items-center w-24"
              key={i}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getStatusColor(workflow.status)}`}
              >
                {workflow.approvalUsers[0].name.charAt(0)}
              </div>
              <span
                className={`${getStatusColor(workflow.status)} mt-2 text-[10px] px-2 py-[2px] rounded`}
              >
                {COMMON_SERVICES.formatText(workflow.status)}
              </span>
              <p
                className={`${getStatusColor(workflow.status, true)} mt-2 text-xs text-center leading-4 `}
              >
                {workflow.approvalUsers.map((i) => i.name).join(" / ")}
              </p>
              {i < workflows.length - 1 && (
                <div
                  className={`absolute top-5 left-20 w-16 h-[2px] ${getStatusColor(
                    workflows[i + 1].status,
                    false,
                    true,
                  )}`}
                />
              )}
            </div>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
