import { Menu, MenuButton, MenuItems } from "@headlessui/react";

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
          <div className="absolute top-5 left-16 right-16 h-[2px] bg-green-500" />
          {workflows.map((workflows, i) => (
            <div
              className="relative z-10 flex flex-col items-center w-24"
              key={i}
            >
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                {workflows.approvalUsers.map((i) => i.name.charAt(0))}
              </div>
              <span className="mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-[2px] rounded">
                {workflows.status}
              </span>
              <p className="mt-2 text-xs text-center text-green-600 leading-4">
                {workflows.approvalUsers.map((i) => i.name).join(" / ")}
              </p>
            </div>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
