import { Link } from 'react-router-dom'
import React, { useState } from 'react';
import GeneralButton from "../Buttons/generalButton";
import { animateScroll as scroll, Link as ScrollLink } from "react-scroll";
import Logo from "../../image/wex.png";

const Avatar = () => {
    return <img
        src={Logo}
        className="w-64 h-auto"
        alt="Logo"
    />;
};

export default function Navbar2(props) {

    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
    };

    return (
        <>
            <nav
                className=' left-0  w-full bg-white  z-40'>
                <div className=" mx-4 md:mx-12   flex items-center flex-wrap pt-0 ">
                    <Link to='/' className='inline-flex items-center '>
                        <Avatar onClick={scrollToTop} />
                    </Link>
                    <button
                        className=' inline-flex p-2 rounded lg:hidden  ml-auto hover:text-white  border border-transparent focus:outline-none focus:border-transparent'
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
                    {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
                    <div className={`${active ? '' : 'hidden'} w-full lg:inline-flex lg:flex-grow lg:w-auto`}>
                        <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto'>

                            {/*<ScrollLink*/}
                                {/*activeClass="active"*/}
                                {/*to="section1"*/}
                                {/*spy={true}*/}
                                {/*smooth="true"*/}
                                {/*offset={-80}*/}
                                {/*duration={500}*/}
                            {/*>*/}
                                {/*<p className=" cursor-pointer hover:border-b-2 hover:border-active lg:mx-3 text-headline items-center justify-center  lg:inline-flex lg:w-auto w-full px-3 py-2 transform lg:hover:scale-110 lg:focus:scale-110 border-b-1 text-base border-transparent hover:border-branding-color-1 focus:border-branding-color-1 hover:text-branding-color-1 focus:text-branding-color-1  font-medium hover:font-bold focus:font-bold active:font-bold active:bg-branding-color-3">*/}

                                    {/*/!*className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white '>*!/*/}
                                {/*ফিচার*/}
                            {/*</p>*/}
                            {/*</ScrollLink>*/}

                            {/*<ScrollLink*/}
                                {/*activeClass="active"*/}
                                {/*to="section2"*/}
                                {/*spy={true}*/}
                                {/*smooth="true"*/}
                                {/*offset={-90}*/}
                                {/*duration={500}*/}
                            {/*>*/}
                                {/*<p className=" cursor-pointer hover:border-b-2 hover:border-active lg:mx-3 text-headline items-center justify-center  lg:inline-flex lg:w-auto w-full px-3 py-2 transform lg:hover:scale-110 lg:focus:scale-110 border-b-1 text-base border-transparent hover:border-branding-color-1 focus:border-branding-color-1 hover:text-branding-color-1 focus:text-branding-color-1  font-medium hover:font-bold focus:font-bold active:font-bold active:bg-branding-color-3">*/}
                                    {/*লাইভ ক্লাস*/}
                            {/*</p>*/}
                            {/*</ScrollLink>*/}
                            {/*<Link*/}
                                {/*to='https://play.google.com/store/apps/details?id=tech.shikho.android&hl=en&gl=US'>*/}
                                {/*<a target="_blank" className="cursor-pointer hover:border-b-2 hover:border-active lg:mx-3  text-headline items-center justify-center  lg:inline-flex lg:w-auto w-full px-3 py-2 transform lg:hover:scale-110 lg:focus:scale-110 border-b-1 text-base border-transparent hover:border-branding-color-1 focus:border-branding-color-1 hover:text-branding-color-1 focus:text-branding-color-1  font-medium hover:font-bold focus:font-bold active:font-bold active:bg-branding-color-3">*/}
                                    {/*অ্যাপ ডাউনলোড*/}
                            {/*</a>*/}
                            {/*</Link>*/}

                            {/*<ScrollLink*/}
                                {/*activeClass="active"*/}
                                {/*to="section4"*/}
                                {/*spy={true}*/}
                                {/*smooth="true"*/}
                                {/*offset={-630}*/}
                                {/*duration={500}>*/}

                                {/*<p*/}
                                    {/*className="cursor-pointer hover:border-b-2 hover:border-active lg:mx-3  text-headline items-center justify-center  lg:inline-flex lg:w-auto w-full px-3 py-2 transform lg:hover:scale-110 lg:focus:scale-110 border-b-1 text-base border-transparent hover:border-branding-color-1 focus:border-branding-color-1 hover:text-branding-color-1 focus:text-branding-color-1  font-medium hover:font-bold focus:font-bold active:font-bold active:bg-branding-color-3">*/}

                                    {/*/!*className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white '>*!/*/}
                                {/*মেন্টর*/}
                            {/*</p>*/}
                            {/*</ScrollLink>*/}
                            {/*<Link to='/login'*/}
                                {/*className="cursor-pointer hover:border-b-2 hover:border-active lg:mx-3 text-headline items-center justify-center  lg:inline-flex lg:w-auto w-full px-3 py-2 transform  border-b-1 text-base border-transparent hover:border-branding-color-1 focus:border-branding-color-1 hover:text-branding-color-1 focus:text-branding-color-1  font-medium hover:font-bold focus:font-bold active:font-bold active:bg-branding-color-3">*/}

                                {/*/!*className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white '>*!/*/}
                                {/*প্যাকেজ সমুহ*/}
                            {/*</Link>*/}
                            {/*<ScrollLink*/}
                                {/*activeClass="active"*/}
                                {/*to="section11"*/}
                                {/*spy={true}*/}
                                {/*smooth="true"*/}
                                {/*offset={-70}*/}
                                {/*duration={500}>*/}

                                {/*<p*/}
                                    {/*className="cursor-pointer hover:border-b-2 hover:border-active cursor-pointer lg:mx-3 text-headline items-center justify-center  lg:inline-flex lg:w-auto w-full px-3 py-2 transform lg:hover:scale-110 lg:focus:scale-110  border-b-1 text-base border-transparent hover:border-branding-color-1 focus:border-branding-color-1 hover:text-branding-color-1 focus:text-branding-color-1  font-medium hover:font-bold focus:font-bold active:font-bold active:bg-branding-color-3">*/}

                                    {/*/!*className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white '>*!/*/}
                                {/*যোগাযোগ করুন*/}
                            {/*</p>*/}
                            {/*</ScrollLink>*/}

                            {/*<Link to={"/signin"}>*/}

                                {/*<a>*/}
                                    {/*<GeneralButton*/}
                                        {/*title="Login"*/}
                                    {/*/>*/}

                                {/*</a>*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
