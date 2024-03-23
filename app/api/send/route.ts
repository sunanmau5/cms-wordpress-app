import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const json = req.json();
  const { firstName, lastName, email, service, message, attachments } =
    await json;

  // from variable is built from firstName, lastname and email inside a bracket
  // const from = `${firstName}${lastName ? ` ${lastName}` : ""} <${email}>`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["sunan.regi@gmail.com"],
      subject: "rinawolf received a message",
      text: message,
      react: EmailTemplate({
        firstName,
        lastName,
        email,
        service,
        message,
      }),
      attachments: attachments.map((file: any) => ({
        filename: file.filename,
        content: file.content,
      })),
    });

    if (error) {
      // @ts-expect-error error returns a status code and message
      const { statusCode, message } = error;
      return NextResponse.json({ error: message }, { status: statusCode });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error);
  }
}
