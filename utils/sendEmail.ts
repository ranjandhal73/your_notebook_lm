interface EmailData {
  sender: {
    email: string;
    name: string;
  };
  to: { email: string }[];
  subject: string;
  htmlContent: string;
  trackOpens: boolean;
  trackClicks: boolean;
}

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const emailData: EmailData = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: "Ranjan's Portfolio",
      },
      to: [{ email: to }],
      subject,
      htmlContent,
      trackOpens: true,
      trackClicks: true,
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Brevo error:", error);
      throw new Error("Failed to send email");
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
