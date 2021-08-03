import React, { useEffect, useState } from "react";
import { func } from "prop-types";
import Modal from "react-modal";
import UserManager from "../../libs/UserManager";
import CustomLoader from "../CustomLoader/CustomLoader";
import { customStylesModal } from "../../utils/styleFunctions";
import Cookies from "js-cookie";
import { BASE_URL } from "../../constants";
import Swal from "sweetalert2";

export default function GpHistoryDetailsModal(props) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const userInfo = UserManager.getLoggedInUser();
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(props.step);

    if (props.step === 2 && props.details._id) {
      let abc = callDetailsApi();
    }
  }, [props.step]);

  useEffect(() => {
    setDetails(props.details);
  }, [props.details]);

  function handleModalCallback() {
    props.onClose && props.onClose();
  }
  const callDetailsApi = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 12000);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
    console.log("ei holo", props.details);
    const data = await fetch(
      `${BASE_URL}/gold-point/trigger/fetch-trigger-single/${props.details._id}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    );
    const response = await data.json();
    console.log("ei holo response", response);

    if (response) {
      setLoading(false);
      if (response.code === 401) history.push("/signin");
      else if (
        response.code === 404 ||
        response.code === 403 ||
        response.code === 500
      )
        Swal.fire("Whoops..", "No data found", "error");
      else console.log(response, "asdf");
      setDetails(response && response ? response.trigger[0] : "");
    } else Swal.fire("Whoops..", "No  data found", "error");
  };

  return (
    <Modal
      isOpen={true}
      contentLabel="onRequestClose Example"
      onRequestClose={handleModalCallback}
      shouldCloseOnOverlayClick={false}
      style={customStylesModal}
    >
      <div className="">
        {loading && <CustomLoader />}

        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-2xl font-semibold text-site-theme ">
            Exchange Details
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

        <div className="my-6 w-full rounded border-2 border-yellow-400">
          {details && step === 1 && (
            <div className="group bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-auto ">
              <p className="text-left font-bold my-2">
                Gold Point Amount Before Exchange: {""}
                {details && details.gpBeforeTx}{" "}
              </p>
              <p className="text-left font-bold my-2">
                {" "}
                Gold Point Spent:{""} {details && details.goldPointAmount}
              </p>
              <p className="text-left font-bold my-2">
                Gold Point Equivalent Dollar Price:{""}{" "}
                {details && details.price}
              </p>
              <p className="text-left font-bold my-2">
                Gold Point Amount After exchange{""}{" "}
                {details && details.gpAfterTx}{" "}
              </p>
              <p className="text-left font-bold my-2 ">
                TxID : {""}
                <span className="underline text-gray-600 md:text-base text-sm break-all group-hover:underline  cursor-pointer group-hover:text-site-theme">
                  <a
                    target="_blank"
                    href={
                      process.env.REACT_APP_ENV === "dev"
                        ? "https://kovan.etherscan.io/tx/" + details.txId
                        : details.coin === "BTC"
                        ? "https://www.blockchain.com/btc/tx/" + details.txId
                        : "https://etherscan.io/tx/" + details.txId
                    }
                  >
                    {details.txId}{" "}
                  </a>
                </span>
              </p>
              <p className="text-left font-bold my-2">
                Coin : {""} {details && details.coin}
              </p>
              <p className="text-left font-bold my-2">
                Coin Amount : {""} {details && details.coinAmount}
              </p>
              <p className="text-left font-bold my-2">
                {" "}
                Bonus Coin Amount : {""} {details && details.bonusAmount}
              </p>
              <p className="text-left font-bold my-2">
                {" "}
                Total Coin Amount: {""} {details && details.totalCoinAmount}
              </p>
              <p className="text-left font-bold my-2 w-40 flex">
                {" "}
                Status:
                <div className="ml-4 w-32 rounded bg-gray-600 p-1 text-center bg-green-600 px-4 text-white text-10px md:text-base">
                  Successful
                </div>
              </p>
            </div>
          )}

          {details && props.step === 2 && (
            <div className="group bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-auto ">
              <p className="text-left font-bold my-2">
                Gold Point Amount Before Trigger: {""}
                {details && details.goldPointBeforeTrigger}{" "}
              </p>
              <p className="text-left font-bold my-2">
                {" "}
                Gold Point Received/Deducted:{""}{" "}
                {details && details.receivedGoldPointAmount}
              </p>
              <p className="text-left font-bold my-2">
                Gold Point Equivalent Dollar Price:{""}{" "}
                {details && details.gpEquivalentDollarPrice}
              </p>
              <p className="text-left font-bold my-2">
                Gold Point Amount After exchange{""}{" "}
                {details && details.goldPointAfterTrigger}{" "}
              </p>
              <p className="text-left font-bold my-2 ">
                TriggerId : {""}
                <span className=" text-gray-600 md:text-base text-sm break-all  cursor-pointer">
                  {details.trigger}
                </span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleModalCallback}
          className="mb-40 mt-12 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold"
        >
          {" "}
          Close{" "}
        </button>
      </div>
    </Modal>
  );
}
