import React from "react";
import {BangladeshFlag} from "../../utils/svgImages/svgImage";

export default function SubscriptionButton() {

    return (
        <>
            <div
                className="focus:shadow-lg hover:shadow-lg flex flex-wrap items-stretch w-full mb-2 relative h-15 bg-white items-center rounded mb-6 pr-0">

            <div className="flex -mr-px justify-center w-15 p-2  divide-x divide-black">
              <span
                  className="flex items-center leading-normal bg-white lg:px-3 border-0 rounded rounded-r-none text-xl text-gray-600"
              >
                <i className="pr-2 lg:pr-4 ">
                     <img src={'/icons/bdFlag.png'}
                          className="w-10  h-6"/>

                </i> +88
              </span>
        </div>
        <input
            type="text"
            className=" flex-shrink flex-grow flex-auto leading-normal w-px flex-1
             border-0 h-8 border-grey-light rounded rounded-l-none
            px-3 self-center relative  font-roboto text-xl outline-none"
            placeholder="মোবাইল নাম্বার দিন"
        />
               <span>
                   <button
                type="button"
                className=" w-auto cursor-pointer bg-general-button-outline
                inline-flex justify-center  text-white
                text-base rounded-sm  py-3 px-5
                hover:bg-branding-color-3 active:bg-branding-color-3
                border border-transparent focus:outline-none
                focus:border-transparent"
                >সাবমিট করুন
                </button>
               </span>

        </div>

            {/*<input className="p-4 placeholder-gray-600 focus:placeholder-gray-400 ..."*/}
                   {/*placeholder="মোবাইল নাম্বার দিন"/>*/}
            {/*<button*/}
                {/*type="button"*/}
                {/*className="w-auto cursor-pointer bg-general-button-outline*/}
                            {/*inline-flex justify-center  text-white*/}
                            {/*text-base rounded-sm  py-4 px-5*/}
                            {/*hover:bg-branding-color-3 active:bg-branding-color-3*/}
                            {/*border border-transparent focus:outline-none*/}
                            {/*focus:border-transparent"*/}
            {/*>সাবমিট করুন*/}
            {/*</button>*/}
        </>
    )
}
