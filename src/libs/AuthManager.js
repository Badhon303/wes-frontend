import Cookies from "js-cookie";
import UserManager from "./UserManager";

export function isLoggedIn() {
  let accessToken = Cookies.get("access-token");

  console.log("ei holo accessToken: ", !!accessToken);
  return !!accessToken;
}

export function isAdmin() {
  const user = UserManager.getLoggedInUser();

  return isLoggedIn() && user && user.role === "admin";
}
