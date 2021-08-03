import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import {signup} from "../../apis/auth";
import Swal from "sweetalert2";
import isValidEmail from "../../libs/validator/email";
import Warning from "../../components/Message/warning";

// Nationality
// First name/kana/Kanji
// Last name/Kana/Kanji
// Nick Name
// Spouse name
// Photo
// Date of Birth
// SEX/Gender
// Phone
// My Number Card/NID
// Address
// State/City
// Zip code
// Country

const validate = values => {
    const errors = {};
    const {firstName, lastName, nickName, photo,  email, address,} = values;

    if (!nickName) {
        errors.nickkNme = 'Required';
    } else if (!(nickName.length >= 3 && nickName.length < 30)) {
        errors.nickName = 'Must be greater than 3 and less than 30 characters';
    }

    if (!firstName) {
        errors.firstName = 'Required';
    }

    else if (!/^[a-zA-Z]+[.]*$/i.test(values.firstName)) {
        errors.firstName = 'Firstname contains characters and dot only';
      }

    if (!lastName) {
        errors.lastName = 'Required';
    }
    else if (!/^[a-zA-Z, ]*$/i.test(values.lastName)) {
        errors.lastName = 'Lasttname contains characters only';
      }

    if (!email) {
        errors.email = 'Required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};


export default function ProfileEdit(props) {
    const [userData, setUserData] = useState({});
    const [showModal, setShowModal] = useState(props.showModal);
    const [imageEditor, setImageEditor] = useState();
    const [user, setUser] = useState(props && props.userData);




      function handleModalCallback() {
        setShowModal(false)
        props.modalShow(false)
    }


    useEffect(() => {
        setUserData(props.userData);
    }, [props.userData]);

    const countries = [
        {
            id: 1,
            label: 'United States',
        },
        {
            id: 2,
            label: 'Bangladesh',
        }];


    const formik = useFormik({
        initialValues: {
            nationality: user && user.nationality && user.nationality ? user.nationality : '',
            firstName: user && user.firstName && user.firstName ? user.firstName : '',
            lastName: user && user.middleName ? user.middleName : '',
            spouseName: user && user.spouseName && user.spouseName ? user.spouseName : '',
            nickname: user && user.nickName && user.nickName ? user.nickName : '',
            photo: user && user.photo && user.photo ? user.photo : '',
            dob: user && user.dob && user.dob ? user.dob : '',
            gender: user && user.gender && user.gender ? user.gender : '',
            phone: user && user.phone && user.phone ? user.phone : '',
            nid: user && user.nationalId && user.nationalId ? user.nationalId : '',
            address: user && user.street && user.street ?  user.street : '',
            state: user  && user.state && user.state ? user.state : '',
            city: user && user.city && user.city ? user.city :'',
            code: user && user.zipcode && user.zipcode ? user.zipcode :'',
            country: user && user.nationality && user.nationality ? user.nationality: '',
        },
        validate,
        onSubmit: values => {
            signup(values)
                .then((res) => {


                    // Router.push(REDIRECT_AFTER_SIGNUP);
                })

                .catch(err => {
                    if (err.response.status === 422) {
                        // Handle server-side validation errors
                    } else {
                        // Swal.fire(response.status); // Show more specific message
                    }
                    Swal.fire('Whoops..', err.response.message, 'error');
                    console.log(err)
                });
        }
    });
    console.log(formik.initialValues.nickName,'check props userr');

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        // onClick={handleModalCallback}
                    >
                        <div className="relative w-auto my-8 mx-auto max-w-3xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div
                                    className="flex items-start justify-between border-solid border-gray-300 rounded-t">
                                    <div className="p-2 cursor-pointer" onClick={handleModalCallback}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24"
                                             width="24">
                                            <path d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                        </svg>
                                    </div>
                                    <div
                                        className="px-6 py-2 ml-auto cursor-pointer "
                                        onClick={handleModalCallback}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24"
                                             width="24">
                                            <path d="M0 0h24v24H0V0z" fill="none"/>
                                            <path
                                                d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                        </svg>

                                    </div>
                                </div>
                                {/*body*/}

                                <div className="mt-10 sm:mt-0 w-full px-6 ">
                                    <div className="md:grid md:grid-cols-3 md:gap-6">
                                        <div className="mt-5 md:mt-0 md:col-span-3">
                                            <form onSubmit={formik.handleSubmit}>
                                                <div className="shadow overflow-hidden sm:rounded-md">
                                                    <div className="px-4 py-5 bg-white sm:p-6">
                                                        <div className="grid grid-cols-6 gap-6">

                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="first_name"
                                                                       className="block text-sm font-medium text-gray-700 py-1">First
                                                                    name</label>
                                                                <input id="firstName"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                                                                       onChange={formik.handleChange}
                                                                       disabled={props.edit ? false : true}
                                                                       onBlur={formik.handleBlur}
                                                                       value={formik.values.firstName}
                                                                       placeholder="Enter first name"/>
                                                                {formik.touched.firstName && formik.errors.firstName && (
                                                                    <Warning
                                                                        message={formik.errors.firstName}></Warning>)}
                                                            </div>

                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="lastName"
                                                                       className="py-1 block text-sm font-medium text-gray-700">Last
                                                                    name</label>
                                                                <input
                                                                    disabled={props.edit ? false : true}
                                                                    id="lastName" onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.lastName}
                                                                    placeholder="Enter last name"
                                                                    className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                                                                />
                                                                {formik.touched.lastName && formik.errors.lastName && (
                                                                    <Warning
                                                                        message={formik.errors.lastName}></Warning>)}
                                                            </div>
                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="nickName"
                                                                       className="py-1 block text-sm font-medium text-gray-700 py-1">Nick
                                                                    Name</label>

                                                                <input disabled={props.edit ? false : true}
                                                                       id="nickName" onChange={formik.handleChange}
                                                                       onBlur={formik.handleBlur}
                                                                       value={formik.values.nickName}
                                                                       placeholder="Enter nick name"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"

                                                                />
                                                                {formik.touched.nickName && formik.errors.nickName && (
                                                                    <Warning
                                                                        message={formik.errors.nickName}></Warning>)}
                                                            </div>

                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="spouseName"
                                                                       className="py-1 block text-sm font-medium text-gray-700 py-1">Spouse
                                                                    Name</label>

                                                                <input disabled={props.edit ? false : true}
                                                                       id="spouseName"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                                                                       onChange={formik.handleChange}
                                                                       onBlur={formik.handleBlur}
                                                                       value={formik.values.spouseName}
                                                                       placeholder="Enter spouse name"/>
                                                                {formik.touched.spouseName && formik.errors.spouseName && (
                                                                    <Warning
                                                                        message={formik.errors.spouseName}></Warning>)}
                                                            </div>


                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="dob"
                                                                       className="py-1 block text-sm font-medium text-gray-700 py-1">Date
                                                                    of birth</label>

                                                                <input disabled={props.edit ? false : true}
                                                                       id="dob" type="date"
                                                                       onChange={formik.handleChange}
                                                                       onBlur={formik.handleBlur}
                                                                       value={formik.values.dob}
                                                                       placeholder="Enter date of birth"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"

                                                                />
                                                                {formik.touched.dob && formik.errors.dob && (
                                                                    <Warning message={formik.errors.dob}></Warning>)}
                                                            </div>


                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="phone"
                                                                       className="py-1 block text-sm font-medium text-gray-700 py-1">Phone</label>

                                                                <input disabled={props.edit ? false : true}
                                                                       id="phone" onChange={formik.handleChange}
                                                                       onBlur={formik.handleBlur}
                                                                       value={formik.values.phone}
                                                                       placeholder="Enter phone number"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"

                                                                />
                                                                {formik.touched.phone && formik.errors.phone && (
                                                                    <Warning message={formik.errors.phone}></Warning>)}

                                                            </div>


                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="gender"
                                                                       className="py-1 block text-sm font-medium text-gray-700 py-1">
                                                                    Gender</label>
                                                                <select disabled={props.edit ? false : true}
                                                                        id="gender" onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={formik.values.gender}
                                                                        placeholder="Select gender"
                                                                        className=" cursor-pointer border-2 px-4  py-2 w-full text-sm text-black bg-white rounded-md focus:outline-none focus:bg-white focus:text-gray-900"

                                                                >
                                                                    <option disabled>Select gender</option>
                                                                    <option value="1">Male</option>
                                                                    <option value="2">Female</option>
                                                                    <option value="3">Trans-gender</option>
                                                                </select>
                                                                {formik.touched.gender && formik.errors.gender && (
                                                                    <Warning message={formik.errors.gender}></Warning>)}
                                                            </div>

                                                            <div className="col-span-6 sm:col-span-3">
                                                                <label htmlFor="country"
                                                                       className="block text-sm font-medium text-gray-700 py-1">Country
                                                                    / Region</label>
                                                                <select disabled={props.edit ? false : true}
                                                                        id="country" onChange={formik.handleChange}
                                                                        autoComplete="country"
                                                                        onBlur={formik.handleBlur}
                                                                        value={formik.values.country}
                                                                        placeholder="Select country"
                                                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                    <option disabled>Select country</option>
                                                                    {
                                                                        countries.map(country => (
                                                                            <option key={country.id}
                                                                                    value={country.id}>{country.label}</option>))
                                                                    }
                                                                </select>
                                                                {formik.touched.country && formik.errors.country && (
                                                                    <Warning
                                                                        message={formik.errors.country}></Warning>)}


                                                            </div>
                                                            <div className=" col-span-6 sm:col-span-3 ">
                                                                <label htmlFor="postal_code"
                                                                       className="block text-sm font-medium text-gray-700 py-1">ZIP
                                                                    / Postal</label>
                                                                <input disabled={props.edit ? false : true}
                                                                       type="text" name="postal_code" id="postal_code"
                                                                       autoComplete="postal-code"
                                                                       placeholder="Zip/Postal code"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"/>
                                                            </div>

                                                            <div className="col-span-6 sm:col-span-3 ">

                                                                <label htmlFor="address"
                                                                       className="py-1 block text-sm font-medium text-gray-700 py-1">
                                                                    Address</label>

                                                                <input disabled={props.edit ? false : true}
                                                                       id="address" onChange={formik.handleChange}
                                                                       onBlur={formik.handleBlur}
                                                                       value={formik.values.address}
                                                                       placeholder="Enter address"

                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"

                                                                />
                                                                {formik.touched.address && formik.errors.address && (
                                                                    <Warning
                                                                        message={formik.errors.address}></Warning>)}
                                                            </div>

                                                            <div className="col-span-6 sm:col-span-3 ">
                                                                <label htmlFor="city"
                                                                       className="block text-sm font-medium text-gray-700 py-1">City/State</label>

                                                                <input disabled={props.edit ? false : true}
                                                                       onChange={formik.handleChange}
                                                                       onBlur={formik.handleBlur}
                                                                       type="text" name="city" id="city"
                                                                       value={formik.values.state}
                                                                       placeholder="Enter state/city"
                                                                       className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"

                                                                />
                                                                {formik.touched.state && formik.errors.state && (
                                                                    <Warning message={formik.errors.state}></Warning>)}
                                                            </div>

                                                        </div>
                                                    </div>
                                                    {props.showModal ?
                                                        <div className="px-6 py-3 bg-gray-50 text-center sm:px-6">
                                                            <button type="submit"
                                                                    className="inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme focus:ring-site-theme">
                                                               Update
                                                            </button>
                                                        </div> : <div></div>}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="opacity-50 fixed inset-0 z-40 bg-black"/>
                </>
            ) : null}
        </>
    )
}
