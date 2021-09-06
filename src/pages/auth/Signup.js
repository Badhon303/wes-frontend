import { useFormik, Field, FormikProvider } from "formik"
import { Link, useHistory } from "react-router-dom"
import isValidEmail from "../../libs/validator/email"
import Navbar2 from "../../components/Header/Navbar2"
import React, { useState } from "react"
import emailIcon from "../../image/icons/email.svg"
import nameIcon from "../../image/icons/name.svg"
import passwordIcon from "../../image/icons/passwrod.svg"
import Swal from "sweetalert2"
import AuthAPI from "../../apis/auth"
// import Cookie from "js-cookie"
import UserManager from "../../libs/UserManager"
import Loader from "react-loader-spinner"
// import BTAccountSuccess from "./btAccountSuccess"
// import { toast } from "../../components/Toast/toast"
// import * as Yup from "yup"

const REDIRECT_AFTER_SIGNUP = "profile/verify"

const validate = (values) => {
  const errors = {}
  const { nickName, password, email, termsOfUse } = values

  if (!nickName) {
    errors.nickName = "Required"
  } else if (!/^[a-zA-Z]+$/i.test(values.nickName)) {
    errors.nickName = "Nickname contains characters only"
  }
  // else if (!(nickName.length >= 3 && nickName.length < 30)) {
  //     errors.nickName = 'Must be greater than 3 and less than 30 characters';
  // }

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

  if (!email) {
    errors.email = "Required"
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address"
  }

  if (termsOfUse !== true) {
    errors.termsOfUse = "I agree to WES-Wallet's Terms"
  }

  return errors
}

function getQueryParams() {
  let url = window.location.href.split("#")[0]
  let queryString = url.substring(url.indexOf("?") + 1)
  return queryString.split("&").map((q) => q.split("="))
}

