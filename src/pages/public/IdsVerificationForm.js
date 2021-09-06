import { useFormik } from "formik"
import * as FetchApi from "../../libs/FetchApi"
import { BASE_URL } from "../../constants"
import Swal from "sweetalert2"
import { VerifyFirstModalHeadline } from "../../utils/staticTexts"
import React, { useEffect, useState } from "react"
import isValidEmail from "../../libs/validator/email"
import UserManager from "../../libs/UserManager"
import Warning from "../../components/Message/warning"
import tickSign from "../../image/icons/tick.svg"
import NID from "../verify/NID"
import Passport from "../verify/Passport"
import DrivingLicense from "../verify/DrivingLicense"
import { getUserInfo } from "../../auth/authContainer"
import BasicInfoForm from "./basicInfoForm"

const REDIRECT_AFTER_VERIFICATION = "/buy"

const VERIFICATION_TYPE_NID = 1
const VERIFICATION_TYPE_PASSPORT = 2
const VERIFICATION_TYPE_DRIVING_LICENSE = 3

const validate = (values) => {
  const errors = {}
  const { firstName, lastName, nickName, photo, nid, email, address, country } =
    values

  if (!nickName) {
    errors.nickkNme = "Required"
  } else if (!(nickName.length >= 3 && nickName.length < 30)) {
    errors.nickName = "Must be greater than 3 and less than 30 characters"
  }

  return errors
}

export default function IdVerificationForms(props) {
  const [id, setId] = useState(1)

  const [nestedId, setNestedId] = useState(props.nestedId)

  const user = UserManager.getLoggedInUser()

  const [verificationType, setVerificationType] = useState(null)

  useEffect(() => {
    if (props.nestedId === false) {
      setNestedId(false)
      setVerificationType(null)
    }
  }, [props.nestedId])

  const formik = useFormik({
    initialValues: {
      nationality: "",
      firstName: "",
      lastName: "",
      spouseName: "",
      nickname: props.nickName,
      email: "",
      photo: "",
      dob: "",
      gender: "",
      phone: "",
      nid: "",
      address: "",
      state: "",
      city: "",
      code: "",
      country: "",
      nidFront: null,
      nidBack: null,
      ...user,
    },
    validate,
    onSubmit: (values) => {
      // TODO:: handle verficiation document upload
      FetchApi.sendPutRequest(`${BASE_URL}/users/${user.id}`, values, {
        credentials: true,
      })
        .then((res) => {
          Router.push(REDIRECT_AFTER_VERIFICATION)
        })
        .catch((err) => {
          if (err.response.status === 422) {
            // Handle server-side validation errors
          } else {
            // Swal.fire(response.status); // Show more specific message
          }
          Swal.fire("Whoops..", err.response.message, "error")
          // console.log(err)
        })
    },
  })

  function handleSubmit() {
    setVerificationType(id)
    setNestedId(true)
    props.nestedIdCallBack(true)
  }

  function onVerificationDone(status) {
    setVerificationType(null)
    setNestedId(false)
    props.cb && props.cb(status)
  }

  return (
    <div className='   '>
      <div className='flex items-end justify-between  border-solid border-gray-300 rounded-t'>
        {/*{id && verificationType &&  <div className="p-2 cursor-pointer" onClick={()=> setVerificationType(null)}>*/}
        {/*<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>*/}
        {/*</div> }*/}
      </div>
      {verificationType === null && nestedId === false && (
        <div>
          <p className='text-lg font-bold text-left text-gray-500 pb-4'>
            Id Verification{" "}
          </p>

          <p className=' text-base font-medium text-left py-2 text-gray-400 text-base'>
            Select document type{" "}
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className=' flex flex-col  '>
              <div
                onClick={() => setId(1)}
                className={
                  "my-2 cursor-pointer shadow border-2 font-bold hover:bg-site-theme hover:text-white focus:bg-site-theme focus:text-white  text-center py-4 " +
                  (id === 1 ? "bg-site-theme text-white" : "bg-white text-back")
                }
              >
                <span className='flex justify-start '>
                  {id === 1 && (
                    <img
                      src={tickSign}
                      className='h-6 w-6 text-center mx-4 '
                      alt='tick sign'
                    />
                  )}{" "}
                  <p className={id === 1 ? "pl-0" : "pl-14"}> ID Card </p>
                </span>
              </div>
              <div
                onClick={() => setId(2)}
                className={
                  "my-2 cursor-pointer shadow border-2 font-bold hover:bg-site-theme hover:text-white focus:bg-site-theme focus:text-white  text-center py-4 " +
                  (id == 2 ? "bg-site-theme text-white" : "bg-white text-back")
                }
              >
                <span className='flex justify-start '>
                  {id === 2 && (
                    <img
                      src={tickSign}
                      className='h-6 w-6 text-center mx-4 '
                      alt='tick sign'
                    />
                  )}{" "}
                  <p className={id === 2 ? "pl-0" : "pl-14"}> Passport </p>
                </span>
              </div>
              <div
                onClick={() => setId(3)}
                className={
                  "my-2 cursor-pointer shadow border-2 font-bold hover:bg-site-theme hover:text-white focus:bg-site-theme focus:text-white  text-center py-4 " +
                  (id === 3 ? "bg-site-theme text-white" : "bg-white text-back")
                }
              >
                <span className='flex justify-start '>
                  {id === 3 && (
                    <img
                      src={tickSign}
                      className='h-6 w-6 text-center mx-4 '
                      alt='tick sign'
                    />
                  )}{" "}
                  <p className={id === 3 ? "pl-0" : "pl-14"}>
                    {" "}
                    Driving Licence{" "}
                  </p>{" "}
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className='bg-site-theme  mt-6 w-full text-white active:bg-green-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none '
              type='button'
              style={{ transition: "all .15s ease" }}
            >
              Continue
            </button>
          </form>
        </div>
      )}
      {id === 1 && verificationType === 1 && (
        <NID userInfo={props.userInfo} cb={onVerificationDone} />
      )}

      {id === 2 && verificationType === 2 && (
        <Passport userInfo={props.userInfo} cb={onVerificationDone} />
      )}

      {id === 3 && verificationType === 3 && (
        <DrivingLicense userInfo={props.userInfo} cb={onVerificationDone} />
      )}
    </div>
  )
}
