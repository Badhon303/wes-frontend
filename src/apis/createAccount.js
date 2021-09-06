import { BASE_URL } from "../constants"
import Cookies from "js-cookie"

function postCreateBTCAccount(url) {
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")
  myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  }

  return fetch(`${BASE_URL}${url}`, requestOptions).then((res) => {
    // console.log(res, "response")
    return res.json().then((data) => {
      if (res.ok) {
        return { ok: true, data }
      } else {
        return { ok: false, err: res, data }
      }
    })
  })
}

// export function createBitcoinAccount() {
//     return postCreateBTCAccount('/btc/account');
// }

export function createBlockChainAccount() {
  return postCreateBTCAccount("/auth/create-blockchain-account")
}

// export function createEtherAccount() {
//     return postCreateBTCAccount('/account');
// }
