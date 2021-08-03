import React from "react";
import {func} from "prop-types";
import Modal from "react-modal";
import {getReadableTime} from "../../utils/times";


const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 1
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 1
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 1
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 1
    }
};


export default function ReferralHistoryModal(props) {
    const orders = props.orderDetails;

    function handleModalCallback() {
        props.onClose && props.onClose();
    }




    return (
        <Modal
            isOpen={true}
            contentLabel="onRequestClose Example"
            onRequestClose={handleModalCallback}
            shouldCloseOnOverlayClick={false}
        >
            <div className=" ">
                <div
                    className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-2xl font-semibold text-site-theme ">
                      Introducer Percentage
                    </h3>
                    <div
                        className="px-6 py-2 ml-auto cursor-pointer "
                        onClick={handleModalCallback}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path
                                d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>

                    </div>
                </div>


               <div>
                   <div className="bg-white  w-full my-2 border-1 block shadow ">
                       <div className="flex justify-between md:grid md:grid-cols-5    px-4 py-3 items-center text-sm md:text-base group">
                           <p
                               className="text-center text-10px md:text-sm text-gray-900 font-semibold
                              "
                           >
                               Level
                           </p>


                           <p className="text-center text-10px md:text-sm text-gray-900 font-semibold">
                               Full Name

                           </p>

                           <p className="text-center text-10px md:text-sm text-gray-900 font-semibold">
                               Email
                           </p>

                           <p className="text-center text-10px md:text-sm text-gray-900 font-semibold">
                              Referral Point
                           </p>


                           <p
                               className="text-center text-10px md:text-sm text-gray-900 font-semibold"
                           >
                               Reward Percentage
                           </p>

                       </div>
                   </div>

                   {orders && orders.length && orders.map((result) =>
                       (
                           <div className="bg-white  w-full my-2 border-1 block shadow ">
                               <div className="flex justify-between md:grid md:grid-cols-5  px-4 py-3 text-sm md:text-base group">
                                   <p
                                       className="text-center text-10px md:text-sm text-gray-900  "
                                   >
                                       {result && result.level ?  result.level : ''}
                                   </p>


                                   <p className="text-center text-10px md:text-sm text-gray-900 ">
                                       {result && result.fullName ?  result.fullName : ''}

                                   </p>


                                   <p className="text-center text-10px md:text-sm text-gray-900 ">
                                       {result && result.email  ?  result.email : ''}
                                   </p>

                                   <p className="text-center text-10px md:text-sm text-gray-900 ">
                                       {result.rewardedPoint ? result.rewardedPoint : ''}
                                   </p>


                                   <p className="text-center  text-10px md:text-sm text-gray-900 ">
                                       {result.rewardRatio ? result.rewardRatio : ''} %
                                   </p>

                               </div>
                           </div>

                       )
                   )}
               </div>



                <button onClick={handleModalCallback} className="mb-40 mt-12 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold"> Okay</button>


            </div>


        </Modal>

    )
}

