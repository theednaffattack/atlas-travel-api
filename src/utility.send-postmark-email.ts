/* eslint-disable no-console */
import * as postmark from "postmark";

// async..await is not allowed in global scope, must use a wrapper
export async function sendPostmarkEmail(
  emailAddress: string,
  uri: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<postmark.Models.MessageSendingResponse | undefined> {
  // Setup the Postmark client

  let mailSentResponse;

  if (process.env.POSTMARK_API_TOKEN) {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

    // setup email data with unicode symbols
    const mailOptions: postmark.Models.Message = {
      From: '"Atlas Travel" <eddie@eddienaff.dev>', // sender address
      To: emailAddress, // list of receivers
      Subject: "Welcome to Atlas Travel ✔", // Subject line
      TextBody: `Welcome to Atlas Travel! Please copy and paste the confirmation link below into the address bar of your preferred web browser to access your account.\n
      Confirmation link: ${uri}`, // plain text body
      HtmlBody: `<p>Welcome to Atlas Travel!
      <p>Click the link below to access your account.</p>
      <p>Confirmation link:</p>
      <a href="${uri}">${uri}</a>`, // html body
    };

    // I believe we can provide a callback to client.sendEmail that uses the response
    // as well

    mailSentResponse = await client
      .sendEmail(mailOptions)
      .then((data) => {
        console.log("IS THERE ANY DATA?", { data });
        if (!data.Message || data.Message !== "OK") {
          throw Error("An error occurred sending confifmation message. Please delete record and try again.");
        }
        return data;
      })
      .catch((error) => error);

    if (process.env.NODE_ENV === "production") {
      console.log("CHECK TOTAL RESPONSE", { mailSentResponse });
      console.log("Message sent: %s", mailSentResponse.To);

      console.log("Confirmation URI: %s", mailOptions.HtmlBody);
    }
    return mailSentResponse;
  }

  if (!process.env.POSTMARK_API_TOKEN) {
    throw "Postmark client API token is undefined. Please add token to your environment variables.";
  }

  return undefined;
}
