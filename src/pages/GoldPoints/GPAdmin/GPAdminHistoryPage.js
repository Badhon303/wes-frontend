import React, { useEffect, useState } from "react"
import UserManager from "../../../libs/UserManager"
import { useHistory } from "react-router-dom"
import CustomLoader from "../../../components/CustomLoader/CustomLoader"
import Cookies from "js-cookie"
import { BASE_URL } from "../../../constants"
import Swal from "sweetalert2"
import { getReadableTime } from "../../../utils/times"
import Pagination from "react-js-pagination"
import GpHistoryDetailsModal from "../../../components/Modal/GpHistoryDetailsModal"
import DropDownMenuWithIcon from "../../../components/Dropdown/DropDownWithMenu"
import { CoinTypes } from "../../../utils/coins"
import Datetime from "react-datetime"
import moment from "moment"
import emailIcon from "../../../image/icons/email.svg"
import GpAdminHistoryDetailsModal from "../../../components/Modal/GpAdminHistoryDetailsModal"

const style = {
  default: `mr-8 outline-none focus:outline-none  rounded    font-semibold border-1 px-6 py-3 w-auto text-base`,
  normal: `text-gray-800  `,
  selected: `shadow-lg bg-site-theme opacity-90 text-white`,
}

let inputProps = {
  placeholder: "Year and Month",
}

const parseYearMonth = (parseDate) => {
  let check = moment(parseDate, "YYYY-MM")
  let month = check.format("M")
  let year = check.format("YYYY")
  const completeDate = `month=${month}&year=${year}`
  return completeDate
}

