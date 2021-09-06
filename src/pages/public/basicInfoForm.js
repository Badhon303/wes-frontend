import React, { useState, useEffect } from "react"
import * as FetchApi from "../../libs/FetchApi"
import { BASE_URL } from "../../constants"
import Swal from "sweetalert2"
import { useFormik } from "formik"
import UserManager from "../../libs/UserManager"
import Warning from "../../components/Message/warning"
import { CountryDropdown } from "react-country-region-selector"
import { useHistory } from "react-router-dom"
import Loader from "react-loader-spinner"

const REDIRECT_AFTER_VERIFICATION = "/buy"

const VERIFICATION_TYPE_NID = 1
const VERIFICATION_TYPE_PASSPORT = 2
const VERIFICATION_TYPE_DRIVING_LICENSE = 3

const validate = (values) => {
  const errors = {}
  const {
    firstName,
    nickName,
    lastName,
    zipcode,
    phone,
    state,
    dob,
    gender,
    street,
    address,
    city,
    country,
  } = values

  if (!nickName) {
    errors.nickkNme = "Required"
  } else if (!(nickName.length >= 3 && nickName.length < 30)) {
    errors.nickName = "Must be greater than 3 and less than 30 characters"
  }

  if (!firstName) {
    errors.firstName = "Required"
    // } else if (!(firstName.length >= 8 && firstName.length < 200)) {
    //     errors.firstName = 'Must be greater than 8 characters and less than 200 ';
  } else if (!/^[a-zA-Z]+[.]*$/i.test(values.firstName)) {
    errors.firstName = "Firstname contains characters and dot only"
  }

  if (!lastName) {
    errors.lastName = "Required"
    // } else if (!(firstName.length >= 8 && firstName.length < 200)) {
    //     errors.firstName = 'Must be greater than 8 characters and less than 200 ';
  } else if (!/^[a-zA-Z, ]*$/i.test(values.lastName)) {
    errors.lastName = "Lastname contains characters only"
  }

  // if (!middleName) {
  //     errors.middleName = 'Required';
  //     // } else if (!(firstName.length >= 8 && firstName.length < 200)) {
  //     //     errors.firstName = 'Must be greater than 8 characters and less than 200 ';
  // }

  if (!dob) {
    errors.dob = "Required"
  } else {
    const selectedDate = new Date(dob)
    const todaysdate = new Date()
    todaysdate.setHours(0, 0, 0, 0)
    if (!(selectedDate.getTime() < todaysdate.getTime())) {
      errors.dob = "Date of birth must not be toady and forward"
    }
  }

  if (!gender) {
    errors.gender = "Required"
  }
  // if(!spouseName){
  //     errors.spouseName = 'Required';
  // }

  if (!zipcode) {
    errors.zipcode = "Please type a correct Postal/Zip Code"
  } else if (!/^[0-9]+(-[0-9]+)?$/i.test(values.zipcode)) {
    errors.zipcode = "Zipcode can only"
  }

  // if (!nationalId) {
  //     errors. nationalId = 'Please provide your National Id number';
  // }
  else if (!/^[0-9]{13}$|^([a-zA-Z]{2}-[0-9]+)?$/i.test(values.nationalId)) {
    errors.nationalId =
      "National Id can only be 13 characters, numbers, and hyphen"
  }

  if (!state) {
    errors.state = "Required"
  }
  if (!phone) {
    errors.phone = "Required"
  } else if (!/^[0][1-9]\d{9}$|^[1-9]\d{9}$/i.test(values.phone)) {
    errors.phone = "Please enter 11 numbers"
  }

  if (!city) {
    errors.city = "Required"
  }
  if (!street) {
    errors.street = "Required"
  }

  // console.log(errors, values, "errors");

  return errors
}

// {
//     "firstName": "Naushad",
//     "middleName": "Hossain",
//     "nickName": "Nitul",
//     "gender": "hiza",
//     "dob": "1995-14-1",
//     "nationality": "Bangladesh",
//     "spouseName": "Moushumi",
//     "phone": "01521106768",
//     "nationalId": "564789123",
//     "street": "32/A",
//     "city": "Dhaka",
//     "state": "Dhaka",
//     "zipcode": "1204",
//     "photo": "naushad_photo.jpg"
// }

