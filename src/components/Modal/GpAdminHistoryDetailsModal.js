import React, { useEffect, useState } from "react"
import { func } from "prop-types"
import Modal from "react-modal"
import UserManager from "../../libs/UserManager"
import CustomLoader from "../CustomLoader/CustomLoader"
import { customStylesModal2 } from "../../utils/styleFunctions"
import Cookies from "js-cookie"
import { BASE_URL } from "../../constants"
import Swal from "sweetalert2"

export default function GpAdminHistoryDetailsModal({ details, onClose }) {
  const [loading, setLoading] = useState(false)

  const userInfo = UserManager.getLoggedInUser()
  const [userDetails, setUserDetails] = useState(null)

  let btc_tx_id = ""
  if (process.env.REACT_APP_ENV === "dev") {
    btc_tx_id = "https://www.blockchain.com/btc-testnet/tx/"
  } else if (process.env.REACT_APP_ENV === "dev") {
    btc_tx_id = "https://www.blockchain.com/btc/tx/"
  }

  useEffect(() => {
    let abc = callDetailsApi()
  }, [details])

  function handleModalCallback() {
    onClose && onClose()
  }

  const callDetailsApi = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 12000)
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const data = await fetch(
      `${BASE_URL}//gold-point/exchange/histories/${details.id}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    const response = await data.json()

    if (response) {
      setLoading(false)
      if (response.code === 401) history.push("/signin")
      else if (
        response.code === 404 ||
        response.code === 403 ||
        response.code === 500
      )
        Swal.fire("Whoops..", "No data found", "error")
      else console.log(response, "asdf")
      setUserDetails(response && response ? response.exchangeDetails : "")
    } else Swal.fire("Whoops..", "No  data found", "error")
  }

  return (
    <Modal
      isOpen={true}
      contentLabel='onRequestClose Example'
      onRequestClose={handleModalCallback}
      shouldCloseOnOverlayClick={false}
      style={customStylesModal2}
    >
      <div className=''>
        {loading && <CustomLoader />}

        <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
          <h3 className='text-2xl font-semibold text-site-theme '>
            Purchase Details
          </h3>
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

        {userDetails && (
          <div className='my-6 w-full  border-yellow-400'>
            <div className='w-full  border-yellow-400 rounded border-2'>
              <div className='group bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-auto '>
                <p className='text-left font-bold my-2'>
                  Gold Point Amount Before Purchase: {""}
                  {userDetails && userDetails.gpBeforeTx}{" "}
                </p>
                <p className='text-left font-bold my-2'>
                  {" "}
                  Gold Point Amount Spent to Purchase:{""}{" "}
                  {userDetails && userDetails.goldPointAmount}
                </p>
                <p className='text-left font-bold my-2'>
                  Gold Point Amount After Purchase{""}{" "}
                  {userDetails && userDetails.gpAfterTx}{" "}
                </p>
                {/* <p className="text-left font-bold my-2">Dollar Price per Gold
                                Point {userDetails && userDetails.gpBeforeTx}</p> */}
                <p className='text-left font-bold my-2'>
                  Purchased Equivalent Dollar Price{" "}
                  {userDetails && userDetails.price}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-2xl font-semibold text-site-theme mt-12 '>
                User Details
              </h3>

              <table className='my-8  md:w-full md:whitespace-nowrap '>
                <thead>
                  <tr className='bg-site-theme  text-white font-bold h-16 w-full leading-none border'>
                    <th className=' l text-left pl-4 text-base'>Email</th>
                    <th className=' l text-left pl-4 text-base'>ID</th>
                    <th className=' text-left pl-4 text-base'>NickName</th>
                    <th className=' text-left pl-4 text-base'>Full Name</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  <tr className='group h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow '>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails &&
                          userDetails.user &&
                          userDetails.user.email}
                      </p>
                    </td>

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails &&
                          userDetails.user &&
                          userDetails.user.userId}
                      </p>
                    </td>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails &&
                          userDetails.user &&
                          userDetails.user.nickName}
                      </p>
                    </td>

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails &&
                          userDetails.user &&
                          userDetails.user.fullName}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className='text-2xl font-semibold text-site-theme mt-12 '>
                Coin Details
              </h3>

              <table className='my-8  md:w-full md:whitespace-nowrap '>
                <thead>
                  <tr className='bg-site-theme  text-white font-bold h-16 w-full leading-none border'>
                    <th className=' l text-left pl-4 text-base'>Coin</th>
                    <th className=' l text-left pl-4 text-base'>Amount</th>
                    <th className=' text-left pl-4 text-base'>
                      Transaction Id
                    </th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  <tr className='group h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow '>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails && userDetails.coin}
                      </p>
                    </td>

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails && userDetails.coinAmount}
                      </p>
                    </td>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        <span className='underline text-gray-600 md:text-base text-sm break-all group-hover:underline  cursor-pointer group-hover:text-site-theme'>
                          <a
                            target='_blank'
                            href={
                              userDetails.txId &&
                              // process.env.REACT_APP_ENV === "dev"
                              //   ? "https://kovan.etherscan.io/tx/" +
                              //     userDetails.txId
                              //   : userDetails.coin === "BTC"
                              //   ? "https://www.blockchain.com/btc/tx/" +
                              //     userDetails.txId
                              //   : "https://etherscan.io/tx/" + userDetails.txId
                              userDetails.coin === "BTC"
                                ? btc_tx_id + userDetails.txId
                                : "https://etherscan.io/tx/" + userDetails.txId
                            }
                          >
                            {userDetails && userDetails.txId}
                          </a>
                        </span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 className='text-2xl text-center font-semibold text-site-theme mt-12 '>
                Item Summary
              </h3>

              <table className='my-4  md:w-half mx-auto md:whitespace-nowrap '>
                <thead>
                  <tr className='bg-site-theme  text-white font-bold h-16 w-full leading-none border'>
                    <th className=' l text-left pl-4 text-base'>Item</th>
                    <th className=' l text-left pl-4 text-base'>Quantity</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  <tr className='group h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow '>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails && userDetails.coin}
                      </p>
                    </td>

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {userDetails && userDetails.unit}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={handleModalCallback}
              className='mb-40 mt-12 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold'
            >
              {" "}
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