export default function GPAAdminHistoryPage() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [goldPoint, setGoldPoint] = useState(null)
  const userInfo = UserManager.getLoggedInUser()
  const [ownedGoldPointPrice, setOwnedGoldPointPrice] = useState(null)
  const [step, setStep] = useState(1)
  const [activePage, setActivePage] = useState(1)
  const [pageChanged, setPageChanged] = useState(false)
  const [totalUser, setTotalUser] = useState(0)
  const [orderDetailsModal, setOrderDetailsModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [gpDetails, setGpDetails] = useState(null)
  const [totalUserOfDetailsId, setTotalUserOfDetailsId] = useState(0)
  const [coin, setCoin] = useState(null)
  const [coinPrice, setCoinPrice] = useState(null)
  const [yearMonth, setYearMonth] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [firstResult, setFirstResult] = useState(null)

  useEffect(() => {
    let point = getGoldPointApi()
    let data = getGpHistories()
  }, [])

  useEffect(() => {
    let data = getGpHistories()
  }, [activePage, step])

  useEffect(() => {
    if (coin) {
      let res = getGPExchangePriceApi()
    }
  }, [coin])

  useEffect(() => {}, [yearMonth, coin])

  const getGoldPointApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 12000)

      const myHeaders = new Headers()
      myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

      const data = await fetch(
        `${BASE_URL}/gold-point/exchange/histories?page=1&limit=1&sortBy=createdAt:desc`,
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
          Swal.fire("Whoops..", "No  data found", "error")
        else {
          //   console.log("ei holo", response.allHistory);
          setGoldPoint(response.allHistory.total.totalExchangedGP)
          let result = getGoldPointDollarPriceApi(
            response.allHistory.total.totalExchangedGP
          )
        }
      } else Swal.fire("Whoops..", "No data found", "error")
    }
  }

  const getGoldPointDollarPriceApi = async (goldPoints) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 12000)
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const data = await fetch(
      `${BASE_URL}/gold-point/dollar-price?goldPointAmount=${goldPoints}`,
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
      else
        setOwnedGoldPointPrice(response && response.price ? response.price : 0)
    } else Swal.fire("Whoops..", "No  data found", "error")
  }

  const getGPExchangePriceApi = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 12000)
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const data = await fetch(
      `${BASE_URL}/gold-point/exchange/total-exchanged?coin=${coin}`,
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
      ) {
        setCoinPrice(0)
        Swal.fire("Whoops..", "No data found", "error")
      } else {
        setCoinPrice(response.total)
      }
    } else Swal.fire("Whoops..", "No  data found", "error")
  }

  const getGpHistoriesByFilter = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 12000)

      let filter1 = `&email=${userEmail}`
      let filter2 = `&coin=${coin}`
      let filter3 = `&${yearMonth}`

      let searchQuery =
        (userEmail ? filter1 : "") +
        (coin ? filter2 : "") +
        (yearMonth ? filter3 : "")

      const myHeaders = new Headers()
      myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

      const data = await fetch(
        `${BASE_URL}/gold-point/exchange/histories?page=${activePage}&limit=10&sortBy=-createdAt:desc${searchQuery}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      )
      const response = await data.json()
      // console.log(response, "res");

      if (response && response.code === 404) {
        setLoading(false)
        Swal.fire("Whoops..", response.message, "error")
      } else if (response) {
        setLoading(false)

        if (response.code === 401) history.push("/signin")
        else if (
          response.code === 404 ||
          response.code === 400 ||
          response.code === 500
        ) {
          Swal.fire("Whoops..", response.message, "error")
        } else {
          setOrders(response.allHistory.results)
          setTotalUser(response.allHistory.totalResults)
        }
      } else Swal.fire("Whoops..", "No  data found", "error")
    }
  }

  const getGpHistories = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 12000)

      const myHeaders = new Headers()
      myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

      const data = await fetch(
        `${BASE_URL}/gold-point/exchange/histories?page=${activePage}&limit=10&sortBy=-createdAt`,
        {
          method: "GET",
          headers: myHeaders,
        }
      )
      const response = await data.json()
      // console.log(response, "res");

      if (response && response.code === 404) {
        setLoading(false)
        Swal.fire("Whoops..", response.message, "error")
      } else if (response) {
        setLoading(false)
        if (response.code === 401) history.push("/signin")
        else if (response.code === 404)
          Swal.fire("Whoops..", "No user data found", "error")
        else {
          setFirstResult(response.allHistory.results)
          setOrders(response.allHistory.results)
          setTotalUser(response.allHistory.totalResults)
        }
      } else Swal.fire("Whoops..", "No  data found", "error")
    }
  }

  function handleOrderDetails(data) {
    setGpDetails(data)
    setOrderDetailsModal(!orderDetailsModal)
  }

  function orderDetailsModalClose() {
    setOrderDetailsModal(!orderDetailsModal)
    setGpDetails(null)
    setTotalUserOfDetailsId(0)
  }

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber)
    setPageChanged(!pageChanged)
  }

  function updateBchType(cb) {
    setCoin(cb.value)
  }

  function handleDate(date) {
    if (date) {
      let time = moment(date)
      let yearMonth = parseYearMonth(time)
      setYearMonth(yearMonth)
    } else setYearMonth(null)
  }

  function callFilterDetails() {
    if (coin || userEmail || yearMonth) {
      let res = getGpHistoriesByFilter()
    }
  }

  function clearAll() {
    setYearMonth(null)
    setUserEmail(null)
    setCoin(null)
    window.location.reload(true)
  }

  function handleChangeEmail(e) {
    let dat = e.target.value
    setUserEmail(dat)
  }

  return (
    <main className='flex justify-center '>
      {loading && <CustomLoader />}
      <div className=' w-full bg-white rounded-xl p-2 md:p-6'>
        <div>
          <div className='w-96 md:w-full'>
            <div className='grid  grid-cols md:grid-cols-3 gap-4 '>
              <div className='text-center h-32 shadow bg-white  text-black  border p-2 md:p-5 text-base'>
                <p className='py-3 font-medium'>Total Gold Point Exchanged </p>

                <p>{goldPoint}</p>
              </div>

              <div className='text-center h-32 shadow bg-white  text-black  border p-2 md:p-5 text-base'>
                <p className='py-3 font-medium'>
                  {" "}
                  Exchanged Gold Point Dollar Price{" "}
                </p>

                <p>{ownedGoldPointPrice}</p>
              </div>

              {coin && coinPrice ? (
                <div className='text-center h-32 shadow bg-white  text-black  border p-2 md:p-5 text-base'>
                  <p className='py-3 font-medium'> Total {coin} Exchanged: </p>

                  <p>{coinPrice}</p>
                </div>
              ) : (
                <div className=' h-0' />
              )}
            </div>

            <div className='md:mt-8 mt-6    grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='  mt-4 md:mt-0'>
                <p className=' font-title  text-left  text-base md:text-base '>
                  Email
                </p>

                <div className='w-auto my-2'>
                  <div className='bg-gray-200 relative text-gray-600 focus-within:text-gray-400'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                      <div
                        className='p-1 focus:outline-none focus:shadow-outline'
                        tabIndex='-1'
                      >
                        <img src={emailIcon} className='w-6  h-6 ' />
                      </div>
                    </span>
                    <input
                      type='email'
                      onChange={handleChangeEmail}
                      value={userEmail ? userEmail : ""}
                      className='border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-10  focus:outline-none focus:bg-white focus:text-gray-900'
                      name='email'
                      id='email'
                      aria-describedby='email'
                      placeholder='Enter user email'
                      autoComplete='off'
                    />
                  </div>
                </div>
              </div>

              <div className='  mt-4 md:mt-0'>
                <p className='my-1 '> Filter by Coin Type </p>
                <DropDownMenuWithIcon
                  disabled={false}
                  defaultValue={coin ? coin : "Select Coin"}
                  className={"rounded text-black"}
                  options={CoinTypes}
                  selectCallback={updateBchType}
                  placeholder={coin ? coin : "Select Coin"}
                />
              </div>

              <div className='  mt-4 md:mt-0'>
                <p className='my-1  '> Filter by Year and Month </p>
                <Datetime
                  onChange={handleDate}
                  inputProps={inputProps}
                  dateFormat='YYYY-MM'
                  timeFormat={false}
                  className='border-1 p-1.5 w-auto'
                />
              </div>

              <div className='w-auto  mt-4 md:mt-0 overflow   z-auto'>
                {coin || yearMonth || userEmail ? (
                  <button
                    onClick={callFilterDetails}
                    className=' md:mt-8 hover:shadow focus:shadow-xl bg-site-theme px-16   py-2 text-center  text-white hover:text-white focus:outline-none'
                  >
                    Find{" "}
                  </button>
                ) : (
                  <div />
                )}

                {coin || yearMonth || userEmail ? (
                  <button
                    onClick={clearAll}
                    className='overflow m-1 focus:shadow-xl bg-gray-50  px-6   py-1 text-center  text-red-600 border-1 rounded focus:outline-none'
                  >
                    Clear All
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className=' w-full overflow-x-auto'>
          {orders && orders.length ? (
            <table className='my-6  md:w-full md:whitespace-nowrap '>
              <thead>
                <tr className='bg-site-theme  text-white font-bold h-16 w-full leading-none border'>
                  <th className=' text-left pl-4 break-all text-base'>Id</th>
                  <th className=' l text-left pl-4 text-base'>User Email</th>
                  <th className=' l text-left pl-4 text-base'>GP</th>
                  <th className=' text-left pl-4 text-base'>Dollar Price/GP</th>
                  <th className=' text-left pl-4 text-base'>Dollar Price</th>
                  <th className=' text-left pl-4 text-base'>Coin</th>
                  <th className=' text-left pl-4 text-base'>Coin Amount</th>

                  <th className=' text-left pl-4 text-base'>Status</th>
                </tr>
              </thead>

              {orders.map((result) => (
                <tbody className='w-full'>
                  <tr className='group h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow '>
                    {result.status === true ? (
                      <td className=' pl-4'>
                        <p
                          className='text-left group-hover:underline cursor-pointer group-hover:text-site-theme md:font-medium'
                          onClick={() => handleOrderDetails(result)}
                        >
                          {result.id}
                        </p>
                        <p className='text-gray-400 md:text-sm  text-10px break-all'>
                          {result.createdAt &&
                            getReadableTime(result.createdAt)}
                        </p>
                      </td>
                    ) : (
                      <td className=' pl-4'>
                        <p className='cursor-pointer group-hover:underline group-hover:text-site-theme text-sm font-medium leading-none text-gray-800 break-all  '>
                          {result.id}
                        </p>
                      </td>
                    )}

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {result.email}
                      </p>
                    </td>

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {result.goldPointAmount}
                      </p>
                    </td>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {result.dollarPricePerGP}
                      </p>
                    </td>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {result.price}
                      </p>
                    </td>

                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {result.coin}
                      </p>
                    </td>
                    <td className='pl-4'>
                      <p className='text-xs leading-3 text-gray-600 mt-2 break-all'>
                        {result.coinAmount}
                      </p>
                    </td>

                    <td className='pl-4'>
                      {result && result.status === true && (
                        <div className='w-30  rounded bg-gray-600 p-1 text-center bg-green-600 px-4 text-white text-10px md:text-base'>
                          Successful
                        </div>
                      )}
                      {result && result.status === false && (
                        <div className='w-30  rounded bg-gray-600 p-1 text-center bg-site-theme px-4 text-white text-10px md:text-base'>
                          Failed
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : (
            <div />
          )}
        </div>

        {orders && orders.length && totalUser > 10 ? (
          <div className='flex justify-end p-2'>
            <Pagination
              innerClass='pagination flex flex-row'
              activeLinkClass='text-black'
              linkClass='page-link'
              itemClass='p-2 text-site-theme'
              activePage={activePage}
              itemsCountPerPage={10}
              totalItemsCount={totalUser}
              pageRangeDisplayed={6}
              onChange={handlePageChange}
            />
          </div>
        ) : (
          <div />
        )}

        {orderDetailsModal === true && gpDetails && (
          <GpAdminHistoryDetailsModal
            hideButton={false}
            step={step}
            details={gpDetails}
            onClose={orderDetailsModalClose}
          />
        )}
      </div>
    </main>
  )
}
