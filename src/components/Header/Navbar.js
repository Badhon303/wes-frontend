import {Link, useHistory} from 'react-router-dom'
import React, {useState} from 'react';
import {animateScroll as scroll} from "react-scroll";
import Logo from "../../image/wex.png";
import UserManager from "../../libs/UserManager";
import {DropdownOnNavbar} from "../Dropdown/DropdownOnNavbar";

const Avatar = () => {
    return <img
        src={Logo}
        className="md:w-56 h-auto w-48"
        alt="Logo"
    />;
};

export default function Navbar(props) {

    let history= useHistory();

   const user = UserManager.getLoggedInUser();

    const scrollToTop = () => {
        scroll.scrollToTop();
    };


    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
        props.mobileDrawer(true)

    };
    const handleVerify=()=>{
        document.location.href="/profile/verify";
    }

    return (
        <>
            <div className="bg-site-theme h-6"/>
            <nav
                className='relative  left-0  w-full bg-white  z-auto overflow shadow-sm'>
                <div className="  ml-4 mr-6 md:mr-4 flex items-center flex-wrap pt-0 ">
                    <Link to='/' className='inline-flex items-center '>
                        <Avatar onClick={scrollToTop} />
                    </Link>
                    {/*{getLoggedInUser &&*/}
                    {/*<Dropdown color="white" />*/}
                    {/*}*/}


                    {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}

                    <div className={`${active ? '' : 'block'} inline-flex flex-grow w-auto`}>

                        <div className='inline-flex flex-row ml-auto w-auto  items-start  lg:h-auto'>


                            {user &&   <DropdownOnNavbar
                                user={user}
                                color="white" />}
                            <button
                                className=' inline-flex py-4 rounded lg:hidden  ml-auto   border border-transparent focus:outline-none focus:border-transparent'
                                onClick={handleClick}
                            >
                                <svg
                                    className='stroke-current text-branding-color-2 w-6 h-6'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                            </button>

                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
