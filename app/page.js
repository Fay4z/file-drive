"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  console.log("organization", organization, user);

  let orgId = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFiles = useMutation(api.files.createFiles);
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

      {files?.map((file) => {
        return <div key={file._id}>{file.title}</div>;
      })}

      <Button
        onClick={() => {
          if (!organization) {
            return;
          }
          createFiles({ title: "Hello", orgId });
        }}
      >
        Click me
      </Button>
    </div>
  );
}
