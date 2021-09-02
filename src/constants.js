// export const BASE_URL =
//   process.env.REACT_APP_ENV === "prod"
//     ? "https://backend.wes-wallet.com/v1"
//     : process.env.REACT_APP_ENV === "dev"
//     ? "http://115.127.8.84:3000/v1"
//     : "http://localhost:3000/v1";
// export const PHOTO_URL =
//   process.env.REACT_APP_ENV === "prod"
//     ? "https://backend.wes-wallet.com/uploads/"
//     : process.env.REACT_APP_ENV === "dev"
//     ? "http://115.127.8.84:3000/uploads/"
//     : "http://localhost:3000/uploads/";

export const BASE_URL =
  process.env.REACT_APP_ENV === "prod"
    ? "https://backend.wes-wallet.com/v1"
    : process.env.REACT_APP_ENV === "dev"
    ? "http://202.144.201.117:3000/v1"
    : "http://localhost:3000/v1"
export const PHOTO_URL =
  process.env.REACT_APP_ENV === "prod"
    ? "https://backend.wes-wallet.com/uploads/"
    : process.env.REACT_APP_ENV === "dev"
    ? "http://202.144.201.117:3000/uploads/"
    : "http://localhost:3000/uploads/"
