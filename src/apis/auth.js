import Cookies from 'js-cookie';
import { BASE_URL } from "../constants";
import { sendPutRequest } from '../libs/FetchApi';

export function signin(data) {
  return sendPostRequest('/auth/login', data);
}

export function refreshToken(data) {
  return sendPostRequest('/auth/refresh-tokens', data);
}

export function signup(data, referred) {
  if (referred) return sendPostRequest('/auth/register?referrerId=' + referred, data);
  else return sendPostRequest('/auth/register', data);
}

export function resetPass(data) {
  const token = data.token;
  delete data.token
  return sendPostRequest('/auth/reset-password?token=' + token, data);
}

export function forgotPass(data) {
  return sendPostRequest('/auth/forgot-password', data);
}

export function verifyAccount(data) {
  return sendPostRequest('/auth/verify-account', data);
}

export function changePass(userId, data) {
  return sendPutRequest(`/users/${userId}/change-password`, data, { credential: true })
}

export function transferFund(data) {
    return sendPostRequest(`/bc-account/transfer`, data, { credential: true })
}

export function createBtc(data) {
    return sendPostRequest(`/bc-account/transfer`, data, { credential: true })
}


export default {
  signin,
  signup,
  resetPass,
  forgotPass,
  refreshToken,
  verifyAccount,
  changePass,
    transferFund,
    createBtc
}

function sendPostRequest(url, data) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    // body: formData,
    body: JSON.stringify(data),
    redirect: 'follow',
  };

  return fetch(`${BASE_URL}${url}`, requestOptions)
    .then(res => {
      return res.json().then(data => {
        if (res.ok) {
          return { ok: true, data };
        } else {
          return { ok: false, err: res, data };
        }
      })
    });
}
