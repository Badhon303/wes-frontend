import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import { signup } from "../../apis/auth"
import Swal from "sweetalert2"
import isValidEmail from "../../libs/validator/email"
import Warning from "../../components/Message/warning"
import * as FetchApi from "../../libs/FetchApi"
import { BASE_URL } from "../../constants"
import Cookies from "js-cookie"
import Loader from "react-loader-spinner"

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

const validate = (values) => {
  const errors = {}
  const { nickName, email, password } = values

  if (!nickName) {
    errors.nickName = "Required"
  } else if (!/^[a-zA-Z]+$/i.test(values.nickName)) {
    errors.nickName = "Nickname contains characters only"
  }

  if (!email) {
    errors.email = "Required"
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address"
  }

  if (!password) {
    errors.password = "Required"
  }
  // else if (!(password.length >= 3 && password.length < 9)) {
  //     errors.password = 'Must be between 4 to 8 characters and at least 1 character and 1 numeric number ';
  // }
  else if (
    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{4,8}$/i.test(values.password)
  ) {
    errors.password =
      "Must be between 4 to 8 characters and at least 1 character and 1 numeric number"
  }

  // console.log(errors);

  return errors
}

export default function UserCreateModal(props) {
  const [showModal, setShowModal] = useState(props.showModal)
  const [user, setUser] = useState(props && props.userData)
  const [loading, setLoading] = useState(false)

  function handleModalCallback() {
    setShowModal(false)
    props.modalShow(false)
  }

  const formik = useFormik({
    initialValues: {
      nickName: user && user.nickName ? user.nickName : "",
      email: user && user.email ? user.email : "",
      password: user && user.password ? user.password : "",
    },
    validate,
    onSubmit: (values) => {
      // UserAPI.createUser(values).then(res => { handleSuccess() }).catch(err => { handleError() });
      setLoading(true)
      FetchApi.sendPostRequest("/users", values, { credential: true })
        .then((res) => {
          if (res.ok) {
            setLoading(false)

            // console.log(res,'res ')
            // success
            // Swal.fire('User Created', 'User has been created successfully', 'success');
            // formik.resetForm();
            props.onClose(res)
          } else {
            // handle err
            Swal.fire("Error e", res.data.message, "error")
          }
        })
        .catch((err) => {
          // something unwanted happened
          Swal.fire("Error b", err.message, "error")
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  return (
    <>
      {showModal ? (
        <>
          <div
            className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
            // onClick={handleModalCallback}
          >
            <div className='relative  w-4/5 md:w-auto lg:w-1/3 my-8 mx-auto max-w-3xl '>
              {/*content*/}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                {/*header*/}
                <div className='flex items-start justify-between border-solid border-gray-300 rounded-t'>
                  <div
                    className='p-2 cursor-pointer'
                    onClick={handleModalCallback}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      height='24'
                      viewBox='0 0 24 24'
                      width='24'
                    >
                      <path d='M0 0h24v24H0z' fill='none' />
                      <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
                    </svg>
                  </div>
                  <div
                    className='px-6 py-2 ml-auto cursor-pointer '
                    onClick={handleModalCallback}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      height='24'
                      viewBox='0 0 24 24'
                      width='24'
                    >
                      <path d='M0 0h24v24H0V0z' fill='none' />
                      <path d='M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
                    </svg>
                  </div>
                </div>
                {/*body*/}

                <div className='mt-10 sm:mt-0 w-full px-6 '>
                  {loading && (
                    <div className='flex justify-center items-center'>
                      <Loader
                        type='Circles'
                        color='#ff8c00'
                        height={100}
                        width={100}
                        timeout={7000} //3 secs
                        className=' inline-block align-middle absolute  z-50  '
                      />
                    </div>
                  )}

                  <div className='md:grid md:grid-cols-3 md:gap-6'>
                    <div className='mt-5 md:mt-0 md:col-span-3'>
                      <form onSubmit={formik.handleSubmit}>
                        <div className='shadow overflow-hidden sm:rounded-md'>
                          <div className='px-4 py-5 bg-white sm:p-6'>
                            <div className='grid grid-cols-6 gap-6'>
                              <div className='col-span-12'>
                                <label
                                  htmlFor='nickName'
                                  className='block text-sm font-medium text-gray-700 py-1 '
                                >
                                  Nick Name
                                </label>
                                <input
                                  id='nickName'
                                  type='text'
                                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                                  onChange={formik.handleChange}
                                  disabled={!props.edit}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.nickName}
                                  placeholder='Enter Nick name'
                                />
                                {formik.touched.nickName &&
                                  formik.errors.nickName && (
                                    <Warning
                                      message={formik.errors.nickName}
                                    ></Warning>
                                  )}
                              </div>
                              <div className='col-span-12'>
                                <label
                                  htmlFor='email'
                                  className='block text-sm font-medium text-gray-700 py-1'
                                >
                                  Email
                                </label>
                                <input
                                  id='email'
                                  type='email'
                                  autoComplete='new-password'
                                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                                  onChange={formik.handleChange}
                                  disabled={!props.edit}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.email}
                                  placeholder='Enter email'
                                />
                                {formik.touched.email &&
                                  formik.errors.email && (
                                    <Warning
                                      message={formik.errors.email}
                                    ></Warning>
                                  )}
                              </div>
                              <div className='col-span-12'>
                                <label
                                  htmlFor='password'
                                  className='block text-sm font-medium text-gray-700 py-1'
                                >
                                  Password
                                </label>
                                <input
                                  id='password'
                                  type='password'
                                  autoComplete='new-password'
                                  className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900'
                                  onChange={formik.handleChange}
                                  disabled={!props.edit}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.password}
                                  placeholder='Enter password'
                                />
                                {formik.touched.password &&
                                  formik.errors.password && (
                                    <Warning
                                      message={formik.errors.password}
                                    ></Warning>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className='px-6 py-3 bg-gray-50 text-center sm:px-6'>
                            <button
                              type='submit'
                              disabled={loading}
                              className='inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme focus:ring-site-theme'
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='opacity-50 fixed inset-0 z-40 bg-black' />
        </>
      ) : null}
    </>
  )
}
