import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, object, string } from "yup";

import { sendMail } from "../lib/api";
import { handleFormSubmit } from "../pages/api/actions";

import InputField from "./input-field";
import TextareaField from "./textarea-field";

const contactSchema = object({
  firstName: string()
    .required("First name is required")
    .min(3, "First name must be at least 5 characters"),
  lastName: string().optional(),
  email: string().required("Email is required").email("Invalid email address"),
  subject: string()
    .required("Subject is required")
    .min(5, "Subject must be at least 5 characters"),
  message: string()
    .required("Message is required")
    .min(5, "Message must be at least 5 characters")
    .max(1000, "Message must be at most 1000 characters"),
});

type IContactForm = InferType<typeof contactSchema>;

export default function ContactForm() {
  const methods = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(contactSchema),
  });

  const { reset, handleSubmit } = methods;

  const onSubmit: SubmitHandler<IContactForm> = async (data) => {
    const { firstName, email, message, subject } = data;
    const emailContent = `
      Message received from <strong>${firstName}</strong>.
      Their email address is <strong>${email}</strong>. <br />
      They'd like to know about...
      ${message}
    `;
    const mailData = await handleFormSubmit({ subject, body: emailContent });

    if (mailData.sent) {
      // email was sent successfully!
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex w-1/2 flex-1 flex-shrink-0 flex-col gap-4"
        name="contact"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <InputField
              isRequired
              fieldName="firstName"
              label="First name"
              placeholder="First name"
              type="text"
            />
          </div>
          <div className="flex-1">
            <InputField
              fieldName="lastName"
              label="Last name"
              placeholder="Last name"
              type="text"
            />
          </div>
        </div>

        <InputField
          isRequired
          fieldName="email"
          label="Email"
          placeholder="Email"
          type="email"
        />

        <InputField
          isRequired
          fieldName="subject"
          label="Subject"
          placeholder="Subject"
          type="text"
        />

        <TextareaField
          isRequired
          fieldName="message"
          label="Message"
          maxLength={1000}
          minLength={5}
          placeholder="Message"
        />

        <button
          className="rounded-md p-2 font-semibold transition-all hover:bg-slate-100"
          type="submit"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
}
