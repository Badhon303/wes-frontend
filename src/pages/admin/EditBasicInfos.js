import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import Warning from "../../components/Message/warning";
import * as FetchApi from "../../libs/FetchApi";
import { BASE_URL } from "../../constants";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import Layout from "../../components/Layout/Layout";
import { CountryDropdown } from "react-country-region-selector";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";

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
  const errors = {};
  const {
    firstName,
    middleName,
    nickName,
    gender,
    dob,
    spouseName,
    phone,
    street,
    city,
    state,
    zipcode,
  } = values;

  if (!nickName) {
    errors.nickkNme = "Required";
  }
  // else if (!(nickName.length >= 3 && nickName.length < 30)) {
  //   errors.nickName = 'Must be greater than 3 and less than 30 characters';
  // }
  else if (!/^[a-zA-Z]+$/i.test(values.nickName)) {
    errors.nickName = "Nickname contains characters only";
  }

  if (!firstName) {
    errors.firstName = "Required";
  }
  // else if (!(firstName.length < 200)) {
  //   errors.firstName = 'Must be less than 200 character';
  // }
  else if (!/^[a-zA-Z]+[.]*$/i.test(values.firstName)) {
    errors.firstName = "Firstname contains characters and dot only";
  }

  if (middleName && middleName.length > 200) {
    errors.middleName = "Must be less than 200 character";
  } else if (!/^$|^[a-zA-Z]+$/i.test(values.middleName)) {
    errors.middleName = "Middlename contains characters only";
  }
  if (!lastName) {
    errors.lastName = "Required";
  }
  if (!gender) {
    errors.gender = "Required";
  } else if (!["male", "female", "other"].includes(gender)) {
    errors.gender = "Gender must be either male, female or other";
  }

  if (!dob) {
    errors.dob = "Required";
  } else {
    const selectedDate = new Date(dob);
    const todaysdate = new Date();
    todaysdate.setHours(0, 0, 0, 0);
    if (!(selectedDate.getTime() < todaysdate.getTime())) {
      errors.dob = "Date of birth must not be toady and forward";
    }
  }
  // else if (new Date(dob).getMilliseconds() >= new Date().getMilliseconds()) {
  //   errors.dob = 'Date of birth must be a date from past';
  // }

  // if (!nationality) {
  //     errors.nationality = 'Required';
  // }

  // if (!spouseName) {
  //   errors.spouseName = 'Required';
  // }

  if (!phone) {
    errors.phone = "Required";
  } else if (!/^[0][1-9]\d{9}$|^[1-9]\d{9}$/i.test(values.phone)) {
    errors.phone = "Please enter 11 numbers";
  }

  // if (!nationalId) {
  //     errors.nationalId = 'Required';
  // }
  // else if (!/^[0-9]{13}$|^([a-zA-Z]{2}-[0-9]+)?$/i.test(values.nationalId)) {
  //     errors.nationalId = 'National Id can only be 13 characters, numbers, and hyphen';
  // }

  if (!street) {
    errors.street = "Required";
  }

  if (!city) {
    errors.city = "Required";
  }

  if (!state) {
    errors.state = "Required";
  }

  if (!zipcode) {
    errors.zipcode = "Required";
  } else if (!/^[0-9]+(-[0-9]+)?$/i.test(values.zipcode)) {
    errors.zipcode = "Zipcode can only contain numbers and hyphen";
  }

  // if (password) {
  //     if (password !== passwordConfirm) {
  //         errors.passwordConfirm = 'Must be same as the \'new password\''
  //     }
  //
  //     // check if password has at least 1 number and other conditions
  // }

  return errors;
};

