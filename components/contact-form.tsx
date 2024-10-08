"use client";

import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
import * as z from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { LoadingSpinner } from "./loading-spinner";

// const MAX_SIZE_MB = 5;
// const ALLOWED_FILE_TYPES = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/jpg",
// ];

const fileSchema = z.object({
  filename: z.string(),
  content: z.any(), // zod doesn't works well with instanceof(File) or FileList
});

const contactSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 5 characters" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  // service: z.nativeEnum(Service),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters" })
    .max(1000, { message: "Message must be at most 1000 characters" }),
  attachments: z.array(fileSchema).optional(),
});

type ContactSchema = z.infer<typeof contactSchema>;

const contactFormDefaultValues: Partial<ContactSchema> = {};

function RequiredAsterisk() {
  return <span className="text-destructive">*</span>;
}

interface IContactFormProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {}

function ContactForm({ className, ...props }: IContactFormProps) {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactFormDefaultValues,
    mode: "onTouched",
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    try {
      setIsLoading(true);
      const {
        firstName,
        lastName,
        email,
        // service,
        message,
        attachments,
      } = values;
      const response = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          // service,
          message,
          attachments,
        }),
      });

      if (response.ok) {
        // email was sent successfully!
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          // service: Service.Photography1,
          message: "",
          attachments: undefined,
        });
        toast({
          title: "Message sent!",
          description: "I'll get back to you as soon as possible.",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("space-y-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  First name <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <RequiredAsterisk />
              </FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Service <RequiredAsterisk />
              </FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(Service).map(([k, v]) => (
                    <SelectItem key={v} value={v}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can find more information about the available services{" "}
                <Link className="underline" href="/services">
                  here
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Message <RequiredAsterisk />
              </FormLabel>
              <FormControl>
                <Textarea
                  className="h-36 resize-none"
                  placeholder="Please enter your message here"
                  {...field}
                />
              </FormControl>
              <FormDescription>{field.value?.length ?? 0}/1000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachments"
          render={({ field: { value: _, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Attachment(s)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  multiple
                  accept="image/jpeg, image/png, image/webp, image/jpg"
                  className="file:cursor-pointer file:rounded-sm file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Promise.all(
                        Array.from(files).map(async (file) => ({
                          filename: file.name,
                          content: Buffer.from(
                            await file.arrayBuffer(),
                          ).toString("base64"),
                        })),
                      ).then(onChange);
                    }
                  }}
                  type="file"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="relative"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          type="submit"
        >
          <span>Submit</span>
          {isLoading ? <LoadingSpinner className="absolute right-4" /> : null}
        </Button>
      </form>
    </Form>
  );
}
ContactForm.displayName = "ContactForm";

export { ContactForm };
