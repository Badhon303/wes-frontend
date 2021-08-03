import React, {useEffect, useState} from "react";
import UserManager from "../../libs/UserManager";
import {isLoggedIn} from "../../libs/AuthManager";
import {useHistory} from 'react-router-dom';
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import {getReadableTime} from "../../utils/times";
import OrderDetailsModal from "../../components/Modal/OrderDetailsModal";
import ReferralHistoryModal from "../../components/Modal/ReferralHistoryModal";

export default function AdminOrdersPage() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState({});
    const userInfo = UserManager.getLoggedInUser();
    const [orders, setOrders] = useState(null);
    const isUserLoggedIn = isLoggedIn();
    const [activePage, setActivePage] = useState(1);
    const [pageChanged, setPageChanged] = useState(false); // better way?
    const [totalUser, setTotalUser] = useState(0);
    const [orderDetailsModal , setOrderDetailsModal ] = useState(false)
    const [orderDetails, setOrderDetails] = useState([]);

    const [referralHistoryModal , setReferralHistoryModal ] = useState(false)
    const [referralHistory, setReferralHistory] = useState([]);

    useEffect(() => {
        getUserApi()

    }, [])

    useEffect(() => {

        callOrderApi()
    }, [activePage])


    if (!isUserLoggedIn) {
        history.push('/signin');
    }

    function handlePageChange(pageNumber) {
        setActivePage(pageNumber);
        setPageChanged(!pageChanged);
    }

    const getUserApi = async () => {

        if (userInfo && Cookies.get('access-token')) {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No user data found", 'error');
                else {
                    setUser(response.user);
                    setAddresses({
                        btc: response.btcAccount,
                        eth: response.ethAccount,
                    })
                }
            }
            else Swal.fire('Whoops..', "No user data found", 'error');
        }
    }

    const callOrderApi = async () => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

        const data = await fetch(`${BASE_URL}/purchase/purchaseHistory?sortBy=createdAt:desc&page=${activePage}&limit=5`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            setLoading(false)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 403) Swal.fire('Whoops..', "No orders found", 'error');
            else {
                setOrders(response)
                setTotalUser(20);

            }
        }
        else Swal.fire('Whoops..', "No user data found", 'error');

    }

    const callSingleOrderApi = async (orderId) => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

        const data = await fetch(`${BASE_URL}/purchase/orders/${orderId}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            setLoading(false)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 403) Swal.fire('Whoops..', "No orders found", 'error');
            else {

                setOrderDetails(response[0])
                setOrderDetailsModal(!orderDetailsModal)

            }
        }
        else Swal.fire('Whoops..', "No user data found", 'error');

    }

    const callRewardHistoryApi = async (orderId) => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

        const data = await fetch(`${BASE_URL}/referral-point/reward-history?orderId=${orderId}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            setLoading(false)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 403) Swal.fire('Whoops..', "No orders found", 'error');
            else {
                console.log(response,'res')

                setReferralHistory(response)
                setReferralHistoryModal(!referralHistoryModal)

            }
        }
        else Swal.fire('Whoops..', "No user data found", 'error');

    }


    function orderDetailsModalClose() {
        setOrderDetailsModal(!orderDetailsModal)
        setOrderDetails([])
    }
    function referralHistoryModalClose() {
        setReferralHistoryModal(!referralHistoryModal)
        setReferralHistory([])
    }

    function handleOrderDetails(orderId) {
        callSingleOrderApi(orderId)
    }


    function handleIntroducersModal(orderId) {
        callRewardHistoryApi(orderId)
    }
    return (
        <div>

            <main className="flex justify-center ">
                {loading && <CustomLoader/>}
                <div className="lg:max-w-7xl w-full bg-white rounded-xl p-2 md:p-6">
                    <div className="rounded-xl border-1  w-full rounded-xl px-2 md:px-16 py-2 md:py-6">
                        <p className="text-xl font-bold py-4 text-site-theme">Orders</p>

                        <div className="bg-white  w-full my-2 border-1 block shadow ">
                            <div className="flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group">
                                <p
                                    className="text-left text-10px md:text-sm text-gray-900 font-semibold
                              "
                                >
                                  Order Id
                                </p>


                                <p className="text-left text-10px md:text-sm text-gray-900 font-semibold">
                                    Full Name

                                </p>




                                <p className="text-left text-10px md:text-sm text-gray-900 font-semibold">
                                    Email
                                </p>

                                <p className="text-left text-10px md:text-sm text-gray-900 font-semibold">
                                    Status
                                </p>


                                <div
                                    className="text-left text-10px md:text-sm text-gray-900 font-semibold"
                                >
                                   Introducers
                                </div>

                            </div>
                        </div>

                        {orders && orders.length && orders.map((result) =>
                            (<div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl">

                                    <div
                                        className="flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group">
                                        <div>
                                            <p className="text-left group-hover:underline cursor-pointer group-hover:text-site-theme md:font-medium"
                                               onClick={()=> handleOrderDetails(result.orderId)}>
                                                {result.orderId}</p>
                                            <p className="text-gray-400 md:text-sm  text-10px break-all">{result.ordered_at && getReadableTime(result.ordered_at)}</p>
                                        </div>

                                        <div>
                                            <p className="text-left text-10px md:text-sm text-gray-900 break-all">{result.fullName}</p>

                                        </div>
                                                <div>
                                                    <p className="text-left text-10px md:text-sm text-gray-900 underline break-all ">{result.email}</p>

                                                </div>



                                        {result && result.status === "TOKEN_SEND" &&

                                        <div
                                            className="rounded bg-gray-600 p-1 text-center bg-green-600 px-4 text-white text-10px md:text-base">Successful</div>
                                        }
                                        {result && result.status === "CONFIRMED_PAYMENT_RECEIVED" &&

                                        <div
                                            className="rounded bg-gray-600 p-1 text-center bg-site-theme px-4 text-white text-10px md:text-base">Pending</div>
                                        }
                                        {result && result.status === "CONFIRMED_PAYMENT_RECEIVED" &&

                                        <div
                                            className="rounded bg-gray-600 p-1 text-center bg-site-theme px-4 text-white text-10px md:text-base">Pending</div>
                                        }


                                        <button onClick={()=>handleIntroducersModal(result.orderId)}
                                            className="hover:shadow-lg focus:outline-none outline-none   rounded bg-site-theme text-white p-1 text-center  px-4 text-10px md:text-base">
                                           Introducers
                                        </button>



                                    </div>


                                </div>

                            )
                        )}
                        {orders && orders.length && <div className="flex justify-end p-2">
                            <Pagination
                                innerClass="pagination flex flex-row"
                                activeLinkClass="text-black"
                                linkClass="page-link"
                                itemClass="p-2 text-site-theme"
                                activePage={activePage}
                                itemsCountPerPage={5}
                                totalItemsCount={totalUser}
                                pageRangeDisplayed={6}
                                onChange={handlePageChange}
                            />
                        </div>}
                        {orderDetailsModal && (
                            <OrderDetailsModal
                                orderDetails={orderDetails}
                                hideButton={false}
                                onClose={orderDetailsModalClose}

                            />
                        )}



                        {referralHistoryModal && (
                            <ReferralHistoryModal
                                orderDetails={referralHistory}
                                hideButton={false}
                                onClose={referralHistoryModalClose}

                            />
                        )}


                        {!orders && <p className="p-2 text-center"><CustomLoader/></p>}

                        {orders && orders.length === 0 &&
                        <p className="p-2 text-center"> You do not have any order </p>}


                    </div>
                </div>
            </main>


        </div>
    )
}
