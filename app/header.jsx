import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export const Header = () => {
  return (
    <div className="border-b">
      <div className=" container mx-auto flex justify-between items-center py-2 bg-gray-50">
        <div>FileDrive</div>
        <div className=" space-x-4">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
};
