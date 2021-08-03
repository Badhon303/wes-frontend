import React, {useState} from "react";
import SidebarDesktop from "./SidebarDesktop";
import Navbar from "../Header/Navbar";


export default function Layout({children, isPrivatePage}) {

    const [mobileDrawer, setMobileDrawer] = useState(false);

    function handleMobileDrawer(value) {
        setMobileDrawer(!mobileDrawer)
    }

    return (
        <>

            <header>
                <Navbar
                    mobileDrawer={handleMobileDrawer}
                />
            </header>

            {/*<Header isPrivatePage={isPrivatePage} mobileDrawer={handleMobileDrawer}/>*/}
            <div className="flex h-screen">
                <aside className="z-0 flex-shrink-0 border-r-1 border-t-1 hidden w-64 overflow-hidden bg-white dark:bg-gray-800 lg:block">
                    <SidebarDesktop/>
                </aside>

                {mobileDrawer && <div className="block z-50 border-r-1 border-t-1  flex-shrink-0 w-48 overflow bg-white dark:bg-gray-800 lg:hidden">
                    <SidebarDesktop/>
                </div>}
                <div className="flex-grow  ">
                    {children}
                </div>
                {/*<Footer />*/}
            </div>
        </>
    )
}
