"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(0).max(50),
});

export const SearchBar = ({ query, setQuery }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query,
    },
  });

  async function onSubmit(values) {
    setQuery(values.query);
  }

  return (
    <Form {...form} className="flex">
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex gap-2">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter text to search" {...field} />
              </FormControl>
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
  );
};
