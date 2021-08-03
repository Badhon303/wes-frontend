import Cookie from "js-cookie";

function getLoggedInUser() {
    let cookie= Cookie.get('access-token')
    let user = localStorage.getItem('auth-user');
  return user && cookie  ? JSON.parse(user) : null;
}

function removeLoggedInUser() {
    Cookie.remove('access-token')
  localStorage.removeItem('auth-user');

}

function setLoggedInUser(user) {
  if(Cookie.get('access-token')) {
      localStorage.setItem('auth-user', JSON.stringify(user));
  }
}
function setBitcoinInfo(info) {
    localStorage.setItem('bitcoin',JSON.stringify(info))
}



export default {
  getLoggedInUser,
  setLoggedInUser,
  removeLoggedInUser,
    setBitcoinInfo,
}
