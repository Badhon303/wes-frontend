import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"
import nidFronImageCover from "../../image/id-front.png"
import uploaderIcon from "../../image/icons/upload.svg"
import UserManager from "../../libs/UserManager"
import Cookies from "js-cookie"
import { BASE_URL, PHOTO_URL } from "../../constants"
import Loader from "react-loader-spinner"
import { useHistory } from "react-router-dom"

const IMAGE_FIELD = "driving-license-photo"

const DrivingLicense = (props) => {
  const [id, setId] = useState(1)
  const [projectImages, setProjectImages] = useState({})
  const [projectImages2, setProjectImages2] = useState({})
  const history = useHistory()
  const [user, setUser] = useState(null)

  const userInfo = UserManager.getLoggedInUser()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getUserApi()
  }, [])

  const getUserApi = async () => {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
    const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
      method: "GET",
      headers: myHeaders,
    })
    const response = await data.json()

    if (response) {
      if (response.code === 401) history.push("/signin")
      else if (response.code === 404)
        console.log("Whoops..", "No user data found", "error")
      else setUser(response.user)
    } else console.log("Whoops..", "No user data found", "error")
  }

  let LicenceFrontImageCover =
    user && user.drivingFront && user.drivingFront !== "driving_front.jpg"
      ? PHOTO_URL + user.drivingFront
      : nidFronImageCover

  let LicenceBackImageCover =
    user && user.drivingBack && user.drivingBack !== "driving_back.jpg"
      ? PHOTO_URL + user.drivingBack
      : nidFronImageCover

  //Convert Blob to Data URI
  const imageSelect = async (e) => {
    let file_size = e.target.files[0].size
    if (file_size <= 10000000) {
      let image = ""
      let name = e.target.name
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = await function () {
        image = reader.result
        setImages(name, image)
      }
    } else
      Swal.fire("Upload failed", "Please Upload File Less than 10MB", "Error")
  }

  const imageSelect2 = async (e) => {
    let file_size = e.target.files[0].size
    if (file_size <= 10000000) {
      let image = ""
      let name = e.target.name
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = await function () {
        image = reader.result
        setImages2(name, image)
      }
    } else
      Swal.fire("Upload failed", "Please Upload File Less than 10MB", "Error")
  }

  //Set the DataURI in state.
  const setImages = (name, image) => {
    setProjectImages({
      ...projectImages,
      [name]: image,
    })
  }

  const setImages2 = (name, image) => {
    setProjectImages2({
      ...projectImages2,
      [name]: image,
    })
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (projectImages[IMAGE_FIELD]) {
      try {
        var myHeaders = new Headers()
        myHeaders.append(
          "Authorization",
          "Bearer " + Cookies.get("access-token")
        )

        var formdata = new FormData(e.target)

        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        }

        fetch(
          `${BASE_URL}/users/${user.id}/upload-driving-photo`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            setLoading(false)
            if (result.success) {
              //
              // setLicenceFrontImageCover(result.data.front_side)
              // setLicenceBackImageCover(result.data.back_side)
              let existing = localStorage.getItem("auth-user")
              existing = existing ? JSON.parse(existing) : {}
              existing["drivingFront"] = result.data.front_side
              existing["drivingBack"] = result.data.back_side
              localStorage.setItem("auth-user", JSON.stringify(existing))

              Swal.fire({
                title: "Congratulations",
                text: "Your information's has been submitted. Approval may take some time.",
                confirmButtonColor: "#ff8c00",
                confirmButtonText: "Okay",
              }).then((result) => {
                if (
                  history.location.pathname &&
                  history.location.pathname === "/profile/verify"
                ) {
                  props.cb && props.cb(true)
                  document.location.href = "/dashboard"
                } else console.log("complete")
              })
            } else {
              Swal.fire("Whoops", result.data, "error")
            }
          })
          .catch((error) => console.log("error", error))
      } catch (error) {
        // console.log('implementation error');
        console.error(error)
      }
    } else {
      Swal.fire("Error", "Images is required", "error")
    }
  }

  return (
    <form onSubmitCapture={handleFormSubmit} className='py-8  '>
      <p className='text-lg font-bold text-left text-gray-500 pb-4'>
        Advance Verification{" "}
      </p>

      <p className=' text-base font-medium text-left py-2 text-gray-400 text-base'>
        Upload Driving Licence{" "}
      </p>

      <div className=' flex flex-col  '>
        <div
          className={
            "group my-2 cursor-pointer shadow border-1 text-gray-400 text-center py-4 " +
            (id === 1 ? "bg-white text-black" : "bg-white text-back")
          }
        >
          <input
            onChange={imageSelect}
            type='file'
            id='image1'
            name={IMAGE_FIELD}
            accept='image/*'
            className='hidden'
            multiple
          />
          <label htmlFor='image1' className='cursor-pointer'>
            <div className='relative flex flex-col items-center justify-center cursor-pointer'>
              {loading && (
                <Loader
                  type='Circles'
                  color='#ff8c00'
                  height={100}
                  width={100}
                  timeout={7000} //7 secs
                  className=' inline-block align-middle absolute  z-50  '
                />
              )}

              <img
                src={
                  projectImages[IMAGE_FIELD]
                    ? projectImages[IMAGE_FIELD]
                    : LicenceFrontImageCover
                }
                className='h-20 w-20 text-center mx-4 '
                alt='tick sign'
              />

              <div className='flex flex-row group-hover:text-blue-400 group-hover:text-2xl text-sm transform translate group-hover:scale-120 '>
                <img
                  src={uploaderIcon}
                  alt='uploader icon'
                  className='h-5 w-5'
                />
                <p className='ml-4 text-center font-normal transform group-hover:scale-150 '>
                  Upload front image{" "}
                </p>
              </div>
            </div>
          </label>
        </div>

        <div
          className={
            "group my-2 cursor-pointer shadow border-1 text-gray-400 text-center py-4 " +
            (id === 1 ? "bg-white text-black" : "bg-white text-back")
          }
        >
          <input
            onChange={imageSelect2}
            type='file'
            id='image2'
            name={IMAGE_FIELD}
            accept='image/*'
            className='hidden'
          />
          <label htmlFor='image2' className='cursor-pointer'>
            <div className='flex flex-col items-center justify-center cursor-pointer'>
              <img
                src={
                  projectImages2[IMAGE_FIELD]
                    ? projectImages2[IMAGE_FIELD]
                    : LicenceBackImageCover
                }
                className='h-20 w-20 text-center mx-4 '
                alt='tick sign'
              />

              <div className='flex flex-row group-hover:text-blue-400 group-hover:text-2xl text-sm transform translate group-hover:scale-120 '>
                <img
                  src={uploaderIcon}
                  alt='uploader icon'
                  className='h-5 w-5'
                />
                <p className='ml-4 text-center font-normal transform group-hover:scale-150 '>
                  Upload back image{" "}
                </p>
              </div>
            </div>
          </label>
        </div>

        <p className='text-sm text-red-400 text-left'>
          Upload .jpg, .jpeg or .png file and not exceeding 10M
        </p>
      </div>
      {projectImages[IMAGE_FIELD] && projectImages2[IMAGE_FIELD] && (
        <button
          className=' mt-6 w-full font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none text-white bg-site-theme'
          // className="bg-site-theme  mt-6 w-full text-white active:bg-green-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none "
          type='submit'
          style={{ transition: "all .15s ease" }}
        >
          Continue
        </button>
      )}

      {/*<div className="form-group">*/}
      {/*<input type="file"*/}
      {/*onChange={formik.handleChange}*/}
      {/*onBlur={formik.handleBlur}*/}
      {/*value={formik.values.file}*/}
      {/*className="form-control"*/}
      {/*name="file"*/}
      {/*id="file"*/}
      {/*aria-describedby="file"*/}
      {/*placeholder="Upload driving license copy" />*/}
      {/*{formik.touched.file && formik.errors.file && (<div className="invalid-feedback d-flex">{formik.errors.file}</div>)}*/}
      {/*</div>*/}
    </form>
  )
}

export default DrivingLicense
