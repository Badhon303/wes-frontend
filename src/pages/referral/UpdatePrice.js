import Layout from "../../components/Layout/Layout";
import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {isLoggedIn} from "../../libs/AuthManager";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Warning from "../../components/Message/warning";
import UserManager from "../../libs/UserManager";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import {useFormik} from "formik";
import * as PurchaseAPI from "../../apis/purchase";

const validate = values => {
    const errors = {};
    const {price} = values;

    if (!price) {
        errors.price = 'Price should not be 0';
    } else if (price === 0) {
        errors.price = 'Price should be larger than 0';
    }



    return errors;
};



export default function UpdatePrice() {
    const history = useHistory();
    const isUserLoggedIn = isLoggedIn();
    const [loading, setLoading] = useState(false);
    const userInfo = UserManager.getLoggedInUser();
    const [dollarPrice,setDollarPrice] = useState(null);

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    useEffect(() => {
        getDollarPriceApi ()

    }, [])


    const getDollarPriceApi = async () => {

        if (userInfo && Cookies.get('access-token')) {

            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/referral-point/dollar-price?amount=1`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No price info found", 'error');
                else {
                    setDollarPrice(response.price);

                }
            }
            else Swal.fire('Whoops..', "No price info found", 'error');
        }
    }


    const formik = useFormik({
        initialValues: {
            price: dollarPrice,

        },
        validate,
        onSubmit: values => {

            if (values) {

                Swal.fire({
                    title: 'Do you really want to update Referral Point Price?',
                    showCancelButton: true,
                    confirmButtonText: `Yes`,
                }).then((result) => {
                    if (result.isConfirmed) {

                        setLoading(true)

                        PurchaseAPI.submitDollarPriceUpdate(values).then(res => {

                            setLoading(false)
                            if (res.ok) {
                                Swal.fire('Updated!', 'Congratulations, price has been updated', 'success')
                                window.location.reload(true)
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
                })

            }
        }

    });



    return (
        <Layout>
            <div>
                {loading && <p className="p-2 text-center"><CustomLoader/></p>}

                <main className="md:flex md:justify-center ">
                    {loading === false && <div className="lg:max-w-7xl w-full bg-white rounded-xl p-2 md:p-6 container">
                        <div className=" rounded-xl border-1  w-full rounded-xl px-2 md:px-16 py-2 md:py-12">
                            <p className="text-base text-left font-bold py-4 text-gray-700">Update Referral
                                Point </p>


                            {dollarPrice ?
                                <div className="md:my-6 my-4">

                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="md:ml-2 mt-2 text-gray-700 font-bold">
                                            <div className="flex  items-center mt-2 fo">
                                                <p className="md:w-64 mr-4">Current Referral Price</p>
                                                 <p> 1 RP = {dollarPrice} USD </p>


                                            </div>
                                            <br/>
                                            <div className="flex  items-center mt-4">
                                                <p className="md:w-64 ">Update Price Per RP(USD)</p>
                                                <div className=" md:ml-4 ml-4 ">
                                                    <input
                                                        className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                                                        type="number"
                                                        defaultValue={dollarPrice}
                                                        min="0"
                                                        id="price"
                                                        name="price"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.price}
                                                    />

                                                </div>


                                            </div>
                                            {formik.touched.price && formik.errors.price &&
                                            <Warning message={formik.errors.price}/>}

                                            <button
                                                type="submit"
                                                className="focus:outline-none rounded my-8 flex items-center mx-auto hover:font-bold px-6 py-3  w-auto px-12  text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold">
                                                Update
                                            </button>


                                        </div>
                                    </form>


                                </div> :
                                <p className="text-md font-bold my-4"/>
                            }


                        </div>
                    </div>}



                </main>


            </div>
        </Layout>
    )
}
