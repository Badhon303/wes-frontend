import React from "react";
import Popper from "popper.js";
import {Link, useHistory} from 'react-router-dom';
import userManager from "../../libs/UserManager";
import {PHOTO_URL} from "../../constants";
import AvatarLogo from "../../image/avatar.png";


export const DropdownOnNavbar = ({user, color }) => {

    let history=useHistory();
    const photoUrl = user && user.photo !== "no-photo.jpg" ? PHOTO_URL + user.photo : AvatarLogo;


    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start"
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    // bg colors
    let bgColor;
    color === "white"
        ? (bgColor = "bg-white")
        : (bgColor = "bg-gray-200");


    const handleLogOut=()=>{
        userManager.removeLoggedInUser();
           history.push("/");
    }

    function handleProfileEditRoute() {
        document.location.href="/profile/edit"
    }
    return (
        <>
            <div className="ml-auto flex flex-wrap ">
                {/*<div className="w-full sm:w-6/12 md:w-4/12 md:px-4 px-2">*/}
                    <div className="relative inline-flex align-middle w-full">
                        <button
                            className={
                                "text-black font-normal uppercase text-sm px-6 py-3  inline-flex hover:text-site-theme outline-none focus:outline-none mr-1 mb-1 " +
                                bgColor
                            }
                            style={{ transition: "all .15s ease" }}
                            type="button"
                            ref={btnDropdownRef}
                            onClick={() => {
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        >
                            <img src={user && photoUrl ? photoUrl : AvatarLogo}
                                 className="w-10 h-10 rounded-full  " alt="Profile Picture "/>
                        </button>
                        <div
                            ref={popoverDropdownRef}
                            className={
                                (dropdownPopoverShow ? "block " : "hidden ") +
                                (color === "white" ? "bg-white " : bgColor + " ") +
                                "text-base z-50 float-left py-2 list-none text-left rounded shadow-xl border-1 mt-1 mr-20"
                            }
                            style={{ minWidth: "12rem" }}
                        >


                            <a
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent " +
                                    (color === "white" ? " text-gray-800" : "text-white")
                                }
                            >
                                {user.nickName}
                            </a>

                       {/*<a onClick={handleProfileEditRoute}*/}
                                {/*className={*/}
                                    {/*"cursor-pointer hover:bg-site-theme hover:text-white text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent " +*/}
                                    {/*(color === "white" ? " text-gray-800" : "text-white")*/}
                                {/*}*/}
                            {/*>*/}
                                {/*Profile Edit*/}
                            {/*</a>*/}

                            <div className="my-2 border-t-1 border " />
                               <a
                                className={
                                    "cursor-pointer hover:bg-site-theme hover:text-white text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent " +
                                    (color === "white" ? " text-gray-800" : "text-white")
                                }
                                onClick={handleLogOut}
                            >
                               Sign Out
                            </a>
                        </div>
                    </div>
                {/*</div>*/}
            </div>
        </>
    );
};
