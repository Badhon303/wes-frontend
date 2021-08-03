import React, {useEffect, useState} from "react";
import UserManager from "../../libs/UserManager";
import {useHistory} from 'react-router-dom';
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";
import {useFormik} from "formik";
import Warning from "../../components/Message/warning";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import Modal from "react-modal";
import * as PurchaseAPI from "../../apis/purchase";



const STEP_PRICE_LIST = 'step-price-list';
const STEP_CART_CHECKOUT = 'step-cart-checkout';


export default function ReferralPurchaseUserPage() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState({});
    const userInfo = UserManager.getLoggedInUser();
    const [referralPoint, setReferralPoint] = useState(null);
    const [createAccount, setCreateAccount] = useState(null);
    const [referralStatus, setReferralStatus] = useState(null);
    const [purchaseData, setPurchaseData] = useState(null)
    const [step, setStep] = useState(STEP_PRICE_LIST);

    useEffect(() => {
        getUserApi()
        getReferralPointOfUser()
        getUserReferralStatus()


    }, [])

    const validate = values => {
        const errors = {};
        const {refPoint, currency} = values;

        if (!refPoint) {
            errors.refPoint = 'Select at least 100 referral point';
        } else if (refPoint % 100 !== 0) {
            errors.refPoint = 'Amount should be multiplication of 100 like, 200,300...';
        }else if (referralPoint && refPoint > referralPoint.totalPoint) {
            errors.refPoint = 'Amount must not be greater then your total referral point';
        }

        if (!currency) {
            errors.currency = 'Select payment currency';
        }


        return errors;
    };


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

    const getUserReferralStatus = async () => {

        if (userInfo && Cookies.get('access-token')) {
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/referral-point/exchange/check-status`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                setLoading(false)
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No referral data found", 'error');
                else {

                    setReferralStatus(response);

                }
            }
            else Swal.fire('Whoops..', "No referral data found", 'error');
        }
    }

    const getDollarPriceApi = async () => {

        if (userInfo && Cookies.get('access-token')) {

            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/referral-point/dollar-price?amount=${formik.values.refPoint}`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No price info found", 'error');
                else {
                    return response.price;

                }
            }
            else Swal.fire('Whoops..', "No price info found", 'error');
        }
    }

    const getAmountOfCurrencyApi = async (dollarPrice, token) => {

        if (userInfo && Cookies.get('access-token')) {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/tokens/amount?token=${token}&dollar=${dollarPrice}`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No price info found", 'error');
                else {

                    return response;

                }
            }
            else Swal.fire('Whoops..', "No price info found", 'error');
        }
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

    function calcReferralAmount() {
        let total = referralPoint.totalPoint - formik.values.refPoint;
        return total;
    }

    const formik = useFormik({
        initialValues: {
            refPoint: 100,
            currency: '',
        },
        validate,
        onSubmit: values => {

            let data = {};

            if (values) {
                setLoading(true)
                let priceCallApi = getDollarPriceApi().then((getDollarPrice) => {

                    getAmountOfCurrencyApi(getDollarPrice, values.currency).then((amountOfCurrency) => {
                        setLoading(false)
                        data = {
                            refPoint: values.refPoint,
                            currency: values.currency,
                            dollarPrice: getDollarPrice,
                            toAddress: values.currency === "BTC" ? addresses.btc.address : addresses.eth.address,
                            amountOfCurrency: amountOfCurrency

                        }
                        setPurchaseData(data)
                        setStep(STEP_CART_CHECKOUT);

                    })
                })
            }
        }

    });

    function handleModalClose() {
        setStep(STEP_PRICE_LIST);

    }

    function handleSubmitCart() {

        setLoading(true)

        PurchaseAPI.submitReferralOrder(purchaseData).then(res => {

            setLoading(false)
            if (res.ok) {
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Order submitted successfully',
                }).then((res) => {
                    setStep(STEP_PRICE_LIST)
                    history.push('/referral-purchase-history')
                })
            } else {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: res.data.message,
                })
            }
        }).catch(err => {
            setLoading(false)
            Swal.fire('Error', err.message, 'error');
        });


    }

    return (
        <div>
            {loading && <p className="p-2 text-center"><CustomLoader/></p>}

            <main className="md:flex md:justify-center ">
                {loading === false && <div className="lg:max-w-7xl w-full bg-white rounded-xl p-2 md:p-6 container">
                    <div className=" rounded-xl border-1  w-full rounded-xl px-2 md:px-16 py-2 md:py-12">
                        <p className="text-base text-left font-bold py-4 text-gray-700">Available Referral
                            Point: {referralPoint && referralPoint.totalPoint && referralPoint.totalPoint} </p>


                        {referralPoint &&
                        referralStatus &&
                        referralStatus.isEligible ===true ?
                            <div className="md:my-6 my-4">
                                <p className="text-base text-left font-bold py-4 text-gray-700">Exchange Referral Points
                                </p>

                                <form onSubmit={formik.handleSubmit}>
                                    <div className="md:ml-6 mt-4 text-gray-700 font-semibold">
                                        <div className="flex  items-center mt-2">
                                            <p className="md:w-64"> Token</p>
                                            <div className="w-64 md:ml-12 ml-4 ">
                                                <DropDownMenuWithIcon
                                                    defaultValue={"Select Coin"}
                                                    className={"rounded text-black"}
                                                    options={[
                                                        {
                                                            label: "WOLF",
                                                            value: "WOLF"
                                                        },
                                                        {
                                                            label: "ETHEREUM",
                                                            value: "ETH",
                                                        },
                                                        {
                                                            label: "BITCOIN",
                                                            value: "BTC",
                                                        }]
                                                    }

                                                    selectCallback={e => formik.setFieldValue('currency', e.value)}
                                                    placeholder={"Select Coin"}

                                                />
                                            </div>


                                        </div>
                                        {formik.touched.currency && formik.errors.currency &&
                                        <Warning message={formik.errors.currency}/>}
                                        <br/>
                                        <div className="flex  items-center mt-4">
                                            <p className="md:w-64"> Referral Point Amount</p>
                                            <div className="w-1/2 md:ml-12 ml-4 ">
                                                <input
                                                    className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                                                    type="number"
                                                    min="100"
                                                    id="refPoint"
                                                    name="refPoint"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.refPoint}
                                                />

                                            </div>


                                        </div>
                                        {formik.touched.refPoint && formik.errors.refPoint &&
                                        <Warning message={formik.errors.refPoint}/>}

                                        <button
                                            type="submit"
                                            className="focus:outline-none rounded my-6 flex items-center mx-auto hover:font-bold px-6 py-3  w-auto px-12  text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold">
                                            Purchase
                                        </button>


                                    </div>
                                </form>


                            </div> :
                            <p className="text-md font-bold my-4">Sorry Your are not eligible for referral point
                                transfer </p>
                        }

                        {referralStatus && referralStatus.isEligible===false &&
                        <div>
                            <table className="w-full border border-outline-color container">
                                <thead className="border border-outline-color bg-site-theme text-white">
                                <tr>
                                    <th className="border-r-1 border-outline-color">Title</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody className="border border-outline-color">

                                <tr className="border-t  border-outline-color">
                                    <td className="px-2 border-r border-outline-color">Purchased (at least once)</td>
                                    <td className="px-2 text-center">{referralStatus.hasPurchased === true ?
                                        <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faTimes}/>}</td>
                                </tr>
                                <tr className="border-t  border-outline-color">
                                    <td className="px-2 border-r border border-outline-color">Has Adequate Referral
                                        Point
                                    </td>
                                    <td className="px-2 text-center">{referralStatus.hasEnoughPoints === true ?
                                        <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faTimes}/>}</td>
                                </tr>
                                <tr className="border-t border-outline-color">
                                    <td className="px-2 border-r border-outline-color "> Is an Approved User</td>
                                    <td className="px-2 text-center">
                                        {referralStatus.isApproved === true ? <FontAwesomeIcon icon={faCheck}/> :
                                            <FontAwesomeIcon icon={faTimes}/>}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        }


                    </div>
                </div>}

                {step === STEP_CART_CHECKOUT &&

                <Modal
                    isOpen={true}
                    contentLabel="onRequestClose Example"
                    onRequestClose={handleModalClose}
                    shouldCloseOnOverlayClick={false}
                >
                    <div>
                        <div className="w-full md:max-w-7xl mx-auto bg-white md:rounded-xl p-0 md:p-4">
                            <div className=" md:border-1  bg-white md:rounded-xl p-0 md:p-6">
                                <p className="text-xl font-bold py-4">Confirm Purchase </p>


                                <div className="">

                                    <table className="w-full border border-black">
                                        <thead className="border border-black">
                                        <tr>
                                            <th className="border-r border-black">Info</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody className="border border-black">
                                        <tr className="border-t border-black">
                                            <td className="px-2 border-r border-black">Available Referral Points</td>
                                            <td className="px-2 text-center">{referralPoint.totalPoint}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 border-r border-black">Referral Points Used</td>
                                            <td className="px-2 text-center">{formik.values.refPoint}
                                                <span>(USD{purchaseData.dollarPrice})</span></td>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <td className="px-2 border-r border-black">Referral Points Available after
                                                Purchase
                                            </td>
                                            <td className="px-2 text-center">{calcReferralAmount()}</td>
                                        </tr>

                                        <tr className="border-b border-black py-2">
                                            <td className="px-2 border-r border-black">Selected
                                                {formik.values.currency === "WOLF" ? "Token" : "Coin"}
                                            </td>
                                            <td className="px-2 text-center">{formik.values.currency}</td>
                                        </tr>

                                        <tr className="border-t border-black">
                                            <td className="px-2 py-2 border-r border-black text-black font-bold">Purchase
                                                Amount

                                            </td>
                                            <td className="px-2 text-center font-bold">{purchaseData.amountOfCurrency} {formik.values.currency}</td>
                                        </tr>


                                        </tbody>
                                    </table>


                                    <button onClick={() => setStep(STEP_PRICE_LIST)}
                                            className="my-3 hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-gray-400 font-semibold">
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleSubmitCart}
                                        className="focus:outline-none hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                }


            </main>


        </div>
    )
}