export default function BasicInfoForm(props) {
  const user = UserManager.getLoggedInUser()
  const [step, setStep] = useState(props.basicFormStepperSet)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setStep(props.basicFormStepperSet)
  }, [props.basicFormStepperSet])

  let history = useHistory()

  const [country, setCountry] = useState(
    user && user.nationality ? user.nationality : "United States"
  )

  function handleCountryValue(e) {
    setCountry(e)
    formik.handleChange(e)
  }

  const formik = useFormik({
    initialValues: {
      nationality: country,
      firstName:
        props.userInfo && props.userInfo.firstName
          ? props.userInfo.firstName
          : "",
      middleName:
        props.userInfo && props.userInfo.middleName
          ? props.userInfo.middleName
          : "",
      lastName:
        props.userInfo && props.userInfo.lastName
          ? props.userInfo.lastName
          : "",
      nickName: user && user.nickName ? user.nickName : "",
      dob:
        props.userInfo && props.userInfo.dob
          ? new Date(props.userInfo.dob)
          : "",
      phone: props.userInfo && props.userInfo.phone ? props.userInfo.phone : "",
      spouseName:
        props.userInfo && props.userInfo.spouseName
          ? props.userInfo.spouseName
          : "",
      nationalId:
        props.userInfo && props.userInfo.nationalId
          ? props.userInfo.nationalId
          : "",
      gender:
        props.userInfo && props.userInfo.gender ? props.userInfo.gender : "",
      zipcode:
        props.userInfo && props.userInfo.zipcode ? props.userInfo.zipcode : "",
      state: props.userInfo && props.userInfo.state ? props.userInfo.state : "",
      city: props.userInfo && props.userInfo.city ? props.userInfo.city : "",
      street:
        props.userInfo && props.userInfo.street ? props.userInfo.street : "",
      photo: user && user.photo ? user.photo : "",

      // ...(props.userInfo || {})
    },
    validate,
    onSubmit: (values) => {
      if (country) {
        values.nationality = country
      }
      if (values.nationalId) {
        values.nationalId = values.nationalId.toString()
      }

      setLoading(true)

      FetchApi.sendPutRequest(`/users/${user.id}`, values, { credential: true })
        .then((response) => {
          if (response.code === 401) history.push("/signin")
          else if (response.code !== 400 && response.ok) {
            // console.log(response.data.data);
            setLoading(false)
            UserManager.setLoggedInUser(response.data.data)
            // history.push(REDIRECT_AFTER_SIGNIN);
            // Swal.fire({
            //     title: "Congratulations",
            //     text: "Your personal information has been submitted.",
            //     confirmButtonColor: '#ff8c00',
            //     confirmButtonText: 'Okay',
            // });

            props.cb && props.cb(true)
          } else {
            setLoading(false)
            Swal.fire({
              title: response.err.statusText,
              text: response.data.message,
              confirmButtonColor: "#ff8c00",
              confirmButtonText: "Back",
            })
            // props.cb && props.cb(false);
          }
        })
        .catch((err) => {
          Swal.fire("Error", err.message, "error")
          // props.cb && props.cb(false);
        })
    },
  })

  // function directSubmit(e) {
  //     // props.cb && props.cb(true);

  //     e.preventDefault();
  //     setLoading(true)
  //     let { values, errors } = formik;
  //     // if (Object.entries(errors).length) {
  //     //     console.log(errors);
  //     //     return;
  //     // }

  // }

  function handleSubStepper() {
    setStep(2)
    props.subStepper(2)
  }

  return (
    <div className='flex items-center   '>
      <div>
        <p className='text-lg font-bold text-left text-gray-500 pb-4'>
          {props.title}{" "}
        </p>

        <form
          onSubmit={(e) => {
            // console.log("submitting form");
            formik.handleSubmit(e)
          }}
        >
          {step == 1 && (
            <div className='grid grid-cols-6 gap-x-2 gap-y-4'>
              <div className='col-span-6 sm:col-span-6'>
                <p className=' text-base font-medium text-left pt-t pb-4'>
                  Basic Info{" "}
                </p>

                <p className='text-sm font-normal text-left  '>
                  <span className='text-red-600 pt-2 mr-1'>*</span>Nationality{" "}
                </p>
                <div className=' py-1 w-full '>
                  <CountryDropdown
                    value={country}
                    onChange={handleCountryValue}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontSize: 18,
                      // width:'200px',
                    }}
                    tabIndex={1000}
                    disabled={false}
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                  {formik.touched.country && formik.errors.country && (
                    <Warning message={formik.errors.country}></Warning>
                  )}
                </div>
              </div>

              <div className='col-span-6 sm:col-span-2'>
                <label
                  htmlFor='first_name'
                  className='block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>First name
                </label>
                <input
                  id='firstName'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  placeholder='First name'
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <Warning message={formik.errors.firstName}></Warning>
                )}
              </div>

              <div className='col-span-6 sm:col-span-2'>
                <label
                  htmlFor='middleName'
                  className='py-1 block text-sm  text-gray-700'
                >
                  Middle name
                </label>
                <input
                  id='middleName'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.middleName}
                  placeholder='Middle name'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
              </div>
              <div className='col-span-6 sm:col-span-2'>
                <label
                  htmlFor='lastName'
                  className='py-1 block text-sm text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>Last Name
                </label>

                <input
                  id='lastName'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  placeholder='Last name'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <Warning message={formik.errors.lastName}></Warning>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='nickName'
                  className='py-1 block text-sm text-gray-700 py-1'
                >
                  Nick Name
                </label>

                <input
                  id='nickName'
                  disabled
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={user && user.nickName}
                  placeholder='Nick name'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {/*{formik.touched.nickName && formik.errors.nickName && (<Warning message={formik.errors.nickName}></Warning>)}*/}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='spouseName'
                  className='py-1 block text-sm text-gray-700 py-1'
                >
                  Spouse Name
                </label>

                <input
                  id='spouseName'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.spouseName}
                  placeholder='Spouse Name'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='dob'
                  className='py-1 block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>Date of birth
                </label>

                <input
                  id='dob'
                  type='date'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={
                    formik.values.dob
                      ? new Date(formik.values.dob).toISOString().substr(0, 10)
                      : ""
                  }
                  placeholder='Date of birth'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.dob && formik.errors.dob && (
                  <Warning message={formik.errors.dob}></Warning>
                )}
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='gender'
                  className='py-1 block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>
                  Gender
                </label>
                <select
                  id='gender'
                  name='gender'
                  onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  value={formik.values.gender}
                  placeholder='Gender'
                  className=' cursor-pointer border-2 px-2  py-2 w-full text-sm text-black bg-white rounded-md focus:outline-none focus:bg-white focus:text-gray-900'
                >
                  <option value=''>Select gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <Warning message={formik.errors.gender} />
                )}
              </div>

              <div className=' col-span-6 sm:col-span-6 '>
                <label
                  htmlFor='phone'
                  className='block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>Phone No
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  name='phone'
                  id='phone'
                  value={formik.values.phone}
                  placeholder='Phone NO'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.phone && formik.errors.phone && (
                  <Warning message={formik.errors.phone} />
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className='relative grid grid-cols-6 gap-4'>
              <p className='text-base font-medium text-left pt-6 pb-3'>
                {" "}
                Residential Address{" "}
              </p>

              <div className=' col-span-6 sm:col-span-6 '>
                <label
                  htmlFor='nationalId'
                  className='block text-sm  text-gray-700 py-1'
                >
                  National Id
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='number'
                  name='nationalId'
                  id='nationalId'
                  value={formik.values.nationalId}
                  placeholder='National Id'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {/*{formik.touched.nationalId && formik.errors.nationalId && (*/}
                {/*<Warning message={formik.errors.nationalId}></Warning>)}*/}
              </div>

              <div className=' col-span-6 sm:col-span-3 '>
                <label
                  htmlFor='zipcode'
                  className='block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>ZIP / Postal
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='string'
                  name='zipcode'
                  id='zipcode'
                  value={formik.values.zipcode}
                  autoComplete='postal-code'
                  placeholder='Zip/Postal code'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.zipcode && formik.errors.zipcode && (
                  <Warning message={formik.errors.zipcode}></Warning>
                )}
              </div>
              <div className='col-span-6 sm:col-span-3 '>
                <label
                  htmlFor='city'
                  className='block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>City
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  name='city'
                  id='city'
                  value={formik.values.city}
                  placeholder='Enter city'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.city && formik.errors.city && (
                  <Warning message={formik.errors.city}></Warning>
                )}
              </div>
              {loading && (
                <Loader
                  type='Circles'
                  color='#ff8c00'
                  height={100}
                  width={100}
                  timeout={7000} //7 secs
                  className=' inline-block align-middle absolute mt-16 justify-center items-center z-50  '
                />
              )}

              <div className='col-span-6 sm:col-span-3 '>
                <label
                  htmlFor='city'
                  className='block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>State
                </label>

                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  name='state'
                  id='state'
                  value={formik.values.state}
                  placeholder='Enter state'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.state && formik.errors.state && (
                  <Warning message={formik.errors.state}></Warning>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3 '>
                <label
                  htmlFor='city'
                  className='block text-sm  text-gray-700 py-1'
                >
                  <span className='text-red-600 pt-2 mr-1'>*</span>Street
                </label>

                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  name='street'
                  id='street'
                  value={formik.values.street}
                  placeholder='Enter street'
                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                />
                {formik.touched.street && formik.errors.street && (
                  <Warning message={formik.errors.street}></Warning>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <button
              onClick={handleSubStepper}
              className='bg-site-theme  mt-6 w-full text-white active:bg-green-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none '
              type='button'
              style={{ transition: "all .15s ease" }}
            >
              Continue
            </button>
          )}
          {step === 2 && (
            <button
              type='submit'
              className='bg-site-theme  mt-6 w-full text-white active:bg-green-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none '
              style={{ transition: "all .15s ease" }}
            >
              Continue
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
