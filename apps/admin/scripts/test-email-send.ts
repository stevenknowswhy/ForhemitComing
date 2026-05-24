import { Resend } from "resend";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../.env.local") });

const resend = new Resend(process.env.RESEND_API_KEY!);

async function main() {
  const { data, error } = await resend.emails.send({
    from: process.env.AGENT_EMAIL || "agent@email.forhemit.com",
    to: [process.env.GMAIL_FORWARD_TARGET || "stefanostokes86@gmail.com"],
    subject: "Test email from AI Agent system",
    html: "<p>This is a test email sent directly via the Resend API from the terminal.</p><p>If you receive this, the email sending infrastructure is working.</p>",
  });

  if (error) {
    console.error("Error sending email:", error);
    process.exit(1);
  }

  console.log("Email sent successfully!");
  console.log("Email ID:", data?.id);
}

main();
