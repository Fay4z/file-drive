import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="border-b">
      <div className=" container mx-auto flex justify-between items-center py-2 bg-gray-50">
        <Link href="/" className="font-semibold text-lg">
          FileDrive
        </Link>
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
