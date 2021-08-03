import React from "react";

export default function GeneralButton({title,onClick}) {

    return(
        <button  onClick={onClick}
                type="button"
                className="w-full  sm:w-auto inline-flex justify-center
                 text-white border-1 border-branding-text-color text-xl
                rounded py-1.5 px-12 bg-site-theme focus:outline-none hover:shadow-lg mr-6"
            >
                {title}
            </button>

    )
}
