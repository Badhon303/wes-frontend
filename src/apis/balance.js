import { BASE_URL } from "../constants";

const { sendGetRequest } = require("../libs/FetchApi");

const getBalance = async (address, name, type = "erc20") => {
  let url = `${BASE_URL}/account/get-balance?address=${address}&currency=${name}&type=${type}`;
  return sendGetRequest(url, null, { credential: true }).then((response) => {
    if (response) {
      if (response.data.status_code === 401) window.location.href = "/signin";
      // TODO:: move this to FetchApi.js and instead of redirection should refresh token
      else if (
        response.data.status_code === 404 ||
        response.data.status_code === 500
      ); // console.log('Whoops..', "No balance found", 'error')
      return parseFloat(response.data.result && response.data.result.balance);
    }
  });
};

export function getEagleBalance(address) {
  return getBalance(address, "EAGLE");
}

export function getWolfBalance(address) {
  return getBalance(address, "WOLF");
}

export function getSnowBalance(address) {
  return getBalance(address, "SNOW");
}

export function getEtherBalance(address) {
  return getBalance(address, "ETH", "coin");
}

export function getBtcBalance(address) {
  return getBalance(address, "BTC", "coin");
}
