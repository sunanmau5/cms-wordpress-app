import { Service } from "@/lib/types";

interface EmailTemplateProps {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
  service: Service;
}

function EmailTemplate(props: Readonly<EmailTemplateProps>) {
  const { firstName, lastName, email, message, service } = props;
  return (
    <div>
      <h1>Hello rinawolf!</h1>
      <p>
        {firstName} {lastName} ({email}) has sent you a message regarding{" "}
        <i>{service}</i>.
      </p>
      <h3>Message:</h3>
      <p>{message}</p>
    </div>
  );
}
EmailTemplate.displayName = "EmailTemplate";

export { EmailTemplate };
