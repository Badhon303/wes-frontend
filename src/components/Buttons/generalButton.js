import React from "react";

export default function GeneralButton({title}) {

    return(
        <button
                type="button"
                className="w-full cursor-pointer bg-site-theme  sm:w-auto inline-flex justify-center  text-white   text-base rounded-xl  py-1.5 px-6 hover:bg-branding-color-3 active:bg-branding-color-3
                border border-transparent focus:outline-none focus:border-transparent"
            >
                {title}
            </button>

    )
}
