import React from "react";

export default function CancelButton({title,onClick}) {

    return(
        <button  onClick={onClick}
                type="button"
                className="w-full  sm:w-auto
                 text-white border-1 border-branding-text-color text-xl
                rounded py-1.5 px-12 bg-gray-400 focus:outline-none hover:shadow-lg mr-6 my-4 lg:my-0"
            >
                {title}
            </button>

    )
}
