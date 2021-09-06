import React, { useState } from "react"
import AvatarImage from "../../image/avatar.png"
import * as FetchApi from "../../libs/FetchApi"
import { BASE_URL, PHOTO_URL } from "../../constants"
import Swal from "sweetalert2"
import UserManager from "../../libs/UserManager"
import Cookies from "js-cookie"
import Loader from "react-loader-spinner"

export default function ProfilePictureUploader(props) {
  const [showModal, setShowModal] = useState(props.showModal)
  const user = UserManager.getLoggedInUser()
  const [projectImages, setProjectImages] = useState({})
  const [loading, setLoading] = useState(false)

  const [picture, setPicture] = useState({})

  const uploadPicture = (e) => {
    let file_size = e.target.files[0].size
    if (file_size <= 10000000) {
      setPicture({
        /* contains the preview, if you want to show the picture to the user
                     you can access it with this.state.currentPicture
                 */
        picturePreview: URL.createObjectURL(e.target.files[0]),
        /* this contains the file we want to send */
        pictureAsFile: e.target.files[0],
      })
    } else
      Swal.fire("Upload failed", "Please Upload File Less than 10MB", "Error")
  }

  const setImageAction = async (event) => {
    event.preventDefault()

    setLoading(true)

    const myHeaders = new Headers()
    // myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const formData = new FormData()
    formData.append("profile-photo", picture.pictureAsFile)

    // for (var key of formData.entries()) {
    //     console.log(key[0] + ", " + key[1]);
    // }

    const data = await fetch(
      `${BASE_URL}/users/${user.id}/upload-profile-photo`,
      {
        method: "put",
        // headers: { "Content-Type": "multipart/form-data" },
        headers: myHeaders,
        // body: formData,
        // body: JSON.stringify(data),
        body: formData,
      }
    )
    const uploadedImage = await data.json()
    if (uploadedImage && uploadedImage.success === true) {
      setLoading(false)
      let newPhotoUrl = uploadedImage.data.data

      let existing = localStorage.getItem("auth-user")
      existing = existing ? JSON.parse(existing) : {}
      existing["photo"] = newPhotoUrl
      localStorage.setItem("auth-user", JSON.stringify(existing))

      Swal.fire("Profile Picture Uploaded Successfullly", "", "Success").then(
        (result) => {
          props.cb && props.cb()
        }
      )
      // console.log("Successfully uploaded image",uploadedImage);
    } else {
      Swal.fire("Upload failed", "Upload Error", "Error")
      // console.log("Error Found",uploadedImage);
    }
  }

  function handleModal() {
    setPicture({})
    setShowModal(!showModal)
    props.profilePictureCallback(false)
  }
  return (
    <>
      {showModal ? (
        <>
          <div
            className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
            // onClick={handleModalCallback}
          >
            <div className='relative w-auto my-8 mx-auto max-w-3xl'>
              {/*content*/}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                {/*header*/}
                <div className='flex items-start justify-between border-solid border-gray-300 rounded-t'>
                  <div
                    className='px-6 py-2 ml-auto cursor-pointer '
                    onClick={handleModal}
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
                <div className='md:px-24 p-8 flex-auto'>
                  <p className='py-4 text-bold text-gray-600 text-center'>
                    {" "}
                    Update Profile Picture{" "}
                  </p>
                  <div
                    className={
                      "group my-2 cursor-pointer shadow border-1 text-gray-400 text-center py-4  bg-white text-black"
                    }
                  >
                    <input
                      onChange={uploadPicture}
                      type='file'
                      id='image1'
                      name='image1'
                      accept='image/*'
                      className='hidden'
                    />
                    <label htmlFor='image1' className='cursor-pointer'>
                      <div className='relative flex flex-col items-center justify-center cursor-pointer'>
                        {loading && (
                          <Loader
                            type='Circles'
                            color='#ff8c00'
                            height={100}
                            width={100}
                            timeout={7000} //3 secs
                            className=' inline-block align-middle absolute  z-50  '
                          />
                        )}

                        <img
                          src={
                            picture && picture.picturePreview
                              ? picture.picturePreview
                              : AvatarImage
                          }
                          className='h-64 w-64  text-center  '
                          alt='Avatar'
                        />

                        <div className='flex flex-row group-hover:text-blue-400 group-hover:text-2xl text-sm transform translate group-hover:scale-120 '>
                          <p className='ml-4 text-center font-normal transform group-hover:scale-150 '>
                            Change Image{" "}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  <p className='text-sm text-red-400 text-left'>
                    Upload .jpg, .jpeg or .png file and not exceeding 2M
                  </p>
                </div>
                {/*footer*/}
                <div className='flex items-center justify-center p-6 border-t border-solid border-gray-300 rounded-b'>
                  <button
                    className=' text-white bg-site-theme  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1'
                    type='button'
                    style={{ transition: "all .15s ease" }}
                    onClick={setImageAction}
                  >
                    Save Changes
                  </button>
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
