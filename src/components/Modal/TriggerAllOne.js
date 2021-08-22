import React, {useState} from "react";
import {func} from "prop-types";
import Modal from "react-modal";
import CancelButton from "../Button/cancelButton";
import Warning from "../Message/warning";
import {useFormik} from "formik";
import moment from 'moment';
import * as PurchaseAPI from "../../apis/purchase";
import Swal from "sweetalert2";
import CustomLoader from "../CustomLoader/CustomLoader";
import {useHistory} from "react-router-dom";
import emailIcon from "../../image/icons/email.svg";
import {customStylesModal} from "../../utils/styleFunctions";

export default function TriggerOneModal(props) {
    let history = useHistory();
    const [loading,setLoading]= useState(false);

    const formik = useFormik({
        initialValues: {
            type: "single",
            email: "",
            goldPoint: ''
        },
        validateOnChange: true,
        validate: async (values) => {

            const errors = {};
            const {
                email,
                goldPoint
            } = values;

            if (!email  && !email.length) {
                errors.token = "Email must be provided";
            }


            if (!goldPoint && !goldPoint.length) {
                errors.goldPoint = "Gold point must be provided";
            } else if(Math.sign(goldPoint)===1 && goldPoint > props.goldPoint)    errors.goldPoint = "Gold point must be less than your total gold point";

            return errors;
        },
        onSubmit: (values) => {
            setLoading(true)
            PurchaseAPI.triggerForOneApi(values)
                .then((res) => {
                    console.log(res);
                    setLoading(false);

                    if(res && res.data && (res.data.code===406 || res.data.code===400)){
                        Swal.fire("Error",  res.data.message, "error");
                    }

                    else {
                        formik.resetForm();
                        Swal.fire({
                            icon: 'success',
                            title: `Trigger Completer for schedule date,Tx Id: ${res.data.trigger.id}`,
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: `Okay`,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {

                                props.reloadData()
                                handleModalCallback()
                                history.push("/trigger-gold-points");
                            }
                        })

                    }
                })
                .catch((err) => {
                    setLoading(false);
                    Swal.fire("Error", err.message, "error");
                });

            console.log(values,'ad')
        }
    })



    function handleModalCallback() {
        props.onClose && props.onClose();
    }



    function handleCreate() {

    }
    function updateSelectValue(value) {
        formik.values.token=value.value

    }

    function handleDate(date) {
       let time= moment(date)
        console.log(time)
        formik.values.scheduleDate=time
    }

    return (
        <Modal
            isOpen={true}
            contentLabel="onRequestClose Example"
            onRequestClose={handleModalCallback}
            shouldCloseOnOverlayClick={false}
            style={customStylesModal}
        >
            <div className=" ">
                <div
                    className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-2xl font-semibold text-site-theme ">
                       Add Trigger for GP Share to a User
                    </h3>
                    <div
                        className="px-6 py-2 ml-auto cursor-pointer "
                        onClick={handleModalCallback}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path
                                d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>

                    </div>
                </div>



                <div className="overflow h-auto px-6">
                    <form onSubmit={formik.handleSubmit}>

                    <div className=" ">
                        <div className="my-1">
                            <p className=" font-title  text-left  text-base md:text-base ">
                               Email
                            </p>


                            <div className="w-96 mt-2">

                                <div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <div  className="p-1 focus:outline-none focus:shadow-outline" tabIndex="-1">
                      <img src={emailIcon} className="w-6  h-6 " />
                    </div>
                  </span>
                                    <input type="email"
                                           onChange={formik.handleChange}
                                           value={formik.values.email}
                                           className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                                           name="email"
                                           id="email"
                                           aria-describedby="email"
                                           placeholder="Enter your email"
                                           autoComplete="off" />
                                </div>

                                {formik.touched.email && formik.errors.email && (
                                    <div className="bg-red-100 my-2 py-2 text-red-700">{formik.errors.email}</div>)}
                            </div>
                        </div>

                        <div className="mt-6 ">
                            <p className=" font-title  text-left  text-base md:text-base ">
                               Gold point
                            </p>


                            <div className=" mt-2 w-48 md:w-96">
                            <input
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.goldPoint}
                            className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                            name="goldPoint"
                            id="goldPoint"
                            aria-describedby="goldPoint"
                            placeholder="Gold Point"
                            autoComplete="off"
                        />
                            </div>
                            {formik.touched.goldPoint && formik.errors.goldPoint && (
                                <Warning message={formik.errors.goldPoint}/>
                            )}

                        </div>

                    </div>
                        <div className="  md:flex items-center  mb-40 mt-12 lg:mx-16">

                            <CancelButton onClick={handleModalCallback} title="Cancel"/>

                           <button type="submit"
                            className="w-full  sm:w-auto inline-flex justify-center
                            text-white border-1 border-branding-text-color text-xl
                            rounded py-1.5 px-12 bg-site-theme focus:outline-none hover:shadow-lg mr-6"
                            >
                            Create
                        </button>
                        </div>
                    </form>
                </div>



                {loading===true   && <p className="p-2 text-center"><CustomLoader/></p>}



            </div>


        </Modal>

    )
}

