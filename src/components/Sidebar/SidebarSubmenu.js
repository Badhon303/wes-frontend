import React, {useState,useEffect} from 'react'
import {Link, NavLink,useHistory} from 'react-router-dom'
import {ProfileIcon, TokenIcon, UserIcon} from "../../image/icons";
import profileIcon from "../../image/icons/pending-users.svg";
import userIcon from "../../image/icons/users-group.svg";
import InventoryIcon from "../../image/icons/inventory.svg";
import ReferralIcon from "../../image/icons/referral.svg";
import GoldIcon from "../../image/icons/loyalty_black_24dp.svg";

function SidebarSubmenu({ route,title,icon }) {
    const history = useHistory();
    const path= history.location.pathname;

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false)

  function handleDropdownMenuClick() {
    setIsDropdownMenuOpen(!isDropdownMenuOpen)
  }

  useEffect(()=>{

      if(path && route.filter(obj=> obj.path ===path).length>0){
          if(isDropdownMenuOpen===false)setIsDropdownMenuOpen(true)
      }

  },[])

  return (
    <li className="relative  py-1" key={route.title}>

        <button
        className="outline-none focus:outline-none px-6 py-2 inline-flex items-center justify-between w-full text-sm font-semibold hover:font-bold  transition-colors duration-150  dark:hover:text-gray-200"
        onClick={handleDropdownMenuClick}
        aria-haspopup="true"
      >
        <span className="inline-flex items-center">
            {icon=== "UserIcon" &&
            <img src={userIcon} width={12} height={12} className="h-6 w-6"/>

            }
            {icon=== "ProfileIcon" &&
            <img src={profileIcon} width={12} height={12} className="h-6 w-6"/>
            }
            {icon=== "TokenIcon" &&
            <img src={InventoryIcon} width={12} height={12} className="h-6 w-6"/>
            }

            {icon ==="Referral"   &&
            <img src={ReferralIcon} width={12} height={12} className="h-6 w-6"/>
            }
            {icon ==="Gold"   &&
            <img src={GoldIcon} width={12} height={12} className="h-6 w-6"/>
            }

          <span className="ml-4">{title}</span>
        </span>
          <div className="w-4 h-4" aria-hidden="true" >
              {!isDropdownMenuOpen &&
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              }
              {isDropdownMenuOpen &&
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
              }
          </div>
      </button>


        { isDropdownMenuOpen && <div>
        <ul
          className="  space-y-0 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
          aria-label="submenu"
        >
          {route.map((r) => (
            <li
              className="pl-12 py-2 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
              key={r.name}
            >
                <NavLink
                    exact
                    to={r.path}
                    className="hover:font-bold   py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
                    activeClassName=" text-white bg-site-theme font-bold"
                >

                    <span className="ml-4">  {r.name}</span>
                </NavLink>

            </li>
          ))}
        </ul>
      </div> }
    </li>
  )
}

export default SidebarSubmenu
