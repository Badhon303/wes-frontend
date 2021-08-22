import React from "react";
import {func} from "prop-types";
import Days from "dayjs";
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


export default function OrderDetailsModal(props) {
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
                        Order Information
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


                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="border shadow  border-gray-200 ">
                        <div className="py-4 px-6  group ">
                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700 ">Order
                                    Id : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all "> {orders.order_id}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">amount
                                    USD : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.amount_usd}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">Payment
                                    Currency : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.payment_currency}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">Payment
                                    amount : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.payment_amount}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">Payment
                                    from address : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.payment_from_address}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700 ">payment
                                    tx id : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all group-hover:underline  cursor-pointer group-hover:text-site-theme">
                                    <a target="_blank"
                                       href={process.env.REACT_APP_ENV === "dev" ?
                                           "https://kovan.etherscan.io/tx/" + orders.payment_tx_id :
                                           (orders.payment_currency === "BTC" ?
                                               "https://www.blockchain.com/btc/tx/" + orders.payment_tx_id :
                                               "https://etherscan.io/tx/" +orders.payment_tx_id)}>{orders.payment_tx_id} </a>



                                    </p>
                            </div>
                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">payment
                                    tx fee : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.payment_tx_fee}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">token
                                    received address : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.token_received_address}</p>
                            </div>

                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">status
                                    : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {orders.status}</p>
                            </div>
                            <div className="grid grid-cols-12 gap-4 ">
                                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">ordered
                                    at : </p>
                                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all"> {getReadableTime(orders.ordered_at)}</p>
                            </div>

                        </div>

                    </div>
                </div>

                <div className="my-6">

                    <p className="text-xl font-bold py-4 text-site-theme">Tokens</p>


                    <div
                        className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl group overflow-x-auto">

                        <div
                            className="grid grid-cols-12  items-center px-4 py-4 font-bold text-10px md:text-sm group">

                            <p className="col-span-2  break-all px-2">Tokens</p>


                            <p className="col-span-2 px-2  text-gray-900 break-all">
                                Quantity </p>


                            <p className=" col-span-8 px-2 cursor-pointer  group-hover:underline
                                group-hover:text-site-theme break-all">Tx Id</p>


                        </div>


                    </div>


                    {orders && orders.tokens.map((result) =>
                        (
                            <div
                                className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl group overflow-x-auto">

                                <div
                                    className="grid grid-cols-12 items-center px-4 py-4  text-10px md:text-sm group">

                                    <p className="col-span-2 break-all px-2">{result.token}</p>


                                    <p className="col-span-2 px-2  text-gray-900 break-all">
                                        {result.quantity} </p>


                                    <p className=" col-span-8 px-2 cursor-pointer text-gray-700 group-hover:underline group-hover:text-site-theme break-all">
                                        <a target="_blank"
                                           href={process.env.REACT_APP_ENV === "dev" ?
                                               "https://kovan.etherscan.io/tx/" + result.tx_id :
                                               (orders.payment_currency === "BTC" ? "https://www.blockchain.com/btc/tx/" + result.tx_id : "https://etherscan.io/tx/" + result.tx_id)}>{result.tx_id} </a>
                                    </p>


                                </div>


                            </div>

                        )
                    )}
                </div>

                <h3 className="text-xl text-center font-semibold text-site-theme mt-8 ">
                    Items Summary
                </h3>

                <div className="rounded-xl  p-4 shadow-xl border-2 mt-6 w-full max-w-md mx-auto items-center ">



                    <table className="table-auto container rounded my-6">
                        <thead className="w-full text-center border-1 bg-site-theme text-white border-orange-400  ">
                        <tr>
                            <th>Items_Id</th>
                            <th>Unit_Quantity</th>

                        </tr>
                        </thead>

                        <tbody className="rounded w-full text-center border-1 border-outline-color">
                        {orders && orders.items.map((obj) =>
                            (
                                <tr className="bg-white  border-1 shadow hover:shadow-xl">
                                    <td className=" text-10px md:text-sm text-gray-900 border-1 border-outline-color">
                                        {obj && obj.item_id}</td>
                                    <td className="text-10px md:text-sm text-gray-900 border-1 border-outline-color">{obj && obj.unit_quantity} Unit</td>

                                </tr>

                            )
                        )}
                        </tbody>
                    </table>


                </div>



                <button onClick={handleModalCallback} className="mb-40 mt-12 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold"> Okay</button>


            </div>


        </Modal>

    )
}

