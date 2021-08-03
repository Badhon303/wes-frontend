import {useFormik} from 'formik'
import {Link, useHistory} from "react-router-dom";
import React from "react";
import Navbar2 from "../../components/Header/Navbar2";
import passwordIcon from "../../image/icons/passwrod.svg";
import AuthAPI from '../../apis/auth';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout/Layout';
import {getUserInfo} from '../../auth/authContainer';

const REDIRECT_AFTER_PASS_RESET = '/dashboard'

const validate = values => {
    const errors = {};
    const {password, passwordConfirm} = values;

    if (!password) {
        errors.password = 'Required';
    }
    else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{4,8}$/i.test(values.password)) {
        errors.password = 'Must be between 4 to 8 characters and at least 1 character and 1 numeric number';
    }

    if (!passwordConfirm) {
        errors.passwordConfirm = 'Required';
    } else if (passwordConfirm !== password) {
        errors.passwordConfirm = 'Does not match with password';
    }

    return errors;
};

export default function ChangePassword() {
    let history = useHistory();

    let user = getUserInfo();

    const formik = useFormik({
        initialValues: {
            password: '',
            passwordConfirm: '',
        },
        validate,
        onSubmit: values => {
            AuthAPI.changePass(user.id, {newPassword: values.password})
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            title: response.message,
                            text: 'Success',

                            confirmButtonText: 'Okay',
                        })
                        // history.push(REDIRECT_AFTER_PASS_RESET);
                    } else {
                        Swal.fire({
                            title: response.err.statusText,
                            text: response.data.message,
                            confirmButtonColor: '#ff8c00',
                            confirmButtonText: 'Back',
                        })
                    }
                })
                .catch(err => {
                    Swal.fire({
                        title: "Error",
                        text: err.message,
                        confirmButtonColor: '#ff8c00',
                        confirmButtonText: 'Back',
                    })
                });
        }
    });

    return (
        <Layout>
            <form onSubmit={formik.handleSubmit}>
                <div
                    className="  w-full md:w-90 xl:w-90 2xl:w-full md:border-t-1  items-center justify-center md:mx-auto ">
                    <div
                        className="py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  ">
                        <div className="mx-auto p-4  mt-12 mb-2 bg-white  ">
                            <h2 className="pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center ">Change your
                                Passowrd</h2>
                            <div className="m-3 pt-4">
                                <div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                      <img src={passwordIcon} className="w-6  h-6 "/>
                    </button>
                  </span>
                                    <input type="password"
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           value={formik.values.password}
                                           className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                                           name="password"
                                           id="password"
                                           aria-describedby="change-password"
                                           placeholder="Enter your new password"/>
                                </div>

                                {formik.touched.password && formik.errors.password && (
                                    <div
                                        className="my-2 bg-red-100 py-2 text-sm text-red-700">{formik.errors.password}</div>)}
                            </div>
                            <div className="m-3 pt-4">

                                <div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                      <img src={passwordIcon} className="w-6  h-6 "/>
                    </button>
                  </span>
                                    <input type="password"
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           value={formik.values.passwordConfirm}
                                           className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                                           name="passwordConfirm"
                                           id="passwordConfirm"
                                           aria-describedby="passwordConfirm"
                                           placeholder="Retype the password"/>
                                </div>

                                {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                                    <div
                                        className="my-2 bg-red-100 py-2 text-sm text-red-700">{formik.errors.passwordConfirm}</div>)}
                            </div>
                            <div className="text-center items-center justify-center mt-6 ">
                                <button type="submit"
                                        className="w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md">
                                    Password Update
                                </button>
                            </div>

                        </div>


                    </div>

                </div>

            </form>
        </Layout>
    )
}
