"use server";

import { sendMail } from "@/lib/api";

export async function handleContactFormSubmit(data) {
  return await sendMail({ subject: data.subject, body: data.body });
}
