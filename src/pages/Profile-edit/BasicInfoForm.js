import React, {useEffect, useState} from 'react'
import ProfilePictureUploader from '../public/profilePictureUploader';
import AvatarLogo from "../../image/avatar.png";
import {useFormik} from "formik";
import * as FetchApi from "../../libs/FetchApi";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {CountryDropdown} from "react-country-region-selector";
import {BASE_URL, PHOTO_URL} from '../../constants';
import Warning from '../../components/Message/warning';
import Loader from 'react-loader-spinner';
import UserManager from '../../libs/UserManager';
import Layout from '../../components/Layout/Layout'

const validate = values => {
  const errors = {};
  const { firstName, lastName, nickName, } = values;

  if (!nickName) {
    errors.nickkNme = 'Required';
  } else if (!(nickName.length >= 3 && nickName.length < 30)) {
    errors.nickName = 'Must be greater than 3 and less than 30 characters';
  }

  if (!firstName) {
    errors.firstName = 'Required';
  }

  else if (!/^[a-zA-Z]+[.]*$/i.test(values.firstName)) {
    errors.firstName = 'Firstname contains characters and dot only';
  }

  if (!lastName) {
    errors.lastName = 'Required';
  }
  else if (!/^[a-zA-Z, ]*$/i.test(values.lastName)) {
    errors.lastName = 'Lasttname contains characters only';
  }

  console.log(errors);
  return errors;
};

