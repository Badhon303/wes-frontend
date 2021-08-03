import React, { useEffect, useState } from "react";
import UserManager from "../../../libs/UserManager";
import { useHistory } from "react-router-dom";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../constants";
import Swal from "sweetalert2";
import { getReadableTime } from "../../../utils/times";
import Pagination from "react-js-pagination";
import GpHistoryDetailsModal from "../../../components/Modal/GpHistoryDetailsModal";

const style = {
  default: `mr-8 outline-none focus:outline-none  rounded    font-semibold border-1 px-6 py-3 w-auto text-base`,
  normal: `text-gray-800  `,
  selected: `shadow-lg bg-site-theme opacity-90 text-white`,
};

export default function GPPurchaseHistoryPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [goldPoint, setGoldPoint] = useState(null);
  const userInfo = UserManager.getLoggedInUser();
  const [ownedGoldPointPrice, setOwnedGoldPointPrice] = useState(null);
  const [step, setStep] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [pageChanged, setPageChanged] = useState(false);
  const [totalUser, setTotalUser] = useState(0);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [gpDetails, setGpDetails] = useState(null);
  const [totalUserOfDetailsId, setTotalUserOfDetailsId] = useState(0);

  useEffect(() => {
    let point = getGoldPointApi();
    let data = getGpHistories();
  }, []);

  useEffect(() => {
    let data = getGpHistories();
  }, [activePage, step]);

  const getGoldPointApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 12000);

      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(`${BASE_URL}/gold-point`, {
        method: "GET",
        headers: myHeaders,
      });
      const response = await data.json();

      if (response) {
        setLoading(false);

        if (response.code === 401) history.push("/signin");
        else if (
          response.code === 404 ||
          response.code === 403 ||
          response.code === 500
        )
          Swal.fire("Whoops..", "No  data found", "error");
        else {
          setGoldPoint(response.goldPoints);
          let result = getGoldPointDollarPriceApi(response.goldPoints);
        }
      } else Swal.fire("Whoops..", "No data found", "error");
    }
  };

  const getGoldPointDollarPriceApi = async (goldPoints) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 12000);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));

    const data = await fetch(
      `${BASE_URL}/gold-point/dollar-price?goldPointAmount=${goldPoints}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    );
    const response = await data.json();

    if (response) {
      setLoading(false);
      if (response.code === 401) history.push("/signin");
      else if (
        response.code === 404 ||
        response.code === 403 ||
        response.code === 500
      )
        Swal.fire("Whoops..", "No data found", "error");
      else
        setOwnedGoldPointPrice(response && response.price ? response.price : 0);
    } else Swal.fire("Whoops..", "No  data found", "error");
  };

  const getGpHistories = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 12000);

      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(
        step === 1
          ? `${BASE_URL}/gold-point/exchange/histories/users?page=${activePage}&limit=10&sortBy=-createdAt`
          : //   : `${BASE_URL}/gold-point/trigger/history-single?page=${activePage}&limit=10&sortBy=-createdAt`,
            `${BASE_URL}/gold-point/trigger/own-history-single?page=${activePage}&limit=10&sortBy=-createdAt`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );
      const response = await data.json();
      //   console.log(response, "res");

      if (response && response.code === 404) {
        setLoading(false);
        Swal.fire("Whoops..", response.message, "error");
      } else if (response) {
        setLoading(false);
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No user data found", "error");
        else {

          if (step === 1){
              setOrders(response.allHistory.results)

              setTotalUser(response.allHistory.totalResults);
          }

           if(step===2) {
               setOrders(response.allTrigger.results)
               setTotalUser(response.allTrigger.totalResults);

           }

        }
      } else Swal.fire("Whoops..", "No  data found", "error");
    }
  };


  function handleOrderDetails(data) {

    setGpDetails(data);
    setOrderDetailsModal(!orderDetailsModal);
  }

  function orderDetailsModalClose() {
    setOrderDetailsModal(!orderDetailsModal);
    setGpDetails(null);
    setTotalUserOfDetailsId(0);
  }

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
    setPageChanged(!pageChanged);
  }

  return (
    <main className="flex justify-center ">
      {loading && <CustomLoader />}
      <div className=" w-full bg-white rounded-xl p-2 md:p-6">
        <div className="block bg-site-theme opacity-70 text-black font-semibold border-1 px-3 py-2 text-left w-96 text-base">
          Owned Gold Point: {""} {goldPoint}
        </div>

        <br />
        <div className="block bg-site-theme opacity-70 text-black font-semibold text-base border-1 px-3 py-2 text-left w-96 ">
          Dollar Price of Owned GP:
          {""} {ownedGoldPointPrice}
        </div>

        <div className="flex my-8 ">
          <button
            onClick={() => setStep(1)}
            className={`${style.default} ${
              step === 1 ? style.selected : style.normal
            }`}
          >
            Exchange For Coin
          </button>

          <button
            onClick={() => setStep(2)}
            className={`${style.default} ${
              step === 2 ? style.selected : style.normal
            }`}
          >
            Shared By Admin
          </button>
        </div>

        {step === 1 ? (
          <div>
            <table className="w-full whitespace-nowrap ">
              <thead>
                <tr className="bg-site-theme  text-white font-bold h-16 w-full leading-none border">
                  <th className=" text-left pl-4 break-all text-base">Id</th>
                  <th className=" l text-left pl-4 text-base">Gp</th>
                  <th className=" text-left pl-4 text-base">Coin</th>
                  <th className=" text-left pl-4 text-base">Coin Amount</th>
                  <th className=" text-left pl-4 text-base">Date - Time</th>

                  <th className=" text-left pl-4 text-base">Status</th>
                </tr>
              </thead>

              {orders && orders.length ? (
                orders.map((result) => (
                  <tbody className="w-full">
                    <tr className="group h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow ">
                      {result.status === true ? (
                        <td className=" pl-4">
                          <p
                            onClick={() => handleOrderDetails(result)}
                            className="cursor-pointer group-hover:underline group-hover:text-site-theme text-sm font-medium leading-none text-gray-800 break-all  "
                          >
                            {result._id}
                          </p>
                        </td>
                      ) : (
                        <td className=" pl-4">
                          <p className="cursor-pointer group-hover:underline group-hover:text-site-theme text-sm font-medium leading-none text-gray-800 break-all  ">
                            {result._id}
                          </p>
                        </td>
                      )}

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.goldPointAmount}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.coin}
                        </p>
                      </td>
                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.unit}
                          {""} {result.unit ? "Unit" : ""}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {getReadableTime(result.createdAt)}
                        </p>
                      </td>

                      <td className="pl-4">
                        {result && result.status === true && (
                          <div className="w-30  rounded bg-gray-600 p-1 text-center bg-green-600 px-4 text-white text-10px md:text-base">
                            Successful
                          </div>
                        )}
                        {result && result.status === false && (
                          <div className="w-30  rounded bg-gray-600 p-1 text-center bg-site-theme px-4 text-white text-10px md:text-base">
                            Failed
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <div />
              )}
            </table>
          </div>
        ) : (
          <div />
        )}

        {step === 2 ? (
          <div>
            <table className="w-full whitespace-nowrap ">
              <thead>
                <tr className="bg-site-theme  text-white font-bold h-16 w-full leading-none border">
                  <th className=" text-left pl-4 break-all text-base">Id</th>
                  <th className=" l text-left pl-4 text-base">Gp</th>
                  <th className=" text-left pl-4 text-base">Date-Time</th>
                </tr>
              </thead>

              {orders && orders.length ? (
                orders.map((result) => (
                  <tbody className="w-full">
                    <tr className="group h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow ">
                      <td className=" pl-4">
                        <p
                          onClick={() => handleOrderDetails(result)}
                          className="cursor-pointer group-hover:underline group-hover:text-site-theme text-sm font-medium leading-none text-gray-800 break-all  "
                        >
                          {result._id}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.totalGoldPoint}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.createdAt
                            ? getReadableTime(result.createdAt)
                            : ""}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <div />
              )}
            </table>
          </div>
        ) : (
          <div />
        )}

        {orders && orders.length  ? (
          <div className="flex justify-end p-2">
            <Pagination
              innerClass="pagination flex flex-row"
              activeLinkClass="text-black"
              linkClass="page-link"
              itemClass="p-2 text-site-theme"
              activePage={activePage}
              itemsCountPerPage={10}
              totalItemsCount={totalUser}
              pageRangeDisplayed={6}
              onChange={handlePageChange}
            />
          </div>
        ) : (
          <div />
        )}

        {orderDetailsModal === true && gpDetails && (
          <GpHistoryDetailsModal
            hideButton={false}
            step={step}
            details={gpDetails}
            onClose={orderDetailsModalClose}
          />
        )}
      </div>
    </main>
  );
}
