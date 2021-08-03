import Cookies from 'js-cookie';
import { BASE_URL } from "../constants";

const defaultOptions = {
  credential: false, // if true, include bearer token
};

export function sendPostRequest(url, data, options = {}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (options.credential) {
    myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
  }

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

export function sendDeleteRequest(url, data, options = {}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (options.credential) {
    myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
  }

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    // body: formData,
    body: JSON.stringify(data),
    redirect: 'follow',
  };

  return fetch(`${BASE_URL}${url}`, requestOptions)
    .then(res => {
      if (res.ok) {
        return { ok: true, data };
      } else {
        return { ok: false, err: res };
      }
    });
}

export function sendPutRequest(url, data, options = {}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (options.credential) {
    myHeaders.append("Authorization", "Bearer " + Cookies.get('access-token'));
  }

  const requestOptions = {
    method: 'PUT',
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

export function sendGetRequest(url, data, options = {}) {
  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");

  if (options.credential) {
    myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
  }

  let requestOptions={};

  if(data !=="none")requestOptions.body= data;

  requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // body: formData,
    redirect: 'follow',
  };

  return fetch(url, requestOptions)
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