function Signup() {
  let queries = getQueryParams()
  let referrerId = queries.find((query) => query[0] === "id")
  const [btc, setBtc] = useState(null)
  const [ether, setEther] = useState(null)
  const [loading, setLoading] = useState(false)
  const [termsOfUse, setTermsOfUse] = useState(false)

  let nickName = queries.find((query) => query[0] === "nickName")

  let history = useHistory()
  // const dispatch = useDispatch();
  let user = UserManager.getLoggedInUser()

  function redirectAfterSignup(user) {
    if (user.role === "admin") {
      history.push("/users")
    } else {
      history.push(REDIRECT_AFTER_SIGNUP)
    }
  }

  const handleOnChange = () => {
    setTermsOfUse(!termsOfUse)
  }
  if (user) {
    redirectAfterSignup(user)
    return <></>
  }

  const formik = useFormik({
    initialValues: {
      nickName: "",
      email: "",
      password: "",
      termsOfUse: false,
    },
    validate,
    handleOnChange,
    onSubmit: (values) => {
      // console.log("signup values: ", values)
      setLoading(true)
      AuthAPI.signup(values, referrerId ? referrerId[1] : null)
        .then((response) => {
          setLoading(false)
          if (response.ok) {
            //B edited
            Swal.fire({
              title: "Congrats!",
              text: "You have successfully created an account.A verification email has been sent to your email address. Account will be created after the verification completed.",
              icon: "success",
              confirmButtonText: "OK",
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                // props.reloadData();
                // handleModalCallback();
                history.push("/Signin")
              }
            })
            //B edited closed
            // setBtc(response.data.result.btcAccount.privateKey.bn);
            // setEther(response.data.result.ethAccount.privateKey);
            // console.log("Bresponse: ", response);
          } else {
            Swal.fire({
              title: response.err.statusText,
              text: response.data.message,
              confirmButtonColor: "#ff8c00",
              confirmButtonText: "Back",
            })
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            text: err.message,
            confirmButtonColor: "#ff8c00",
            confirmButtonText: "Back",
          })
        })
    },
  })

  return (
    <div className='bg-site-theme h-48 lg:h-64'>
      <div className='my-2 '>
        <Navbar2 />
      </div>
      <div className='py-6 md:py-12 text-center text-xl md:text-2xl font-bold text-white'></div>

      {!btc && !ether && (
        <form onSubmit={formik.handleSubmit}>
          <div className='bg-white rounded-t-xl  w-full md:w-90 xl:w-90 2xl:w-70 md:border-t-1  items-center justify-center md:mx-auto '>
            <div className='py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  '>
              <div className='mx-auto p-4  mt-12 mb-4 bg-white shadow rounded-2xl'>
                <h2 className='pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center '>
                  Sign up
                </h2>

                {nickName && (
                  <div className='w-100 m-3 pb-4'>
                    <div className='bg-gray-50  text-gray-700 focus-within:text-gray-400'>
                      <p className='block font-bold border-2 bg-gray-50 py-2 w-full text-sm text-black  rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900'>
                        Referred by<span className='pl-1'>{nickName[1]}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className='w-100 m-3'>
                  <div className='bg-gray-200 relative text-gray-600 focus-within:text-gray-400'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                      <button
                        type='submit'
                        className='p-1 focus:outline-none focus:shadow-outline'
                        tabIndex='-1'
                      >
                        <img src={nameIcon} className='w-6  h-6 ' />
                      </button>
                    </span>
                    <input
                      type='text'
                      onChange={formik.handleChange}
                      value={formik.values.nickName}
                      name='nickName'
                      id='nickName'
                      aria-describedby='sign-in-nickName'
                      placeholder='Enter your nickname'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900'
                      autoComplete='off'
                    />
                  </div>

                  {formik.touched.nickName && formik.errors.nickName && (
                    <div className='mt-2 px-2 text-sm bg-red-100 py-2 text-red-700'>
                      {formik.errors.nickName}
                    </div>
                  )}
                </div>
                <div className='w-100 m-3 pt-4'>
                  <div className='bg-gray-200 relative text-gray-600 focus-within:text-gray-400'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                      <button
                        type='submit'
                        className='p-1 focus:outline-none focus:shadow-outline'
                        tabIndex='-1'
                      >
                        <img src={emailIcon} className='w-6  h-6 ' />
                      </button>
                    </span>
                    <input
                      type='text'
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      name='email'
                      id='email'
                      aria-describedby='sign-in-email'
                      placeholder='Enter your email'
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900'
                      autoComplete='off'
                    />
                  </div>

                  {formik.touched.email && formik.errors.email && (
                    <div className='mt-2 px-2 text-sm bg-red-100 py-2 text-red-700'>
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                {loading && (
                  <div className='relative flex items-center justify-center '>
                    <Loader
                      type='Circles'
                      color='#ff8c00'
                      height={100}
                      width={100}
                      // timeout={6000} //3 secs
                      className=' inline-block align-middle absolute  z-50  '
                    />
                  </div>
                )}

                <div className='w-100 m-3 pt-4'>
                  <div className='relative  bg-gray-200 text-gray-600 focus-within:text-gray-400'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                      <button
                        type='submit'
                        className='p-1 focus:outline-none focus:shadow-outline'
                        tabIndex='-1'
                      >
                        <img src={passwordIcon} className='w-6  h-6 ' />
                      </button>
                    </span>
                    <input
                      type='password'
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900'
                      name='password'
                      id='password'
                      aria-describedby='sign-in-password'
                      placeholder='Enter your password'
                    />
                  </div>

                  {formik.touched.password && formik.errors.password && (
                    <div className='mt-2 px-2 text-sm bg-red-100 py-2 text-red-700'>
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className='m-3 pt-6 flex justify-between'>
                  <div className='inline '>
                    {/*<input type="checkbox" className="" id="rememberMe"/>*/}
                    {/*<label className="text-outline-color cursor-pointer  ml-2" htmlFor="rememberMe">Remember*/}
                    {/*me</label>*/}
                  </div>
                  <Link to='/forgot-password'>
                    {" "}
                    <span className=' text-lg text-site-theme hover:underline hover:text-red-400'>
                      Forgot password ?
                    </span>
                  </Link>
                </div>

                <div className='mt-4 mb-4 md:mb-8 flex justify-center'>
                  <div>
                    <span className='text-base pr-2  '>
                      Already have account?
                    </span>{" "}
                    <Link
                      className='text-site-theme hover:underline hover:text-red-400'
                      to='/signin'
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
                <div className='mt-4 mb-4 flex justify-center'>
                  <label className='flex items-center'>
                    <FormikProvider value={formik}>
                      <Field
                        type='checkbox'
                        name='termsOfUse'
                        className='form-checkbox'
                        // onChange={formik.handleOnChange}
                        // value={true}
                        // checked={termsOfUse}
                      />
                      {/* {`${formik.values.termsOfUse}`} */}
                      <span className='ml-2'>
                        I agree to the{" "}
                        <span>
                          {" "}
                          <Link
                            className='text-site-theme hover:underline hover:text-red-400'
                            to='/terms-of-use'
                            target='_blank'
                          >
                            Terms of Use
                          </Link>
                        </span>
                      </span>
                    </FormikProvider>
                  </label>
                </div>
                {formik.touched.termsOfUse && formik.errors.termsOfUse && (
                  <div className='mt-2 px-2 text-sm bg-red-100 py-2 text-red-700 text-center'>
                    {formik.errors.termsOfUse}
                  </div>
                )}
              </div>

              <div className='text-center items-center justify-center -mt-6 '>
                <button
                  type='submit'
                  className='w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md disabled:opacity-60'
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      {/* {btc && ether && <BTAccountSuccess btc={btc} ether={ether} />} */}
    </div>
  )
}

export default Signup
