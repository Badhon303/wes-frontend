import {Link} from "react-router-dom";
import UserManager from "../../libs/UserManager";
import React from "react";
import {useHistory} from 'react-router-dom';

export default function SidebarMobile() {

    let history= useHistory();

    const user = UserManager.getLoggedInUser();

    const handleVerify = () => {
        history.push("/profile/verify");
    }

    return (

        <div className="bg-white shadow  overflow-y-auto z-50 relative h-full min-h-screen p-6">
            <div className="xl:py-2">
                <div className="hidden xl:block uppercase font-bold text-black  text-lg  px-4 py-2">
                    Menu
                </div>


                {user && user.role === 'user' && user.approvalStatus === false &&
                <Link to={'/profile/verify'}>
                    <div className="flex flex-row group relative sidebar-item with-children">
                        <p
                            className=" xl:flex xl:items-center text-center xl:text-left shadow-light xl:shadow-none py-6 xl:py-2 xl:px-4 border-l-4 border-transparent hover:bg-site-theme">
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M23,12l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,12l2.44,2.79l-0.34,3.7 l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,12z M10.09,16.72l-3.8-3.81l1.48-1.48l2.32,2.33 l5.85-5.87l1.48,1.48L10.09,16.72z"/></g></svg>
                            <div className="ml-2 text-black text-base group-hover:text-white">Id Verification</div>
                        </p>
                    </div>
                </Link>}


                {user && user.role === 'admin' && <Link to={'/users'}>
                    <div className="group relative sidebar-item with-children">
                        <p
                            className="block xl:flex xl:items-center text-center xl:text-left shadow-light xl:shadow-none py-6 xl:py-2 xl:px-4 border-l-4 border-transparent hover:bg-site-theme">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                            </svg>
                            <div className="ml-2 text-black text-base group-hover:text-white">Users</div>
                        </p>
                    </div>
                </Link>}

                {user && user.role === 'admin' && <Link to={'/pending-users'}>
                    <div className="group relative sidebar-item with-children">
                        <p
                            className="block xl:flex xl:items-center text-center xl:text-left shadow-light xl:shadow-none py-6 xl:py-2 xl:px-4 border-l-4 border-transparent hover:bg-site-theme">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"/>
                            </svg>
                            <div className="ml-2  text-black text-base group-hover:text-white">Pending Users</div>
                        </p>
                    </div>
                </Link>}


                {user && user.role === 'user' && <Link to={'/profile'}>
                    <div className="group relative sidebar-item with-children">
                        <p
                            className="block xl:flex xl:items-center text-center xl:text-left shadow-light xl:shadow-none py-6 xl:py-2 xl:px-4 border-l-4 border-transparent hover:bg-site-theme">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                 className="h-6 w-6 group-hover:text-white text-black fill-current xl:mr-2">
                                <path
                                    d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
                                    className="heroicon-ui"></path>
                            </svg>
                            <div className="text-black text-base group-hover:text-white">Profile</div>
                        </p>
                    </div>
                </Link>}

                {user && user.role === 'user' && <Link to={'/buy'}>
                    <div className="group relative sidebar-item with-children">
                        <p
                            className="block xl:flex xl:items-center text-center xl:text-left shadow-light xl:shadow-none py-6 xl:py-2 xl:px-4 border-l-4 border-transparent hover:bg-site-theme">
                            <svg className="h-6 w-6 text-black group-hover:text-white fill-current xl:mr-2"
                                 xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                            <div className="text-black text-base group-hover:text-white">Buy</div>
                        </p>
                    </div>
                </Link>}

                {user && user.role === 'user' && <Link to={'/sell'}>
                    <div className="group relative sidebar-item with-children">
                        <p
                            className="block xl:flex xl:items-center text-center xl:text-left shadow-light xl:shadow-none py-6 xl:py-2 xl:px-4 border-l-4 border-transparent hover:bg-site-theme">

                            <svg className="h-6 w-6 group-hover:text-white text-black fill-current xl:mr-2"
                                 xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24"
                                 viewBox="0 0 24 24" width="24">
                                <g>
                                    <path d="M0,0h24v24H0V0z" fill="none"/>
                                </g>
                                <g>
                                    <path
                                        d="M21.41,11.41l-8.83-8.83C12.21,2.21,11.7,2,11.17,2H4C2.9,2,2,2.9,2,4v7.17c0,0.53,0.21,1.04,0.59,1.41l8.83,8.83 c0.78,0.78,2.05,0.78,2.83,0l7.17-7.17C22.2,13.46,22.2,12.2,21.41,11.41z M6.5,8C5.67,8,5,7.33,5,6.5S5.67,5,6.5,5S8,5.67,8,6.5 S7.33,8,6.5,8z"/>
                                </g>
                            </svg>

                            <div className="text-black text-base group-hover:text-white">Sell</div>
                        </p>
                    </div>
                </Link>}

            </div>


        </div>
    )
}
