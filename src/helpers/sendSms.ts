import twilio from 'twilio';

const { Twilio } = twilio;

const ACCOUNT_SID: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN: string | undefined = process.env.TWILIO_AUTH_TOKEN;

const client = new Twilio(ACCOUNT_SID, AUTH_TOKEN);

const sendSms = async (body: any, number: any) => {
  const msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: '+250787277260',
    body,
  };
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

export default sendSms;
