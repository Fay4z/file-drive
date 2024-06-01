import { Button } from "@/components/ui/button";
import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
