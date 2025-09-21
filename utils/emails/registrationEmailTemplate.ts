// registrationEmailTemplate.ts
export const registrationEmailTemplate = (otpCode: string, name: string) => {
  return `
    <p>Hi ${name} 👋,</p>
    <p>Welcome to <strong>Your_llm</strong>! 🚀</p>
    <p>We're excited to have you join our community.</p>
    <p>Your one-time verification code is:</p>
    <h2 style="color: #2d89ef;">${otpCode} 🔑</h2>
    <p>This code will expire in 5 minutes ⏳. Please do not share it with anyone 🚫.</p>
    <br/>
    <p>If you didn’t request this, you can safely ignore this email ❌.</p>
    <br/>
    <p>Best regards, <br/>The Your_llm Team</p>
  `;
};
