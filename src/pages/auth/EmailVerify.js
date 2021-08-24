import React, { useState, useEffect } from "react"
// import Swal from "sweetalert2"
import { NavLink } from "react-router-dom"
import AuthAPI from "../../apis/auth"

const EmailVerify = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  let data = { jwt: props.match.params.id }
  //   console.log(JSON.stringify(data))
  useEffect(() => {
    // alert(props.match.params.id)
    AuthAPI.emailVerify(data).then((res) => {
      console.log("emailverify: ", res)
      if (res.data && res.data.registrationData) {
        setMessage(res.data.registrationData.message)
        setEmail(res.data.registrationData.user.email)
        setName(res.data.registrationData.user.nickName)
        setShowModal(true)
      } else if (res.data && res.data.message) {
        setMessage(res.data.message)
        setShowModal(true)
      } else setShowModal(true)
    })
  }, [])
  return (
    <>
      {showModal ? (
        <>
          <div
            className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
            // onClick={() => setShowModal(false)}
          >
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              {/*content*/}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                {/*header*/}
                <div className='flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t'>
                  <h3 className='text-3xl font-semibold'>{message}</h3>
                  <button
                    className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                    onClick={() => setShowModal(false)}
                  >
                    <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className='relative p-6 flex-auto'>
                  {name && (
                    <p className='my-4 text-gray-600 text-lg leading-relaxed'>
                      Name: {name}
                    </p>
                  )}
                  {email && (
                    <p className='my-4 text-gray-600 text-lg leading-relaxed'>
                      Email: {email}
                    </p>
                  )}
                </div>
                {/*footer*/}
                <div className='flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b'>
                  {/* <button
                    className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1'
                    type='button'
                    style={{ transition: "all .15s ease" }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button> */}
                  <NavLink
                    className='bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1'
                    type='button'
                    style={{ transition: "all .15s ease" }}
                    // onClick={() => setShowModal(false)}
                    to='/'
                  >
                    OK
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black' />
        </>
      ) : null}
    </>
  )
}

export default EmailVerify
