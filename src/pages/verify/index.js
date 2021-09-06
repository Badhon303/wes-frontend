import React, { useState } from "react"
import { Router } from "react-router-dom"
import DrivingLicense from "./DrivingLicense"
import NID from "./NID"
import Passport from "./Passport"
import Layout from "../../components/Layout/Layout"
import identityBackground from "../../image/Identity-Verifications-background.jpg"
import Warning from "../../components/Message/warning"
import { useFormik } from "formik"
import { signup } from "../../apis/auth"
import Swal from "sweetalert2"
import isValidEmail from "../../libs/validator/email"
import UserManager from "../../libs/UserManager"
import * as FetchApi from "../../libs/FetchApi"
import { BASE_URL } from "../../constants"

const REDIRECT_AFTER_VERIFICATION = "/buy"

const VERIFICATION_TYPE_NID = 1
const VERIFICATION_TYPE_PASSPORT = 2
const VERIFICATION_TYPE_DRIVING_LICENSE = 3

const validate = (values) => {
  const errors = {}
  const { firstName, lastName, nickName, photo, nid, email, address } = values

  if (!nickName) {
    errors.nickkNme = "Required"
  } else if (!(nickName.length >= 3 && nickName.length < 30)) {
    errors.nickName = "Must be greater than 3 and less than 30 characters"
  }

  if (!firstName) {
    // errors.firstName = 'Required';
  }
  // else if (!(firstName.length >= 8 && firstName.length < 200)) {
  //     errors.firstName = 'Must be greater than 8 characters and less than 200 ';
  // }
  else if (!/^[a-zA-Z]+[.]*$/i.test(values.firstName)) {
    errors.firstName = "Firstname contains characters and dot only"
  }

  if (!lastName) {
    // errors.lastName = 'Required';
  }
  // else if (!(lastName.length >= 8 && lastName.length < 200)) {
  //     errors.lastName = 'Must be greater than 8 characters and less than 200 ';
  // }
  else if (!/^[a-zA-Z, ]*$/i.test(values.lastName)) {
    errors.lastName = "Lasttname contains characters only"
  }

  if (!email) {
    errors.email = "Required"
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address"
  }

  return errors
}

