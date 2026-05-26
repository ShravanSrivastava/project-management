import Mailgen from "mailgen";

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We're excited to have you on board.",
      action: {
        instructions:
          "To verify your emial please click on the following button",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
    },
  };
};

const forgotPasswordMailgenContent = (username, resetPasswordUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset your password of your account.",
      action: {
        instructions:
          "To reset your password please click on the following button",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset your password",
          link: resetPasswordUrl,
        },
      },
    },
  };
};

export{emailVerificationMailgenContent, forgotPasswordMailgenContent};