import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout/Layout";
import {useFormik} from "formik";
import Swal from "sweetalert2";
import isValidEmail from "../../libs/validator/email";
import {useHistory} from "react-router-dom";
import idVerify from "../../image/idverify.png";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import UserManager from "../../libs/UserManager";
import {getTokenPriceList} from '../../apis/token';
import Loader from 'react-loader-spinner';

const validate = values => {
    const errors = {};
    const { email, cash} = values;

    if (!cash) {
        errors.cash = 'Required';
    } else if (!(cash.length >= 20 && cash.length < 200)) {
        errors.cash = 'Must be greater then 20 characters and less then 200 ';
    }

    if (!email) {
        errors.email = 'Required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};

const STEP_PRICE_LIST = 'step-price-list';

export default function BuyPage() {
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(STEP_PRICE_LIST);
    const [user,setUser] = useState(null);
    const userInfo = UserManager.getLoggedInUser();
    const [tokenPrices, setTokenPrices] = useState([]);

    useEffect(() => {
        setLoading(true);
        getTokenPriceList().then(res => {
            if (res.ok) {
                setTokenPrices(res.data);
            } else {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Counld not update token price list. Check later or contact with authority.',
                })
            }
        }).finally(() => { setLoading(false); })
    }, [step])

    const getUserApi = async () => {

        const myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

        const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            if (response.code === 404) Swal.fire('Whoops..', "No user data found", 'error');
            else setUser(response.user);
        }
        else Swal.fire('Whoops..', "No user data found", 'error');
    }
    useEffect(() => {
        getUserApi()
    }, [])

    const formik = useFormik({
        initialValues: {
            email: '',
            cash: ''
        },
        validate,
        onSubmit: values => {

            if(user && user.approvalStatus===false) {

               Swal.fire({
                    title: 'Identity Verification',
                    text: 'Please complete basic information to continue',
                    imageUrl: idVerify,
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: 'Identity verification image',
                    confirmButtonColor: '#ff8c00',
                    confirmButtonText: 'Verify Now',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        history.push('/profile/verify')


                    } else if (result.isDenied) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
            }
            else  Swal.fire('Buy Features are coming soon', '', 'Info')


            // Swal.fire({
            //     title:"Complete your profile first",
            //     text:"Complete your profile",
            //     confirmButtonColor: '#ff8c00',
            //     confirmButtonText: 'Okay',
            // });

            // AuthAPI.signin(values)
            //     .then(response => {
            //         if (response.ok) {
            //             const tokens = response.data.tokens;
            //             Cookie.set('access-token', tokens.access.token, { expires: new Date(tokens.access.expires) });
            //             Cookie.set('refresh-token', tokens.refresh.token, { expires: new Date(tokens.refresh.expires) });
            //             history.push(REDIRECT_AFTER_SIGNIN);
            //         } else {
            //             Swal.fire(response.err.statusText, response.data.message, 'error');
            //         }
            //     })
            //     .catch(err => {
            //         Swal.fire('Error', err.message, 'error');
            //     });
        }
    });

    return(
        <Layout>
            {loading && <Loader />}
            {step === STEP_PRICE_LIST &&
                <div>
                    {tokenPrices.map(tokenPrice => (<div>
                        <img src={tokenPrice.icon}></img>
                        <h3>{tokenPrice.title}</h3>
                    </div>))}
                </div>}
            {/*<form onSubmit={formik.handleSubmit}>*/}
                {/*<div*/}
                    {/*className="border-1 border-black  hover:bg-white md:shadow rounded w-full md:w-70 md:border-t-1  mt-12 items-center justify-center md:mx-auto ">*/}
                    {/*<div*/}
                        {/*className="py-6 md:px-12 md:px-0 lg:px-0 xl:px-0 w-full  items-center justify-center md:mx-auto  ">*/}
                        {/*<div className="mx-auto p-4  mt-12 mb-2 ">*/}
                            {/*<h2 className="pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center ">Buy/Sell*/}
                                {/*</h2>*/}

                            {/*<div className="w-100 m-3">*/}

                                {/*<div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">*/}
                  {/*<span className="absolute inset-y-0 left-0 flex items-center pl-2">*/}
                    {/*<div  className="p-1 focus:outline-none focus:shadow-outline">*/}
                      {/*<img src={emailIcon} className="w-6  h-6 " />*/}
                    {/*</div>*/}
                  {/*</span>*/}
                                    {/*<input type="email"*/}
                                           {/*onChange={formik.handleChange}*/}
                                        {/*//    onBlur={formik.handleBlur}*/}
                                           {/*value={formik.values.email}*/}
                                           {/*className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"*/}
                                           {/*name="email"*/}
                                           {/*id="email"*/}
                                           {/*aria-describedby="sign-in-email"*/}
                                           {/*placeholder="Enter your email"*/}
                                           {/*autoComplete="off" />*/}
                                {/*</div>*/}

                                {/*{formik.touched.email && formik.errors.email && (*/}
                                    {/*<div className="bg-red-100 my-2 py-2 text-red-700">{formik.errors.email}</div>)}*/}
                            {/*</div>*/}
                            {/*<div className="m-3 pt-4">*/}

                                {/*<div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">*/}
                  {/*<span className="absolute inset-y-0 left-0 flex items-center pl-2">*/}
                    {/*<div  className="p-1 focus:outline-none focus:shadow-outline">*/}
                      {/*<img src={passwordIcon} className="w-6  h-6 " />*/}
                    {/*</div>*/}
                  {/*</span>*/}

                                    {/*<input type="text"*/}
                                           {/*onChange={formik.handleChange}*/}
                                        {/*//    onBlur={formik.handleBlur}*/}
                                           {/*value={formik.values.money}*/}
                                           {/*className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"*/}
                                           {/*name="cash"*/}
                                           {/*id="cash"*/}
                                           {/*aria-describedby="sign-in-email"*/}
                                           {/*placeholder="Enter cash address"*/}
                                           {/*autoComplete="off" />*/}
                                {/*</div>*/}

                                {/*{formik.touched.money && formik.errors.money && (*/}
                                    {/*<div className="my-2 bg-red-100 py-2 text-red-700">{formik.errors.money}</div>)}*/}
                            {/*</div>*/}


                        {/*</div>*/}

                        {/*<div className="text-center items-center justify-center mt-6">*/}
                            {/*<button*/}
                                {/*type="submit"*/}
                                {/*className="w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md">*/}
                                {/*Buy*/}
                            {/*</button>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                {/*</div>*/}
            {/*</form>*/}
        </Layout>
    )
}
