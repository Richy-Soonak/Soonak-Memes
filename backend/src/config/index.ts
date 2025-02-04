import dotenv from "dotenv";

dotenv.config();
export default {
  jwtSecret: process.env.JWT_SECRET,
  moralis: {
    domain: process.env.APP_DOMAIN,
    statement: 'Please sign this message to confirm your identity.',
    uri: process.env.NEXT_URL,
    timeout: 60,
  }
};

