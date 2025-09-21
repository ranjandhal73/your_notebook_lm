export const welcomeEmailTemplate = (name: string) => {
  return `
    <p>Hi ${name} 👋,</p>
    <p>Welcome aboard! 🎉</p>
    <p>Your account has been successfully verified and created on <strong>your_llm</strong> 🚀.</p>
    <p>We’re thrilled to have you with us! 🤗 Dive in and start exploring how <strong>your_llm</strong> can help you harness the power of LLMs in your workflow. If you have any questions, we’re just an email away 📩.</p>
    <br/>
    <p>Best regards,<br/>The your_llm Team 🤖</p>
  `;
};
