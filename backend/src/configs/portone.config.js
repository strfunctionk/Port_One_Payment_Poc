export const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET;
export const PORTONE_STORE_ID = process.env.PORTONE_STORE_ID;
export const PORTONE_API_URL = "https://api.portone.io";

console.log("PORTONE_API_SECRET loaded:", PORTONE_API_SECRET ? `${PORTONE_API_SECRET.substring(0, 10)}...` : "NOT SET");
console.log("PORTONE_STORE_ID loaded:", PORTONE_STORE_ID || "NOT SET");
