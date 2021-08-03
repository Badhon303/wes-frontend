import Loader from "react-loader-spinner";
import React from "react";

export default function
    CustomLoader() {

    return(
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-transparent flex flex-col items-center justify-center"
            ><Loader
            type="Circles"
            color="#ff8c00"
            height={100}
            width={100}
            timeout={7000}//7 secs
            className=" p-10 z-50  "
        /></div>
    )
}
