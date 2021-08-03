import React, {useState} from 'react'
import { useFormik } from 'formik'
import isValidEmail from '../../libs/validator/email'
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar2 from "../../components/Header/Navbar2";
import emailIcon from "../../image/icons/email.svg";
import AuthAPI from '../../apis/auth';
import Loader from "react-loader-spinner";

const REDIRECT_AFTER_PASS_FORGET = '/signin';

function validate(values) {
  const { email } = values;
  const errors = {};

  if (!email) {
    errors.email = 'Required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email';
  }

  return errors;
}

const PasswordForgot = (props) => {

  const history = useHistory();
    const [loading, setLoading] = useState(false);


  const formik = useFormik({
    validate,
    initialValues: {
      email: '',
    },
    onSubmit(data) {
        setLoading(true);
      AuthAPI.forgotPass(data)
        .then((res) => {
            setLoading(false);
          if (res.ok && res.data.success) {
              Swal.fire({
                  title: "Success",
                  text: res.data.message,
                  confirmButtonColor: '#ff8c00',
                  confirmButtonText: 'Okay',
              })

            history.push(REDIRECT_AFTER_PASS_FORGET);
          } else {
              Swal.fire({
                  title: "Error",
                  text: res.data.message,
                  confirmButtonColor: '#ff8c00',
                  confirmButtonText: 'Back',
              })
          }
        }).catch(err => {
          Swal.fire({
              title: "Error",
              text: err.message,
              confirmButtonColor: '#ff8c00',
              confirmButtonText: 'Back',
          })

        });
    }
  })

  return (
      < div className="bg-site-theme h-48 lg:h-64">
          <div className="bg-site-theme h-6"></div>
          <div className="my-2 "><Navbar2/></div>
          <div className="py-6 md:py-12 text-center text-xl md:text-2xl font-bold text-white"> Reset your password
          </div>
          <form className="" onSubmit={formik.handleSubmit}>
              <div
                  className="bg-white rounded-t-xl  w-full md:w-90 xl:w-90 2xl:w-70 md:border-t-1  items-center justify-center md:mx-auto ">
                  <div
                      className="py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  ">
                      <div className="mx-auto p-4  mt-12 mb-2 bg-white shadow rounded-2xl">
                          <h2 className="pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center ">Type your email to reset password</h2>
                          {loading &&
                          <div className="relative flex items-center justify-center ">

                              <Loader
                                  type="Circles"
                                  color="#ff8c00"
                                  height={100}
                                  width={100}
                                  timeout={6000}//3 secs
                                  className=" inline-block align-middle absolute  z-50  "
                              />
                          </div>}
                          <div className="w-100 m-3">

                              <div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                                          <img src={emailIcon} className="w-6  h-6 "/>
                                        </button>
                                      </span>
                                  <input type="text"
                                         onChange={formik.handleChange}
                                         onBlur={formik.handleBlur}
                                         value={formik.values.email}
                                         className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                                         name="email"
                                         id="email"
                                         aria-describedby="sign-in-email"
                                         placeholder="Enter your email"
                                         autoComplete="off"/>
                              </div>

                              {formik.touched.email && formik.errors.email && (
                                  <div className="bg-red-100 text-sm my-2 py-2 text-red-700">{formik.errors.email}</div>)}
                          </div>

                          <div className="mt-12 mb-1 md:mb-2 flex justify-center">
                              <div>
                                  <span className="text-base pr-2  ">Have an account?</span> <Link
                                  className="text-site-theme hover:underline hover:text-red-400"
                                  to="/signin">Sign in</Link>
                              </div>
                          </div>


                          <div className="mt-4 mb-4 md:mb-8 flex justify-center">
                              <div>
                                  <span className="text-base pr-2  ">Don't have account?</span> <Link
                                  className="text-site-theme hover:underline hover:text-red-400"
                                  to="/signup">Signup</Link>
                              </div>
                          </div>
                      </div>

                          <div className="text-center items-center justify-center -mt-6 ">
                              <button type="submit"
                                      className="w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md   ">
                                  Forget Password
                              </button>
                          </div>
                      </div>
              </div>
          </form>
        </div>
  )
}

export default PasswordForgot
