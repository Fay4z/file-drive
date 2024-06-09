"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import UploadFile from "./uploadFile";
import FileCard from "./file-card";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  const isLoading = files === undefined;

  return (
    <div className=" container mx-auto mt-12">
      {isLoading && (
        <div className=" flex flex-col items-center w-full gap-4 pt-24">
          <LoaderCircle className="w-16 h-16 animate-spin " />
          <p className=" text-2xl mt-3">Loading...</p>
        </div>
      )}
      {!isLoading && files?.length > 0 && (
        <div>
          <div className=" flex justify-between items-center mb-4">
            <div className=" font-bold text-2xl">File Upload</div>
            <div>
              <UploadFile />
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-3">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </div>
      )}
      {!isLoading && files?.length === 0 && (
        <div className=" flex flex-col items-center w-full gap-4 pt-12 ">
          <Image
            src="/no-data.svg"
            width="200"
            height="200"
            alt=" UFO Image displayed when there is no data"
          />
          <p className=" text-2xl mt-3">No data to show</p>
          <UploadFile />
        </div>
      )}
    </div>
  );
}
