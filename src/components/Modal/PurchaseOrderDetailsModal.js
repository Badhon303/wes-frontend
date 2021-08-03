import React from "react";
import {func} from "prop-types";
import Modal from "react-modal";
import {getReadableTime} from "../../utils/times";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function PurchasedOrderDetailsModal(props) {
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
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-2xl font-semibold text-site-theme ">
            Purchase Information
          </h3>
          <div
            className="px-6 py-2 ml-auto cursor-pointer "
            onClick={handleModalCallback}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border shadow  border-gray-200 ">
            <div className="py-4 px-6  group ">
              <div className="grid grid-cols-12 gap-4 ">
                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700 ">
                  PURCHASE ID :{" "}
                </p>
                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all ">
                  {" "}
                  {orders._id}
                </p>
              </div>

              <div className="grid grid-cols-12 gap-4 ">
                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">
                  REFERRAL POINTS USED :
                </p>
                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all">
                  {" "}
                  {orders.refPointUsed}
                </p>
              </div>

              <div className="grid grid-cols-12 gap-4 ">
                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">
                  REFERRAL POINTS EQUIVALENT USD :{" "}
                </p>
                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all">
                  {" "}
                  {orders.dollarPrice}
                </p>
              </div>

              <div className="grid grid-cols-12 gap-4 ">
                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">
                  TOKEN RECEIVED ADDRESS :{" "}
                </p>
                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all">
                  {" "}
                  {orders.toAddress}
                </p>
              </div>

              <div className="grid grid-cols-12 gap-4 ">
                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">
                  STATUS from address :{" "}
                </p>
                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all">
                  {" "}
                  {orders.status === true ? "Succeed" : "Failed"}
                </p>
              </div>

              <div className="grid grid-cols-12 gap-4 ">
                <p className="col-span-5 break-words uppercase md:text-base text-sm text-gray-700">
                  Ordered at :{" "}
                </p>
                <p className="col-span-7 text-gray-600 md:text-base text-sm break-all">
                  {" "}
                  {orders.createdAt ? getReadableTime(orders.createdAt) : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {props.admin && props.admin === true && orders.user && (
          <div className="my-6">
            <p className="text-xl font-bold py-4 text-site-theme">
              User Information
            </p>

            <div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl group overflow-x-auto">
              <div className="grid grid-cols-12  items-center px-4 py-4 font-bold text-10px md:text-sm group">
                <p className="col-span-3  break-all px-2">EMAIL</p>

                <p className="col-span-3 px-2  text-gray-900 break-all">ID </p>

                <p
                  className=" col-span-2 px-2 cursor-pointer
                                 break-all"
                >
                  NICK NAME
                </p>

                <p
                  className=" col-span-4 px-2 cursor-pointer
                                 break-all"
                >
                  FULL NAME
                </p>
              </div>
            </div>

            <div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl group overflow-x-auto">
              <div className="grid grid-cols-12 items-center px-4 py-4  text-10px md:text-sm group">
                <p className="col-span-3 break-all px-2">{orders.user.email}</p>

                <p className="col-span-3 px-2  text-gray-900 break-all">
                  {orders.user.id}
                </p>

                <p className=" col-span-2 px-2 cursor-pointer text-gray-700  break-all">
                  {orders.user && orders.user.nickName}
                </p>

                <p className=" col-span-3 px-2 cursor-pointer text-gray-700  break-all">
                  {orders.user && orders.user.lastName}{" "}
                  {orders.user && orders.user.firstName}
                  {orders.user && orders.user.middleName}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="my-6">
          <p className="text-xl font-bold py-4 text-site-theme">Tokens</p>

          <div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl group overflow-x-auto">
            <div className="grid grid-cols-12  items-center px-4 py-4 font-bold text-10px md:text-sm group">
              <p className="col-span-2  break-all px-2">Tokens</p>

              <p className="col-span-2 px-2  text-gray-900 break-all">
                Quantity{" "}
              </p>

              <p
                className=" col-span-8 px-2 cursor-pointer  group-hover:underline
                                group-hover:text-site-theme break-all"
              >
                Transaction Id
              </p>
            </div>
          </div>

          <div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl group overflow-x-auto">
            <div className="grid grid-cols-12 items-center px-4 py-4  text-10px md:text-sm group">
              <p className="col-span-2 break-all px-2">{orders.currency}</p>

              <p className="col-span-2 px-2  text-gray-900 break-all">
                {orders.purchasedCurrencyAmount}{" "}
              </p>

              <p className=" col-span-8 px-2 cursor-pointer text-gray-700 group-hover:underline group-hover:text-site-theme break-all">
                <a
                  target="_blank"
                  href={
                    process.env.REACT_APP_ENV === "dev"
                      ? "https://kovan.etherscan.io/tx/" + orders.txId
                      : orders.payment_currency === "BTC"
                      ? "https://www.blockchain.com/btc/tx/" + orders.txId
                      : "https://etherscan.io/tx/" + orders.txId
                  }
                >
                  {orders.txId}
                </a>
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl text-center font-semibold text-site-theme mt-8 ">
          Items Summary
        </h3>

        <div className="rounded-xl  p-4 shadow-xl border-2 mt-6 w-full max-w-md mx-auto items-center ">
          <table className="table-auto container rounded my-6">
            <thead className="w-full text-center border-1 bg-site-theme text-white border-orange-400  ">
              <tr>
                <th>Items_Id</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody className="rounded w-full text-center border-1 border-outline-color">
              <tr className="bg-white  border-1 shadow hover:shadow-xl">
                <td className=" text-10px md:text-sm text-gray-900 border-1 border-outline-color">
                  {orders && orders.currency}
                </td>
                <td className="text-10px md:text-sm text-gray-900 border-1 border-outline-color">
                  {orders && orders.purchasedCurrencyAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={handleModalCallback}
          className="mb-40 mt-12 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold"
        >
          {" "}
          Okay
        </button>
      </div>
    </Modal>
  );
}
