const { SendEmailCommand } = require( "@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: "<h1>This is the Email Address</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is text format email",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "hello world from SES",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        // Both should be verified
      "inv.gauravkaushik@gmail.com", // reciever
      "gauravkaushik415@gmail.com", // sender
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  

module.exports =  { run };
  

