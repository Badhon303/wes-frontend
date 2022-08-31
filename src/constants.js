export const BASE_URL =
  process.env.REACT_APP_ENV === "prod"
    ? "https://backend.wes-wallet.com/v1"
    : process.env.REACT_APP_ENV === "dev"
    ? "http://115.127.24.183:3000/v1"
    : "http://115.127.24.183:3000/v1";
export const PHOTO_URL =
  process.env.REACT_APP_ENV === "prod"
    ? "https://backend.wes-wallet.com/uploads/"
    : process.env.REACT_APP_ENV === "dev"
    ? "http://115.127.24.183:3000/uploads/"
    : "http://115.127.24.183:3000/uploads/";
