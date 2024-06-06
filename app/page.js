"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  file: z
    .custom((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});

export default function Home() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  let orgId = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFiles = useMutation(api.files.createFiles);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values) {
    console.log(values);
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    try {
      await createFiles({ title: values.title, fileId: storageId, orgId });
      form.reset();
      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Your file has been uploaded",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "File not Uploaded",
        description: "Error during file upload process",
      });
    }
  }

  return (
    <div className=" container mx-auto mt-12">
      <div className=" flex justify-between items-center">
        <div>File Upload</div>
        <div>
          <Dialog
            open={isFileDialogOpen}
            onOpenChange={(isOpen) => {
              setIsFileDialogOpen(isOpen);
              form.reset();
            }}
          >
            <DialogTrigger asChild>
              <Button> Upload a File</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload File</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                placeholder="shadcn"
                                {...fileRef}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="flex gap-2"
                      >
                        {form.formState.isSubmitting && (
                          <Loader2 className="w-4 h-4 animate-spin " />
                        )}
                        Submit
                      </Button>
                    </form>
                  </Form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
