import React, {useEffect, useState} from "react";
import UserManager from "../../libs/UserManager";
import {isLoggedIn} from "../../libs/AuthManager";
import {useHistory} from "react-router-dom";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import {getReadableTime} from "../../utils/times";
import PurchasedOrderDetailsModal from "../../components/Modal/PurchaseOrderDetailsModal";

export default function ReferralRewardHistoryPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState({});
  const userInfo = UserManager.getLoggedInUser();
  const [rewardHistory, setRewardHistory] = useState(null);
  const [createAccount, setCreateAccount] = useState(null);
  const [cartItems, setCartItems] = useState({ order_tokens: [] });
  const [privateKey, setPrivateKey] = useState("");
  const isUserLoggedIn = isLoggedIn();
  const [activePage, setActivePage] = useState(1);
  const [pageChanged, setPageChanged] = useState(false); // better way?
  const [totalUser, setTotalUser] = useState(0);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
    const [referralPoint, setReferralPoint] = useState(null);


    useEffect(() => {
      getUserApi();
      getReferralPointOfUser()
  }, []);

  useEffect(() => {
      callRewardHistoryApi();
  }, [activePage]);

  if (!isUserLoggedIn) {
    history.push("/signin");
  }

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
    setPageChanged(!pageChanged);
  }

    const getReferralPointOfUser = async () => {

        if (userInfo && Cookies.get('access-token')) {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/referral-point`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No referral data found", 'error');
                else {
                    setReferralPoint(response);

                }
            }
            else Swal.fire('Whoops..', "No referral data found", 'error');
        }
    }


  const getUserApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      const myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const response = await data.json();

      if (response) {
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No user data found", "error");
        else {
          setUser(response.user);
          setAddresses({
            btc: response.btcAccount,
            eth: response.ethAccount,
          });
        }
      } else Swal.fire("Whoops..", "No user data found", "error");
    }
  };

  const callRewardHistoryApi = async () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));

    const data = await fetch(
      `${BASE_URL}/referral-point/reward-history?sortBy=createdAt&page=${activePage}&limit=10`,
      {
        method: "GET",
        headers: myHeaders,
      }
    );
    const response = await data.json();

    if (response) {
      setLoading(false);
      if (response.code === 401) history.push("/signin");
      else if (response.code === 404 || response.code === 403)
        Swal.fire("Whoops..", "No orders found", "error");
      else {
        console.log(response,'asdfd')
        setRewardHistory(response.results);
        setTotalUser(response.totalResults);
      }
    } else Swal.fire("Whoops..", "No user data found", "error");
  };

  function orderDetailsModalClose() {
    setOrderDetailsModal(!orderDetailsModal);
  }
  function handleOrderDetails(order) {
    setOrderDetails(order);
    setOrderDetailsModal(!orderDetailsModal);
  }


  return (
    <div>
      <main className="flex justify-center ">
        {loading && <CustomLoader />}
        <div className="lg:max-w-7xl w-full bg-white rounded-xl p-2 md:p-6">
          <div className="rounded-xl border-1  w-full rounded-xl px-2 md:px-16 py-2 md:py-6">

           <div className="md:flex md:justify-between  items-center">
               <p className="text-xl font-bold py-4 text-site-theme ">
              Referral Point Reward History
               </p>

              <div className="text-black font-medium  md:ml-8 border-1 px-4 py-2 ">Total Reward Points:   {referralPoint && referralPoint.totalPoint}</div>
           </div>

              <div className="bg-white  w-full my-2 border-1 block shadow ">
                  <div className="flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group">
                          <p
                              className="text-left text-10px md:text-sm text-gray-900 font-semibold
                              "
                          >
                             Date-Time
                          </p>


                              <p className="text-left text-10px md:text-sm text-gray-900 font-semibold">
                                  Nick Name

                              </p>




                      <p className="text-left text-10px md:text-sm text-gray-900 font-semibold">
                          Email
                      </p>


                          <div
                              className="text-left text-10px md:text-sm text-gray-900 font-semibold"
                          >
                              Referral Point
                          </div>

                  </div>
              </div>
            {rewardHistory &&
              rewardHistory.length &&
              rewardHistory.map((result) => (

                  <div className="bg-white  w-full my-2 border-1 block shadow ">
                      <div className="flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group">
                          <p
                              className="text-left text-10px md:text-sm text-gray-900
                              "
                          >
                              {result.time
                                  ? getReadableTime(result.time)
                                  : ""}
                          </p>


                          <p className="text-left text-10px md:text-sm text-gray-900 ">
                              {result.nickName ? result.nickName : ''}

                          </p>




                          <p className="text-left text-10px md:text-sm text-gray-900 ">
                              {result.email ? result.email : ''}
                          </p>


                          <div
                              className="text-left text-10px md:text-sm text-gray-900 "
                          >
                              {result.rewardedPoint ? result.rewardedPoint : ''}
                          </div>

                      </div>
                  </div>


              ))}
            {rewardHistory && rewardHistory.length && (
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
            )}
            {orderDetailsModal && (
              <PurchasedOrderDetailsModal
                orderDetails={orderDetails}
                hideButton={false}
                onClose={orderDetailsModalClose}
              />
            )}

            {!rewardHistory && (
              <p className="p-2 text-center">
                <CustomLoader />
              </p>
            )}

            {rewardHistory && rewardHistory.length === 0 && (
              <p className="p-2 text-center"> You do not have any order </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
