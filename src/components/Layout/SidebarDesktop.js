import { NavLink, useHistory } from "react-router-dom";
import UserManager from "../../libs/UserManager";
import React from "react";
import SidebarSubmenu from "../Sidebar/SidebarSubmenu";
import { ProfileIcon, TokenIcon, UserIcon } from "../../image/icons";

let adminRoute = [
  {
    name: "Approved",
    path: "/users",
  },
  {
    name: "Pending",
    path: "/pending-users",
  },
  {
    name: "Unapplied",
    path: "/unapplied-users",
  },
  {
    name: "Rejected",
    path: "/rejected-users",
  },
];

let tokenRouteAdmin = [
  {
    name: "Send",
    path: "/send",
  },
  // {
  //     name:"Buy",
  //     path:"/buy"
  // },
];

let tokenRouteUser = [
  {
    name: "Send",
    path: "/send",
  },
  {
    name: "Buy",
    path: "/buy",
  },
];
const referralRouteAdmin = [
  {
    name: "Update Price ",
    path: "/update-price",
  },
  {
    name: "RP History ",
    path: "/referral-purchase-history",
  },
  {
    name: "Members ",
    path: "/members",
  },
];

const referralRouteUser = [
  {
    name: "Purchase ",
    path: "/referral-purchase",
  },
  {
    name: "RP Usage History ",
    path: "/referral-purchase-history",
  },
  {
    name: "RP Reward History ",
    path: "/referral-reward-history",
  },
  {
    name: "Members ",
    path: "/members",
  },
];
const goldPointsAdminRouteUser = [
  {
    name: "Trigger ",
    path: "/trigger-gold-points",
  },

  {
    name: "Exchange Rate ",
    path: "/gp-exchange-rate",
  },
  {
    name: "Exchange History ",
    path: "/gp-exchange-history",
  },
];

const goldPointsUserRouteUser = [
  {
    name: "Purchase ",
    path: "/gp-purchase",
  },
  {
    name: "History ",
    path: "/gp-history",
  },
];

let userRoute = [
  {
    name: "Basic Info",
    path: "/profile-edit",
  },
  {
    name: "NID",
    path: "/edit-nid",
  },
  {
    name: "Passport",
    path: "/edit-passport",
  },
  {
    name: "Driving License",
    path: "/edit-driving",
  },
  {
    name: "Change Password",
    path: "/edit-password",
  },
];
export default function SidebarDesktop() {
  const history = useHistory();
  const user = UserManager.getLoggedInUser();

  const handleLogOut = () => {
    UserManager.removeLoggedInUser();
    history.push("/");
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a
        className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
        href="#"
      >
        Menu
      </a>
      <ul className="mt-6">
        {user &&
          user.role === "user" &&
          // user &&
          (user.approvalStatus === "pending" ||
            user.approvalStatus === "unapplied") &&
          !user.firstName &&
          ((user.nidBack === "nid_back.jpg" &&
            user.nidFront === "nid_front.jpg") ||
            user.passportBiodata === "passport_biodata.jpg" ||
            (user.drivingBack === "driving_back.jpg" &&
              user.drivingFront === "driving_front.jpg")) && (
            <li className="relative  py-1">
              <NavLink
                exact
                to={"/profile/verify"}
                className="hover:font-bold px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
                activeClassName=" text-white bg-site-theme font-bold"
              >
                <div aria-hidden="true">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    enableBackground="new 0 0 24 24"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <g>
                      <rect fill="none" height="24" width="24" />
                    </g>
                    <g>
                      <path d="M23,12l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,12l2.44,2.79l-0.34,3.7 l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,12z M10.09,16.72l-3.8-3.81l1.48-1.48l2.32,2.33 l5.85-5.87l1.48,1.48L10.09,16.72z" />
                    </g>
                  </svg>
                </div>
                <span className="ml-4">ID Verification</span>
              </NavLink>
            </li>
          )}

        {user && (
          <li className="relative  py-1">
            <NavLink
              exact
              to={"/dashboard"}
              className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
              activeClassName=" text-white bg-site-theme font-bold"
            >
              <div aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <rect fill="none" height="24" width="24" />
                  <path d="M11,21H5c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h6V21z M13,21h6c1.1,0,2-0.9,2-2v-7h-8V21z M21,10V5c0-1.1-0.9-2-2-2h-6v7H21z" />
                </svg>
              </div>
              <span className="ml-4">Dashboard</span>
            </NavLink>
          </li>
        )}

        {user && user.role === "admin" && (
          <SidebarSubmenu
            route={adminRoute}
            title={"Users"}
            icon={"UserIcon"}
          />
        )}

        <SidebarSubmenu
          route={userRoute}
          title={"Profile"}
          icon={"ProfileIcon"}
        />

        {user && user.role === "admin" && (
          <SidebarSubmenu
            route={tokenRouteAdmin}
            title={"Tokens"}
            icon={"TokenIcon"}
          />
        )}

        {user && user.role === "user" && (
          <SidebarSubmenu
            route={tokenRouteUser}
            title={"Tokens"}
            icon={"TokenIcon"}
          />
        )}

        {user && user.role === "admin" && (
          <SidebarSubmenu
            route={referralRouteAdmin}
            title={"Referral Point"}
            icon={"Referral"}
          />
        )}

        {user && user.role === "user" && (
          <SidebarSubmenu
            route={referralRouteUser}
            title={"Referral Point"}
            icon={"Referral"}
          />
        )}

        {user && user.role === "admin" && (
          <SidebarSubmenu
            route={goldPointsAdminRouteUser}
            title={"Gold Points"}
            icon={"Gold"}
          />
        )}

        {user && user.role === "user" && (
          <SidebarSubmenu
            route={goldPointsUserRouteUser}
            title={"Gold Points"}
            icon={"Gold"}
          />
        )}

        {user && (
          <li className="relative  py-1">
            <NavLink
              exact
              to={"/orders"}
              className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
              activeClassName=" text-white bg-site-theme font-bold"
            >
              <div aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <span className="ml-4">Orders</span>
            </NavLink>
          </li>
        )}

        {user && user.role === "admin" && (
          <li className="relative  py-1">
            <NavLink
              exact
              to={"/emails"}
              className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
              activeClassName=" text-white bg-site-theme font-bold"
            >
              <div aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <span className="ml-4">Email</span>
            </NavLink>
          </li>
        )}

        {user && user.role === "user" && (
          <li className="relative  py-1">
            <a
              href={"https://wes.s-capitalpartners.com/"}
              target={"_blank"}
              className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
            >
              <span className="ml-1">Link to LP Site </span>
            </a>
          </li>
        )}
        {user && user.role === "user" && (
          <li className="relative  py-1">
            <a
              href={"https://wes.s-capitalpartners.com/en/#wallet"}
              target={"_blank"}
              className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
            >
              <span className="ml-1">Link to LP Site News </span>
            </a>
          </li>
        )}
        {user && user.role === "user" && (
          <li className="relative  py-1">
            <a
              href={"https://wes.s-capitalpartners.com/en/#contact"}
              target={"_blank"}
              className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
            >
              <span className="ml-1">Link to LP Site Contact </span>
            </a>
          </li>
        )}

        <div className="my-1 border-b-2 w-full" />

        <li
          className="relative  py-1 bottom-0 left-0 cursor-pointer"
          onClick={handleLogOut}
        >
          <a className="hover:font-bold  px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            <span className="ml-4">Log Out </span>
          </a>
        </li>
      </ul>
    </div>
  );
}
