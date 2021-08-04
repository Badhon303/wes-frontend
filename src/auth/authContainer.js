// import {getUrlAccessDetails} from "../applicationRoutes/routesManager";
import Cookie from "js-cookie";

// const tokenKey = "token";
// const userInfoKey = "auth-user";
// const clickNumber = "clickNumber";
// const vClick = "vClick";
// const signUpSuccess = "signUpSuccess";
// export const availableRoutesKey = "routes";

// export function loginSuccess(user) {
// 	localStorage.setItem(tokenKey, user.loginKey);
// 	localStorage.setItem(userInfoKey, encrypt(JSON.stringify({
// 		id: user.id,
// 		name: user.firstName,
// 		role: user.roleId
// 	})));

// 	if (clickNumber in localStorage) {
// 		let checkLocalStorage = localStorage.getItem(clickNumber);
// 		let updateClickNumber = localStorage.setItem(clickNumber, checkLocalStorage);

// 	}
// 	else {
// 		localStorage.setItem(clickNumber, 11);
// 	}
// 	if (vClick in localStorage) {
// 		let checkLocalStorage = localStorage.getItem(vClick);
// 		let updateVClickNumber = localStorage.setItem(vClick, checkLocalStorage);

// 	}
// 	else {
// 		localStorage.setItem(vClick, 11);
// 	}

// }

// var x = localStorage.length;

export function isLoggedIn() {
  if (Cookie.get("access-token") && localStorage.getItem("auth-user")) {
    return true;
  }

  return false;
}

// export function getUserAccessOfUrl(url) {
//   return getUrlAccessDetails(url);
// }

// export function logout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("auth-user");
//   localStorage.removeItem("routes");
// }

// export function getUserToken() {
//   return localStorage.getItem(tokenKey);
// }

export function getUserInfo() {
  let localData = localStorage.getItem("auth-user");
  if (localData) return JSON.parse(localData);
  else return {};
}

// export function saveRoutesToLocalstorage(routes) {
//   let encrypted = encrypt(JSON.stringify(routes));
//   localStorage.setItem(availableRoutesKey, encrypted);
// }

// export function getClickNumber() {
//   return localStorage.getItem(clickNumber);
// }

// export function updateLocalStorageClickNumber(newInput) {
//   localStorage.setItem(clickNumber, newInput);
// }

// export function getStreamClickNumber() {
//   return localStorage.getItem(vClick);
// }
// export function updateLocalStorageVClickNumber(newInput) {
//   localStorage.setItem(vClick, newInput);
// }

// export function setSignUpSuccess() {
//   localStorage.setItem(signUpSuccess, 1);
// }
// export function getSignUpSuccess() {
//   return localStorage.getItem(signUpSuccess);
// }
// export function removeSignUpSuccessCode() {
//   localStorage.removeItem(signUpSuccess);
// }

// function encrypt(data) {
//   return data;
// }
// function decrypt(data) {
//   return data;
// }
