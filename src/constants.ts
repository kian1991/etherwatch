// POSTGRES_URL
const postgresUrl = process.env.POSTGRES_URL ?? null;
const alchemy_ws_url = process.env.ALCHEMY_WS_URL ?? null;
const resend_api_key = process.env.RESEND_API_KEY ?? null;

// Todo: Beautify this
if (postgresUrl === null) {
  // Do null check
  throw new Error('POSTGRES_URL is not defined in .env file');
}

if (alchemy_ws_url === null) {
  throw new Error('ALCHEMY_WS_URL is not defined in .env file');
}

if (resend_api_key === null) {
  throw new Error('RESEND_API_KEY is not defined in .env file');
}

export const RESEND_API_KEY = resend_api_key;
export const POSTGRES_URL = postgresUrl;
export const ALCHEMY_WS_URL = alchemy_ws_url;
