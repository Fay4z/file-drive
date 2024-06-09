"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Edit2Icon,
  EllipsisVertical,
  FileText,
  ImageIcon,
  Table2,
  TrashIcon,
  WholeWord,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { get } from "react-hook-form";
import { getImageUrl } from "@/convex/files";

const FileCardActions = ({ file }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const deleteFile = useMutation(api.files.deleteFile);

  const { toast } = useToast();
  return (
    <>
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });
                toast({
                  variant: "success",
                  title: "File Deleted",
                  description: "Your file has been successfully deleted",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className=" w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className=" flex items-center gap-2">
            <Edit2Icon className=" w-4 h-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" flex items-center gap-2"
            onClick={() => setIsDeleteAlertOpen(true)}
          >
            <TrashIcon className=" w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

// const getImageUrl = (fileId) => {
//   return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
// };

const FileCard = ({ file }) => {
  const imageUrl = useQuery(api.files.getImageUrl, {
    id: file._id,
  });
  const typeIcons = {
    image: <ImageIcon className=" w-4 h-4" />,
    pdf: <FileText className=" w-4 h-4" />,
    msword: <WholeWord className=" w-4 h-4" />,
    csv: <Table2 className=" w-4 h-4" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className=" relative">
          {file.title}
          <div className=" absolute top-0 right-1">
            <FileCardActions file={file} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" flex items-center gap-2 text-md">
          <p>{file.type}</p>
          <p>{typeIcons[file.type]}</p>
        </div>
      </CardContent>
      <CardContent className="flex flex-col justify-center items-center">
        {file.type === "image" && (
          <Image alt={file.title} src={imageUrl} width="200" height="200" />
        )}
        {file.type !== "image" && <FileText className=" w-32 h-32" />}
      </CardContent>
      <CardFooter className=" flex flex-row justify-center">
        <Button
          onClick={() => {
            window.open(imageUrl, "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
