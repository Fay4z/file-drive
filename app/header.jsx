import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const Header = () => {
  return (
    <div className="border-b">
      <div className=" container mx-auto flex justify-between items-center py-2 bg-gray-50">
        <div>FileDrive</div>
        <div className=" space-x-4">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button> Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};