export default function EditUserBasicInfo(props) {
  const userId = props.userId;
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && !user) getUserInfo(userId);
  }, []);

  const [country, setCountry] = useState(
    user && user.nationality ? user.nationality : ""
  );

  function handleCountryValue(e) {
    setCountry(e);
    formik.handleChange(e);
  }

  const getUserInfo = async (userId) => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
    const data = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: myHeaders,
    });
    const response = await data.json();

    if (response) {
      setLoading(false);

      if (response.code === 401) history.push("/signin");
      else if (response.code === 404)
        console.log("Whoops..", "No user data found", "error");
      else {
        setUser(response.user);
        setCountry(response.user.nationality);
      }
    } else console.log("Whoops..", "No user data found", "error");
  };

  const formik = useFormik({
    initialValues: {
      firstName: user && user.firstName ? user.firstName : "",
      middleName: user && user.middleName ? user.middleName : "",
      nickName: user && user.nickName ? user.nickName : "",
      lastName: user && user.lastName ? user.lastName : "",
      gender: user && user.gender ? user.gender : "",
      dob: user && user.dob ? user.dob : "",
      nationality: user && user.nationality ? user.nationality : "",
      spouseName: user && user.spouseName ? user.spouseName : "",
      phone: user && user.phone ? user.phone : "",
      nationalId: user && user.nationalId ? user.nationalId : "",
      street: user && user.street ? user.street : "",
      city: user && user.city ? user.city : "",
      state: user && user.state ? user.state : "",
      zipcode: user && user.zipcode ? user.zipcode : "",
      photo: user && user.photo ? user.photo : "",
    },
    enableReinitialize: true,
    validate,
    onSubmit: (values) => {
      if (country) {
        values.nationality = country;
      }

      setLoading(true);

      // if (status !== null) {
      //
      //     let valuesD = {userStatus: status};
      //     FetchApi.sendPutRequest(`/users/${userId}/change-user-status`, valuesD, {credential: true})
      //         .then(res => {
      //             if (res.ok) {
      //                 // success
      //                 console.log('success');
      //             } else {
      //                 // handle err
      //                 console.log(res.data.message);
      //             }
      //         })
      //         .catch(err => {
      //             // something unwanted happened
      //             console.log(err.message);
      //         })
      // }

      FetchApi.sendPutRequest(`/users/${userId}`, values, { credential: true })
        .then((res) => {
          if (res.ok) {
            // success
            Swal.fire(
              "User updated",
              "User has been updated successfully",
              "success"
            );
            formik.resetForm();
          } else {
            // handle err
            Swal.fire("Error", res.data.message, "error");
          }
        })
        .catch((err) => {
          // something unwanted happened
          Swal.fire("Error", err.message, "error");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  function updateUserStatus(e) {
    setStatus(e.value);
  }

  if (user) {
    return (
      <>
        {loading && (
          <div className="flex justify-center items-center">
            <Loader
              type="Circles"
              color="#ff8c00"
              height={100}
              width={100}
              timeout={7000} //3 secs
              className=" inline-block align-middle absolute  z-50  "
            />
          </div>
        )}

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:mt-0 md:col-span-3">
            <form onSubmit={formik.handleSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 py-1"
                      >
                        First name
                      </label>
                      <input
                        id="firstName"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        placeholder="Enter first name"
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <Warning message={formik.errors.firstName}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="middleName"
                        className="py-1 block text-sm font-medium text-gray-700"
                      >
                        Middle name
                      </label>
                      <input
                        id="middleName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.middleName}
                        placeholder="Enter last name"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.middleName &&
                        formik.errors.middleName && (
                          <Warning message={formik.errors.middleName}></Warning>
                        )}
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="nickName"
                        className="py-1 block text-sm font-medium text-gray-700"
                      >
                        Nick Name
                      </label>

                      <input
                        id="nickName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nickName}
                        placeholder="Enter nick name"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.nickName && formik.errors.nickName && (
                        <Warning message={formik.errors.nickName}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="lastName"
                        className="py-1 block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>

                      <input
                        id="lastName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        placeholder="Enter last name"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <Warning message={formik.errors.lastName}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="spouseName"
                        className="py-1 block text-sm font-medium text-gray-700"
                      >
                        Spouse Name
                      </label>

                      <input
                        id="spouseName"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spouseName}
                        placeholder="Enter spouse name"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="dob"
                        className="block text-sm  text-gray-700 py-1"
                      >
                        <span className="text-red-600 pt-2 mr-1">*</span>Date of
                        birth
                      </label>

                      <input
                        id="dob"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={
                          formik.values.dob
                            ? new Date(formik.values.dob)
                                .toISOString()
                                .substr(0, 10)
                            : ""
                        }
                        placeholder="Date of birth"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.dob && formik.errors.dob && (
                        <Warning message={formik.errors.dob}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="py-1 block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>

                      <input
                        id="phone"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        placeholder="Enter phone number"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <Warning message={formik.errors.phone}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="gender"
                        className="py-1 block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        placeholder="Select gender"
                        className=" cursor-pointer border-2 px-4  py-2 w-full text-sm text-black bg-white rounded-md focus:outline-none focus:bg-white focus:text-gray-900"
                      >
                        <option disabled>Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Others</option>
                      </select>
                      {formik.touched.gender && formik.errors.gender && (
                        <Warning message={formik.errors.gender}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <p className="text-sm font-normal text-left  ">
                        Country Name
                      </p>
                      <div className=" py-1 w-full ">
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
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {/*{formik.touched.nationality && formik.errors.nationality && (*/}
                        {/*<Warning message={formik.errors.nationality}></Warning>)}*/}
                      </div>
                    </div>

                    <div className=" col-span-6 sm:col-span-3 ">
                      <label
                        htmlFor="nationalId"
                        className="block text-sm font-medium text-gray-700 py-1"
                      >
                        National Id
                      </label>
                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="number"
                        name="nationalId"
                        id="nationalId"
                        value={formik.values.nationalId}
                        placeholder="National Id"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                    </div>

                    <div className=" col-span-6 sm:col-span-3 ">
                      <label
                        htmlFor="zipcode"
                        className="block text-sm font-medium text-gray-700 py-1"
                      >
                        ZIP / Postal
                      </label>
                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="string"
                        name="zipcode"
                        id="zipcode"
                        value={formik.values.zipcode}
                        autoComplete="zipcode"
                        placeholder="Zip/Postal code"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.zipcode && formik.errors.zipcode && (
                        <Warning message={formik.errors.zipcode}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3 ">
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-gray-700 py-1"
                      >
                        Address
                      </label>

                      <input
                        id="street"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.street}
                        placeholder="Enter street"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.street && formik.errors.street && (
                        <Warning message={formik.errors.street}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3 ">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 py-1"
                      >
                        City
                      </label>

                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        name="city"
                        id="city"
                        value={formik.values.city}
                        placeholder="Enter city"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.city && formik.errors.city && (
                        <Warning message={formik.errors.city}></Warning>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3 ">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 py-1"
                      >
                        State
                      </label>

                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        name="state"
                        id="state"
                        value={formik.values.state}
                        placeholder="Enter state"
                        className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-4 focus:outline-none focus:bg-white focus:text-gray-900"
                      />
                      {formik.touched.state && formik.errors.state && (
                        <Warning message={formik.errors.state} />
                      )}
                    </div>

                    {/*<div className="col-span-6 sm:col-span-3">*/}
                    {/*<label htmlFor="status"*/}
                    {/*className="py-1 block text-sm font-medium text-gray-700">*/}
                    {/*User Status</label>*/}
                    {/*<DropDownMenuWithIcon className={"rounded text-black"}*/}
                    {/*options={[*/}
                    {/*{*/}
                    {/*label: "Active",*/}
                    {/*value: true*/}
                    {/*},*/}
                    {/*{*/}
                    {/*label: "In Active",*/}
                    {/*value: false,*/}
                    {/*}]*/}
                    {/*}*/}
                    {/*defaultValue={user && user.userStatus === true ? "Active" : "In Active"}*/}
                    {/*selectCallback={updateUserStatus}*/}
                    {/*placeholder={"User Status"}*/}

                    {/*/>*/}
                    {/*</div>*/}
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-center sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  } else return <CustomLoader />;
}