export default function Verify(props) {
  const user = UserManager.getLoggedInUser()

  const [verificationType, setVerificationType] = useState(
    VERIFICATION_TYPE_NID
  )

  const imageSelect = async (e) => {
    let image = ""
    // let name = e.target.name;
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = await function () {
      image = reader.result
      setUserData({ ...userData, photo: image })
    }
  }
  const setImageToState = () => {
    let imageDataURI = ""
    if (imageEditor) {
      const canvas = imageEditor.getImage()
      imageDataURI = canvas.toDataURL()
      setUserData({ ...userData, photo: imageDataURI })
    }
  }

  const countries = [
    {
      id: 1,
      label: "United States",
    },
    {
      id: 2,
      label: "Bangladesh",
    },
  ]

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

  function handleVerificationStatusChange(status) {
    if (status === true) {
      Router.push(REDIRECT_AFTER_VERIFICATION)
    }
  }

  const [images, setImages] = useState({})

  function handleVerificationFileUploadEvent(event, field) {
    // formik.handleChange(customEvent);
    setImages({
      ...images,
      [field]: event.currentTarget.files[0],
    })
  }

  function handleCancelVerification() {
    // Go back ?
  }

  let formFields = null
  if (verificationType === VERIFICATION_TYPE_NID) {
    formFields = (
      <>
        <div className='col-span-6 sm:col-span-3'>
          <label
            htmlFor='nidFront'
            className='py-1 block text-sm font-medium text-gray-700 py-1'
          >
            NID front
          </label>

          <input
            id='nidFront'
            type='file'
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur} value={formik.values.nidFront}
            placeholder='Upload NID front'
            className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
          />
          {formik.touched.nidFront && formik.errors.nidFront && (
            <Warning message={formik.errors.nidFront}></Warning>
          )}
        </div>
        <div className='col-span-6 sm:col-span-3'>
          <label
            htmlFor='nidBack'
            className='py-1 block text-sm font-medium text-gray-700 py-1'
          >
            NID back
          </label>

          <input
            id='nidBack'
            type='file'
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur} value={formik.values.nidBack}
            placeholder='Upload NID back'
            className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
          />
          {formik.touched.nidBack && formik.errors.nidBack && (
            <Warning message={formik.errors.nidBack}></Warning>
          )}
        </div>
      </>
    )
  } else if (verificationType === VERIFICATION_TYPE_PASSPORT) {
    formFields = (
      <Passport
        onVerificationStatusUpdate={handleVerificationStatusChange}
        onCancel={handleCancelVerification}
      />
    )
  } else if (verificationType === VERIFICATION_TYPE_DRIVING_LICENSE) {
    formFields = (
      <DrivingLicense
        onVerificationStatusUpdate={handleVerificationStatusChange}
        onCancel={handleCancelVerification}
      />
    )
  }

  return (
    <Layout>
      <div className='bg-white rounded-t-xl  w-full   items-center justify-center md:mx-auto '>
        <div className='px-6 md:px-0 lg:px-0 xl:px-0 w-full items-center justify-center md:mx-auto  shadow '>
          <h1 className='text-center py-2 text-xl font-black'>
            {" "}
            Identity Verification{" "}
          </h1>
          <div className='grid grid-cols-12  mx-auto p-6  mt-4 mb-2 bg-white '>
            <div className='col-span-4'>
              <img
                src={identityBackground}
                className='w-full h-auto '
                alt='identity verification sample'
              />
            </div>
            <div className='col-span-8'>
              <form onSubmit={formik.handleSubmit}>
                <p className='px-2 text-xl font-bold text-left py-4 '>
                  {" "}
                  Basic Information{" "}
                </p>
                <div className='grid grid-cols-6 gap-4'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='first_name'
                      className='block text-sm font-medium text-gray-700 py-1'
                    >
                      First name
                    </label>
                    <input
                      id='firstName'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      placeholder='Enter first name'
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <Warning message={formik.errors.firstName}></Warning>
                    )}
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='nickName'
                      className='py-1 block text-sm font-medium text-gray-700 py-1'
                    >
                      Middle Name
                    </label>

                    <input
                      id='nickName'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.nickName}
                      placeholder='Enter nick name'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                    />
                    {formik.touched.nickName && formik.errors.nickName && (
                      <Warning message={formik.errors.nickName}></Warning>
                    )}
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='lastName'
                      className='py-1 block text-sm font-medium text-gray-700'
                    >
                      Last name
                    </label>
                    <input
                      id='lastName'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      placeholder='Enter last name'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <Warning message={formik.errors.lastName}></Warning>
                    )}
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='dob'
                      className='py-1 block text-sm font-medium text-gray-700 py-1'
                    >
                      Date of birth
                    </label>

                    <input
                      id='dob'
                      type='date'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.dob}
                      placeholder='Enter date of birth'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                    />
                    {formik.touched.dob && formik.errors.dob && (
                      <Warning message={formik.errors.dob}></Warning>
                    )}
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='gender'
                      className='py-1 block text-sm font-medium text-gray-700 py-1'
                    >
                      Gender
                    </label>
                    <select
                      id='gender'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.gender}
                      placeholder='Select gender'
                      className=' cursor-pointer border-2 px-4  py-2 w-full text-sm text-black bg-white rounded-md focus:outline-none focus:bg-white focus:text-gray-900'
                    >
                      <option disabled>Select gender</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                      <Warning message={formik.errors.gender}></Warning>
                    )}
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='country'
                      className='block text-sm font-medium text-gray-700 py-1'
                    >
                      Nationality
                    </label>
                    <select
                      id='country'
                      onChange={formik.handleChange}
                      autoComplete='country'
                      onBlur={formik.handleBlur}
                      value={formik.values.country}
                      placeholder='Nationality'
                      className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    >
                      <option disabled>Select country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.country && formik.errors.country && (
                      <Warning message={formik.errors.country}></Warning>
                    )}
                  </div>
                </div>
                <p className='px-2 text-xl font-bold text-left  pt-8 pb-4'>
                  {" "}
                  Residential Address{" "}
                </p>

                <div className='grid grid-cols-6 gap-4'>
                  <div className=' col-span-6 sm:col-span-3 '>
                    <label
                      htmlFor='postal_code'
                      className='block text-sm font-medium text-gray-700 py-1'
                    >
                      ZIP / Postal
                    </label>
                    <input
                      type='text'
                      name='postal_code'
                      id='postal_code'
                      autoComplete='postal-code'
                      placeholder='Zip/Postal code'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                    />
                  </div>
                  <div className='col-span-6 sm:col-span-3 '>
                    <label
                      htmlFor='address'
                      className='py-1 block text-sm font-medium text-gray-700 py-1'
                    >
                      Address
                    </label>

                    <input
                      id='address'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      placeholder='Enter address'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                    />
                    {formik.touched.address && formik.errors.address && (
                      <Warning message={formik.errors.address}></Warning>
                    )}
                  </div>
                  <div className='col-span-6 sm:col-span-3 '>
                    <label
                      htmlFor='city'
                      className='block text-sm font-medium text-gray-700 py-1'
                    >
                      City/State
                    </label>

                    <input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type='text'
                      name='city'
                      id='city'
                      value={formik.values.state}
                      placeholder='Enter state/city'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                    />
                    {formik.touched.state && formik.errors.state && (
                      <Warning message={formik.errors.state}></Warning>
                    )}
                  </div>
                </div>
                <p className='px-2 text-xl font-bold text-left  pt-8 pb-4'>
                  {" "}
                  Identity Verify
                </p>

                <div className='grid grid-cols-6 gap-4'>
                  {/*<div className="col-span-6 sm:col-span-3">*/}
                  {/*<label htmlFor="nid"*/}
                  {/*className="py-1 block text-sm font-medium text-gray-700 py-1">My Number*/}
                  {/*ID/NID</label>*/}

                  {/*<input*/}
                  {/*id="nid" onChange={formik.handleChange} onBlur={formik.handleBlur}*/}
                  {/*value={formik.values.nid} placeholder="Enter NID no"*/}
                  {/*className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"*/}

                  {/*/>*/}
                  {/*{formik.touched.nid && formik.errors.nid && (*/}
                  {/*<Warning message={formik.errors.nid}></Warning>)}*/}

                  {/*</div>*/}

                  <div className='col-span-6 sm:col-span-6'>
                    <div className='mt-2'>
                      <label className='inline-flex items-center'>
                        <input
                          checked={verificationType === VERIFICATION_TYPE_NID}
                          onChange={() =>
                            setVerificationType(VERIFICATION_TYPE_NID)
                          }
                          type='radio'
                          className='form-radio h-6 w-6'
                          name='accountType'
                          value='nid'
                        />
                        <span className='ml-2'>NID</span>
                      </label>
                      <label className='inline-flex items-center ml-6'>
                        <input
                          checked={
                            verificationType === VERIFICATION_TYPE_PASSPORT
                          }
                          onChange={() =>
                            setVerificationType(VERIFICATION_TYPE_PASSPORT)
                          }
                          type='radio'
                          className='form-radio h-6 w-6 '
                          name='accountType'
                          value='driving'
                        />
                        <span className='ml-2'>Driving Licence</span>
                      </label>
                      <label className='inline-flex items-center ml-6'>
                        <input
                          checked={
                            verificationType ===
                            VERIFICATION_TYPE_DRIVING_LICENSE
                          }
                          onChange={() =>
                            setVerificationType(
                              VERIFICATION_TYPE_DRIVING_LICENSE
                            )
                          }
                          type='radio'
                          className='form-radio h-6 w-6'
                          name='accountType'
                          value='passport'
                        />
                        <span className='ml-2'>Passport</span>
                      </label>
                    </div>

                    <div className='card text-left'>
                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='ront'
                          className='py-1 block text-sm font-medium text-gray-700 py-1'
                        >
                          Front image
                        </label>

                        <input
                          id='front'
                          type='file'
                          onChange={(event) =>
                            handleVerificationFileUploadEvent(event, "front")
                          }
                          placeholder='Upload front'
                          className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                        />
                        {formik.touched.front && formik.errors.front && (
                          <Warning message={formik.errors.front}></Warning>
                        )}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='back'
                          className='py-1 block text-sm font-medium text-gray-700 py-1'
                        >
                          Back image
                        </label>

                        <input
                          id='back'
                          type='file'
                          onChange={(event) =>
                            handleVerificationFileUploadEvent(event, "back")
                          }
                          placeholder='Upload back'
                          className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                        />
                        {formik.touched.back && formik.errors.back && (
                          <Warning message={formik.errors.back}></Warning>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='px-6 py-3 text-center sm:px-6'>
                    <button
                      type='submit'
                      className='inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme focus:ring-site-theme'
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
