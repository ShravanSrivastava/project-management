import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name:"Task Manager",
            link:"https://taskmanager.com",
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASSWORD,
        }
    })
    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("email service failed silientlty. Make sure that you have provided your MAILTRAP credentials int the .env file");
        console.error("Error: ", error);
    }
}

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

export{emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail};