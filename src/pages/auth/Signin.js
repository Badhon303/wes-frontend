import { useFormik } from "formik";
import { Link, useHistory } from "react-router-dom";
import isValidEmail from "../../libs/validator/email";
import React, { useState, useEffect } from "react";
import Navbar2 from "../../components/Header/Navbar2";
import emailIcon from "../../image/icons/email.svg";
import passwordIcon from "../../image/icons/passwrod.svg";
import AuthAPI from "../../apis/auth";
import Cookie from "js-cookie";
import Swal from "sweetalert2";
import UserManager from "../../libs/UserManager";
import Loader from "react-loader-spinner";
import CountDown from "../../components/timer/CountDown";

const REDIRECT_AFTER_SIGNIN = "/dashboard";

const validate = (values) => {
  const errors = {};
  const { email, password } = values;

  if (!password) {
    errors.password = "Required";
  }

  // else if (!(password.length >= 3 && password.length < 9)) {
  //     errors.password = 'Must be between 4 to 8 characters and at least 1 character and 1 numeric number ';
  // }
  else if (
    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{4,8}$/i.test(values.password)
  ) {
    errors.password =
      "Must be between 4 to 8 characters and at least 1 character and 1 numeric number";
  }

  if (!email) {
    errors.email = "Required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

export default function Signin() {
  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(false);
  const [userMail, setUserMail] = useState("");
  const [otpValue, setOtpValue] = useState("");

  let user = UserManager.getLoggedInUser();

  function redirectAfterLogin(user) {
    if (user && user.role === "admin") {
      history.push("/dashboard");
    } else {
      history.push(REDIRECT_AFTER_SIGNIN);
    }
  }

  if (user) {
    redirectAfterLogin(user);
    return <></>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let values = {
      email: userMail.toString(),
      otp: otpValue.toString(),
    };
    if (!values.otp) {
      alert("please provide OTP");
    }
    // console.log("otp user: ", values);
    setLoading(true);
    localStorage.removeItem("auth-user");
    AuthAPI.OTP(values)
      .then((response) => {
        // console.log("otp response: ", response);
        setLoading(false);
        if ((response.code = 200)) {
          // console.log(response)
          const { user, tokens } = response.data;
          Cookie.set("access-token", tokens.access.token, {
            expires: new Date(tokens.access.expires),
          });
          Cookie.set("refresh-token", tokens.refresh.token, {
            expires: new Date(tokens.refresh.expires),
          });
          UserManager.setLoggedInUser(user);

          AuthAPI.refreshToken({ refreshToken: tokens.refresh.token })
            .then((res) => {
              if (res.ok) {
                let accessToken = res.data.access;
                Cookie.set("access-token", accessToken.token, {
                  expires: new Date(accessToken.expires),
                });
              }
            })
            .finally(() => {
              redirectAfterLogin(user);
            });
        } else {
          Swal.fire({
            title: response.err.statusText,
            text: response.data.message,
            confirmButtonColor: "#ff8c00",
            confirmButtonText: "Back",
          });
        }
      })
      .catch((err) => {
        Swal.fire("Error", "Wrong OTP", "error");
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setLoading(true);
      AuthAPI.signin(values)
        .then((response) => {
          setLoading(false);
          if (response.ok) {
            setUserMail(values.email);
            setOtp(true);
          } else {
            Swal.fire({
              title: response.err.statusText,
              text: response.data.message,
              confirmButtonColor: "#ff8c00",
              confirmButtonText: "Back",
            });
          }
        })
        .catch((err) => {
          Swal.fire("Error", err.message, "error");
        });
    },
  });

  return (
    <div className="bg-site-theme h-48 lg:h-64">
      <div className="bg-site-theme h-6" />
      <div className="my-2 ">
        <Navbar2 />
      </div>
      <div className="py-6 md:py-12 text-center text-xl md:text-2xl font-bold text-white ">
        {" "}
      </div>
      {!otp && (
        <form onSubmit={formik.handleSubmit}>
          <div className="bg-white rounded-t-xl  w-full md:w-90 xl:w-90 2xl:w-70 md:border-t-1  items-center justify-center md:mx-auto ">
            <div className="py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  ">
              <div className="mx-auto p-4  mt-12 mb-2 bg-white shadow rounded-2xl">
                <h2 className="pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center ">
                  Sign In
                </h2>

                <div className="w-100 m-3">
                  <div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <div
                        className="p-1 focus:outline-none focus:shadow-outline"
                        tabIndex="-1"
                      >
                        <img src={emailIcon} className="w-6  h-6 " />
                      </div>
                    </span>
                    <input
                      type="email"
                      onChange={formik.handleChange}
                      //    onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                      name="email"
                      id="email"
                      aria-describedby="sign-in-email"
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                  </div>

                  {formik.touched.email && formik.errors.email && (
                    <div className="bg-red-100 my-2 py-2 text-red-700">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {loading && (
                  <div className="relative flex items-center justify-center ">
                    <Loader
                      type="Circles"
                      color="#ff8c00"
                      height={100}
                      width={100}
                      timeout={4000} //3 secs
                      className=" inline-block align-middle absolute  z-50  "
                    />
                  </div>
                )}

                <div className="m-3 pt-4">
                  <div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <div
                        className="p-1 focus:outline-none focus:shadow-outline"
                        tabIndex="-1"
                      >
                        <img src={passwordIcon} className="w-6  h-6 " />
                      </div>
                    </span>
                    <input
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                      name="password"
                      id="password"
                      aria-describedby="sign-in-password"
                      placeholder="Enter your password"
                    />
                  </div>

                  {formik.touched.password && formik.errors.password && (
                    <div className="my-2 bg-red-100 py-2 text-red-700">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="m-3 pt-6 flex justify-between">
                  <div className="inline ">
                    {/*<input type="checkbox" className="" id="rememberMe"/>*/}
                    {/*<label className="text-outline-color cursor-pointer  ml-2" htmlFor="rememberMe">Remember*/}
                    {/*me</label>*/}
                  </div>
                  <Link to="/forgot-password">
                    {" "}
                    <span className=" text-lg text-site-theme hover:underline hover:text-red-400">
                      Forgot password ?
                    </span>
                  </Link>
                </div>

                <div className="mt-4 mb-4 md:mb-8 flex justify-center">
                  <div>
                    <span className="text-base pr-2  ">
                      Don't have account?
                    </span>{" "}
                    <Link
                      className="text-site-theme hover:underline hover:text-red-400"
                      to="/signup"
                    >
                      Signup
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center items-center justify-center -mt-6">
                <button
                  type="submit"
                  className="focus:outline-none w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md"
                >
                  Send OTP
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      {otp && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-t-xl  w-full md:w-90 xl:w-90 2xl:w-70 md:border-t-1  items-center justify-center md:mx-auto ">
            <div className="py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-2/7 sm:w-full md:w-3/7 xl:w-2/7 items-center justify-center md:mx-auto  ">
              <div className="mx-auto p-4  mt-12 mb-2 bg-white shadow rounded-2xl">
                <h2 className="pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center ">
                  Sign In
                </h2>

                <body>
                  <div className="mt-4 mb-4 md:mb-8 flex justify-center">
                    <h1 className="items-center justify-center md:mx-auto">
                      <CountDown minutes={2} seconds={0} />
                    </h1>
                  </div>
                </body>

                <div className="w-100 m-3">
                  <div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <div
                        className="p-1 focus:outline-none focus:shadow-outline"
                        tabIndex="-1"
                      >
                        {/* <img src={emailIcon} className="w-6  h-6 " /> */}
                      </div>
                    </span>
                    <input
                      type="text"
                      //    onBlur={formik.handleBlur}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                      name="otp"
                      id="otp"
                      aria-describedby="sign-in-otp"
                      placeholder="Enter OTP"
                      autoComplete="off"
                    />
                  </div>

                  {/* {formik2.touched.otp && formik2.errors.otp && (
                    <div className="bg-red-100 my-2 py-2 text-red-700">
                      {formik2.errors.otp}
                    </div>
                  )} */}
                </div>

                {loading && (
                  <div className="relative flex items-center justify-center ">
                    <Loader
                      type="Circles"
                      color="#ff8c00"
                      height={100}
                      width={100}
                      timeout={4000} //3 secs
                      className=" inline-block align-middle absolute  z-50  "
                    />
                  </div>
                )}

                <div className="m-3 pt-6 flex justify-between">
                  <div className="inline ">
                    {/*<input type="checkbox" className="" id="rememberMe"/>*/}
                    {/*<label className="text-outline-color cursor-pointer  ml-2" htmlFor="rememberMe">Remember*/}
                    {/*me</label>*/}
                  </div>
                  <Link to="/forgot-password">
                    {" "}
                    <span className=" text-lg text-site-theme hover:underline hover:text-red-400">
                      Forgot password ?
                    </span>
                  </Link>
                </div>

                <div className="mt-4 mb-4 md:mb-8 flex justify-center">
                  <div>
                    <span className="text-base pr-2  ">
                      Don't have account?
                    </span>{" "}
                    <Link
                      className="text-site-theme hover:underline hover:text-red-400"
                      to="/signup"
                    >
                      Signup
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center items-center justify-center -mt-6">
                <button
                  type="submit"
                  // value="submit"
                  className="focus:outline-none w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