export default function BasicInfoForm(props) {

    const userInfo = UserManager.getLoggedInUser();

    const [user, setUser] = useState(userInfo);
    useEffect(() => {
        getUserApi()
    }, [])

    const getUserApi = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            if(response.code===401)  history.push('/signin');
            else if (response.code === 404) console.log('Whoops..', "No user data found", 'error');
            else setUser(response.user);
        }
        else console.log('Whoops..', "No user data found", 'error');
    }


  useEffect(() => {
    setUser(props.user);
  }, [props.user])
  const [profilePictureModal, setProfilePictureModal] = useState(false);
  const photoUrl = user && user.photo !== "no-photo.jpg" ? PHOTO_URL + user.photo : AvatarLogo;
  const [loading, setLoading] = useState(false);

  const [country, setCountry] = useState(user && user.nationality ? user.nationality : 'United States');

  const formik = useFormik({
    initialValues: {
      nationality: country,
      firstName: user && user.firstName ? user.firstName : '',
      middleName: user && user.middleName ? user.middleName : '',
      lastName: user && user.lastName ? user.lastName : '',
      nickName: user && user.nickName ? user.nickName : '',
      dob: user && user.dob ? new Date(user.dob) : '',
      phone: user && user.phone ? user.phone : '',
      spouseName: user && user.spouseName ? user.spouseName : '',
      nationalId: user && user.nationalId ? user.nationalId : '',
      gender: user && user.gender ? user.gender : '',
      zipcode: user && user.zipcode ? user.zipcode : '',
      state: user && user.state ? user.state : '',
      city: user && user.city ? user.city : '',
      street: user && user.street ? user.street : '',
      photo: user && user.photo ? user.photo : '',
    },
    validate,
    // enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);

      if (country) {
        values.nationality = country;
      }
      if (values.nationalId) {
        values.nationalId = values.nationalId.toString();
      }

      FetchApi.sendPutRequest(`/users/${user.id}`, values, { credential: true })
        .then(response => {
          if (response.ok && response.data.code !== 400) {
            setLoading(false)
            UserManager.setLoggedInUser(response.data.data);

            Swal.fire({
              title: "Congratulations",
              text: "Your personal information has been submitted.",
              confirmButtonColor: '#ff8c00',
              confirmButtonText: 'Okay',
            });
          } else {
            setLoading(false)
            Swal.fire({
              title: response.err.statusText,
              text: response.data.message,
              confirmButtonColor: '#ff8c00',
              confirmButtonText: 'Back',
            });

          }
        })
        .catch(err => {
          Swal.fire('Error', err.message, 'error');
          // props.cb && props.cb(false);
        });
    },
  })

  function handleCountryValue(e) {
    setCountry(e)
    formik.handleChange(e);
  }



  function handleProfilePictureUploadCallback(value) {
    setProfilePictureModal(false)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center md:items-center pt-12   ">

        <img src={user && photoUrl ? photoUrl : AvatarLogo}
          className="h-32 w-32 text-center mx-4 rounded-full border-1 group "
          alt="Profile Picture " />
        <div
          className="cursor-pointer group-hover:text-blue-400 group-hover:text-2xl text-sm ">
          <p onClick={() => setProfilePictureModal(true)}
            className='text-gray-400 hover:text-site-theme ml-4 pt-2 text-center font-normal transform hover:scale-125 '>
            Change Profile Picture </p>
        </div>
      </div>

      <div className="py-8 md:px-16 lg:px-24 px-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-6 gap-x-8  gap-y-4">
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="first_name"
                className="block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>First
                name</label>
              <input id="firstName"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
                onChange={formik.handleChange}

                onBlur={formik.handleBlur} value={formik.values.firstName}
                placeholder="First name" />
              {formik.touched.firstName && formik.errors.firstName && (
                <Warning message={formik.errors.firstName}></Warning>)}
            </div>


            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="middleName"
                className="py-1 block text-sm  text-gray-700">Middle
                name</label>
              <input

                id="middleName" onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.middleName} placeholder="Middle name"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />

            </div>
            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="lastName"
                className="py-1 block text-sm text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>Last Name</label>

              <input
                id="lastName" onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName} placeholder="Last name"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <Warning message={formik.errors.lastName}></Warning>)}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="nickName"
                className="py-1 block text-sm text-gray-700 py-1">Nick
                Name</label>

              <input
                id="nickName" disabled onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={user && user.nickName} placeholder="Nick name"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />
              {/*{formik.touched.nickName && formik.errors.nickName && (<Warning message={formik.errors.nickName}></Warning>)}*/}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="spouseName"
                className="py-1 block text-sm text-gray-700 py-1">Spouse
                Name</label>

              <input
                id="spouseName" onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.spouseName} placeholder="Spouse Name"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="dob"
                className="py-1 block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>Date of
                birth</label>

              <input
                id="dob" type="date" onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dob ? new Date(formik.values.dob).toISOString().substr(0, 10) : ''}
                placeholder="Date of birth"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"

              />
              {formik.touched.dob && formik.errors.dob && (
                <Warning message={formik.errors.dob}></Warning>)}
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="gender"
                className="py-1 block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>
                Gender</label>
              <select
                id="gender"
                name="gender"
                onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                value={formik.values.gender}
                placeholder="Gender"
                className=" cursor-pointer border-2 px-2  py-2 w-full text-sm text-black bg-white rounded-md focus:outline-none focus:bg-white focus:text-gray-900"

              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <Warning message={formik.errors.gender}></Warning>)}
            </div>

            <div className=" col-span-6 sm:col-span-3 ">

              <label htmlFor="phone"
                className="block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>Phone No</label>
              <input
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                type="text" name="phone" id="phone"
                value={formik.values.phone}
                placeholder="Phone NO"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />
              {formik.touched.phone && formik.errors.phone && (
                <Warning message={formik.errors.phone}></Warning>)}
            </div>



            <div className="col-span-6 sm:col-span-3">
              <p className="text-sm font-normal text-left  "><span
                className="text-red-600 pt-2 mr-1">*</span>Country Name </p>
              <div className=" py-1 w-full ">
                <CountryDropdown
                  value={country}
                  onChange={handleCountryValue}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: 18,
                    // width:'200px',
                  }}
                  tabIndex={1000}
                  disabled={false}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.touched.country && formik.errors.country && (
                  <Warning message={formik.errors.country}/>)}
              </div>
            </div>

            <div className=" col-span-6 sm:col-span-3 ">
              <label htmlFor="nationalId"
                className="block text-sm  text-gray-700 py-1">National Id</label>
              <input
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                type="number" name="nationalId" id="nationalId"
                value={formik.values.nationalId}
                placeholder="National Id"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />
              {/*{formik.touched.nationalId && formik.errors.nationalId && (*/}
                {/*<Warning message={formik.errors.nationalId}></Warning>)}*/}
            </div>

            <div className=" col-span-6 sm:col-span-3 ">
              <label htmlFor="zipcode"
                className="block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>ZIP / Postal</label>
              <input
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                type="string" name="zipcode" id="zipcode"
                value={formik.values.zipcode}
                autoComplete="postal-code"
                placeholder="Zip/Postal code"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"
              />
              {formik.touched.zipcode && formik.errors.zipcode && (
                <Warning message={formik.errors.zipcode}></Warning>)}
            </div>
            <div className="col-span-6 sm:col-span-3 ">
              <label htmlFor="city"
                className="block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>City</label>
              <input
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                type="text" name="city" id="city"
                value={formik.values.city} placeholder="Enter city"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"

              />
              {formik.touched.city && formik.errors.city && (
                <Warning message={formik.errors.city}></Warning>)}
            </div>
            {loading &&
              <Loader
                type="Circles"
                color="#ff8c00"
                height={100}
                width={100}
                timeout={7000}//7 secs
                className=" inline-block align-middle absolute mt-16 justify-center items-center z-50  "
              />}

            <div className="col-span-6 sm:col-span-3 ">
              <label htmlFor="city"
                className="block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>State</label>

              <input
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                type="text" name="state" id="state"
                value={formik.values.state} placeholder="Enter state"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"

              />
              {formik.touched.state && formik.errors.state && (
                <Warning message={formik.errors.state}></Warning>)}
            </div>

            <div className="col-span-6 sm:col-span-3 ">
              <label htmlFor="city"
                className="block text-sm  text-gray-700 py-1"><span
                  className="text-red-600 pt-2 mr-1">*</span>Street</label>

              <input
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                type="text" name="street" id="street"
                value={formik.values.street} placeholder="Enter street"
                className="border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900"

              />
              {formik.touched.street && formik.errors.street && (
                <Warning message={formik.errors.street}></Warning>)}
            </div>



          </div>

          <button type="submit"
            className="bg-site-theme  mx-auto tex-center mt-6 w-32 text-white active:bg-green-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none "
            style={{ transition: "all .15s ease" }}
          >
            Save
          </button>

        </form>
      </div>

      {
        profilePictureModal === true && <ProfilePictureUploader
          showModal={profilePictureModal}
          user={user}
          profilePictureCallback={handleProfilePictureUploadCallback} />
      }
    </Layout>
  )
}
