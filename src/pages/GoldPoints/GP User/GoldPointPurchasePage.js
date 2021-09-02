import React, { useEffect, useState } from "react"
import UserManager from "../../../libs/UserManager"
import { isLoggedIn } from "../../../libs/AuthManager"
import { useHistory } from "react-router-dom"
import CustomLoader from "../../../components/CustomLoader/CustomLoader"
import Cookies from "js-cookie"
import { BASE_URL } from "../../../constants"
import Swal from "sweetalert2"
import DropDownMenuWithIcon from "../../../components/Dropdown/DropDownWithMenu"
import Modal from "react-modal"
import { customStylesModal2 } from "../../../utils/styleFunctions"
import * as PurchaseAPI from "../../../apis/purchase"
import idVerify from "../../../image/idverify.png"
import Warning from "../../../components/Message/warning"
import CreateBtcModal from "../../../components/Modal/CreateBtcAccount"

export default function GPPointsPurchasePage() {
  const history = useHistory()
  const [user, setUser] = useState(null)
  const [coinTypes, setCoinTypes] = useState(null)
  const [selectedCoin, setSelectedCoin] = useState("")
  const [loading, setLoading] = useState(false)
  const [goldPoint, setGoldPoint] = useState(null)
  const [gpPrice, setGpPrice] = useState(null)
  const userInfo = UserManager.getLoggedInUser()
  const [unit, setUnit] = useState(0)
  const [purchaseModal, setPurchaseModal] = useState(false)
  const [btcInfo, setBtcInfo] = useState(null)
  const [createAccount, setCreateAccount] = useState(null)
  const [showError, setShowError] = useState(false)

  const [transacFee, setTransacFee] = useState("")
  const [cartFee, setCartFee] = useState("")

  const isUserLoggedIn = isLoggedIn()

  if (!isUserLoggedIn) {
    history.push("/signin")
  }

  useEffect(() => {
    let user = getUserApi()
    let point = getGoldPointApi()
    let availableCoin = getAvailableCoinTypes()
  }, [])

  useEffect(() => {
    let data = getGpPricePerUnit()
  }, [selectedCoin, unit])

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
      else {
        setUser(response.user)
        setBtcInfo({
          ether: response.ethAccount ? response.ethAccount.address : "",
          bitcoin: response.btcAccount ? response.btcAccount.address : "",
        })
      }
    } else console.log("Whoops..", "No user data found", "error")
  }

  const getGoldPointApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true)

      const myHeaders = new Headers()
      myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

      const data = await fetch(`${BASE_URL}/gold-point`, {
        method: "GET",
        headers: myHeaders,
      })
      const response = await data.json()

      if (response) {
        setLoading(false)

        if (response.code === 401) history.push("/signin")
        else if (response.code === 404)
          Swal.fire("Whoops..", "No  data found", "error")
        else {
          setGoldPoint(response.goldPoints)
        }
      } else Swal.fire("Whoops..", "No data found", "error")
    }
  }
  const getAvailableCoinTypes = async () => {
    if (userInfo && Cookies.get("access-token")) {
      const myHeaders = new Headers()
      myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
      const data = await fetch(
        `${BASE_URL}/gold-point/exchange/exchange-rates?status=Enabled`,
        {
          method: "GET",
          headers: myHeaders,
        }
      )
      const response = await data.json()

      if (response) {
        if (response.code === 401) history.push("/signin")
        else if (response.code === 404 || response.code === 403)
          Swal.fire(
            "Whoops..",
            "Some thing wrong with backend,Please come back later",
            "error"
          )
        else {
          setCoinTypes(response.rates)
        }
      } else
        Swal.fire(
          "Whoops..",
          "Some thing wrong with backend,Please come back later",
          "error"
        )
    }
  }

  const getGpPricePerUnit = async () => {
    if (userInfo && Cookies.get("access-token") && unit > 0) {
      setLoading(true)
      const myHeaders = new Headers()
      myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
      const data = await fetch(
        `${BASE_URL}/gold-point/exchange//evaluation?coin=${selectedCoin}&unit=${unit}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      )
      const response = await data.json()

      if (response) {
        setLoading(false)

        if (response.code === 401) history.push("/signin")
        else if (response.code === 404 || response.code === 403)
          Swal.fire(
            "Whoops..",
            "Some thing wrong with backend,Please come back later",
            "error"
          )
        else {
          setGpPrice(response)
        }
      } else
        Swal.fire(
          "Whoops..",
          "Some thing wrong with backend,Please come back later",
          "error"
        )
    } else setGpPrice(0)
  }

  function updateBchType(cb) {
    setSelectedCoin(cb.value)
    setGpPrice(null)
  }

  function handleUnitChange(e) {
    const re = /^[0-9\b]+$/
    if (e.target.value === "" || re.test(e.target.value)) {
      setUnit(e.target.value)
      setShowError(false)
    } else {
      setShowError(true)
    }
    setGpPrice(null)
  }

  function handlePurchase() {
    if (selectedCoin && unit > 0 && gpPrice) {
      if (goldPoint > gpPrice.goldPointAmount) {
        // let types = selectedCoin
        let data_tx = {}

        data_tx = {
          currency: selectedCoin,
          type:
            selectedCoin === "ETH" || selectedCoin === "BTC" ? "coin" : "erc20",
          from_address:
            selectedCoin === "BTC" ? btcInfo.bitcoin : btcInfo.ether,
          user: userInfo.email,
          to_address: selectedCoin === "BTC" ? btcInfo.bitcoin : btcInfo.ether,
          amount: `${gpPrice.totalCoinAmount}`,
          // transaction_fee: transacFee, //`${gpPrice.totalCoinAmount}`
          // pkey: encryptIpAddress(values.privateKey),
          // from_type: "normal",
        }
        PurchaseAPI.getTransectionFee(data_tx).then((res) => {
          if (res.ok) {
            // setTransacFee("")
            setCartFee(res.data)
            // console.log("response", res);
            // success
          } else Swal.fire("Error", res.data.message, "error")
        })
        setPurchaseModal(true)
      } else
        Swal.fire(
          "Insufficient Gold Coin",
          "You don't have sufficient Gold Coin to complete this purchase",
          "error"
        )
    }
  }

  function handleModalClose() {
    let type = selectedCoin

    if (
      type === "SNOW" ||
      type === "WOLF" ||
      type === "EAGLE" ||
      type === "ETH"
    ) {
      if (btcInfo && (!btcInfo.ether || btcInfo.ether.length < 1)) {
        Swal.fire({
          title:
            '<p class="text-2xl text-site-theme"> You do not have a Bitcoin account. </p>',
          text: "Create a bitcoin account",
          confirmButtonColor: "#ff8c00",
          confirmButtonText: "Create Account",
        }).then((result) => {
          if (result.isConfirmed) {
            setCreateAccount("Bitcoin")
          }
        })

        // return;
      }
    } else if (type === "BTC") {
      if (btcInfo && (!btcInfo.bitcoin || btcInfo.bitcoin.length < 1)) {
        Swal.fire({
          title:
            '<p class="text-2xl text-site-theme"> You do not have a Ether account. </p>',
          text: "Create a ether account",
          confirmButtonColor: "#ff8c00",
          confirmButtonText: "Create Account",
        }).then((result) => {
          if (result.isConfirmed) {
            setCreateAccount("Ether")
          }
        })
      }
    }

    if (user && user.approvalStatus === false) {
      Swal.fire({
        title: "Identity Verification",
        text: "Please complete basic information to continue",
        imageUrl: idVerify,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Identity verification image",
        confirmButtonColor: "#ff8c00",
        confirmButtonText: "Verify Now",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          history.push("/profile/verify")
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info")
        }
      })
    } else {
      setPurchaseModal(!purchaseModal)
    }
  }

  function getAddress(type) {
    if (type === "SNOW" || type === "WOLF" || type === "EAGLE") {
      return btcInfo.ether
    } else return btcInfo.bitcoin
  }

  function handleSubmitCart() {
    let data = {
      coin: gpPrice.coin,
      unit: gpPrice.unit,
      price: gpPrice.price,
      coinAmount: gpPrice.coinAmount,
      bonusAmount: gpPrice.bonusAmount,
      totalCoinAmount: gpPrice.totalCoinAmount,
      goldPointAmount: gpPrice.goldPointAmount,
      toAddress: getAddress(selectedCoin),
      transactionFee: transacFee ? transacFee : cartFee.result.medium,
    }
    // "toAddress": "0x8613c52A6ae2ad6442457F31Ad4aEA30CB8647eD"

    // console.log(getAddress(selectedCoin), "afdsfadsfdsafsdf")

    Swal.fire({
      title: "Send OTP",
      showCancelButton: true,
      confirmButtonText: "Send",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        PurchaseAPI.getOTP()
      },
      // allowOutsideClick: () => !Swal.isLoading(),
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "An OTP has been sent to your email addres, Please submit",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
            preConfirm: (otpValue) => {
              // PurchaseAPI.getOTP()
              // console.log("otp call hoise")
              // .then((response) => {
              // setOtp(otpValue)

              data.otp = otpValue

              // console.log(otpValue)
            },
            // allowOutsideClick: () => !Swal.isLoading(),
          }).then(() => {
            // console.log("otp data: ", data.otp)

            setLoading(true)
            PurchaseAPI.submitGPOrder(data)
              .then((res) => {
                setLoading(false)
                if (res.ok) {
                  // console.log(res, "res check")
                  Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: res.data.message,
                  }).then((res) => {
                    setPurchaseModal(!purchaseModal)
                    history.push("/gp-history")
                  })
                } else {
                  Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: res.data.message,
                  })
                }
              })
              .catch((err) => {
                setLoading(false)
                Swal.fire("Error", err.message, "error")
              })
          })
        }
      })

      // })
      .catch((error) => {
        Swal.showValidationMessage(`Request failed: ${error}`)
      })
  }

  return (
    <main className='flex justify-center '>
      {loading && <CustomLoader />}
      <div className=' border-1  bg-white rounded-xl p-2 md:p-6 mt-6  '>
        <div className='font-bold block border-1 px-4 py-2 text-left w-96 text-base bg-site-theme text-white rounded-sm '>
          Available Gold Point: {""} {goldPoint ? goldPoint : "0"}
        </div>

        <div className='py-12 font-bold px-4 py-2 text-left  text-base underline'>
          Exchange Gold Point
        </div>

        <div className='py-6 md:flex px-4'>
          <div className='flex items-center'>
            <strong> Coin</strong>

            <div className='w-64  ml-4'>
              <DropDownMenuWithIcon
                disabled={coinTypes ? false : true}
                defaultValue={"Select Coin"}
                className={"rounded text-black"}
                options={
                  coinTypes
                    ? coinTypes.map((obj) => ({
                        label: obj.coin,
                        value: obj.coin,
                      }))
                    : []
                }
                selectCallback={updateBchType}
                placeholder={selectedCoin ? selectedCoin : "Select Coin"}
              />
            </div>
          </div>
          <div className='md:ml-16 flex items-center md:my-0 my-6'>
            <strong> Unit</strong>

            <div className=' md:ml-4 ml-4 '>
              <input
                className='border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 focus:outline-none w-32'
                type='number'
                defaultValue={1}
                min='1'
                step='1'
                pattern='[0-9]'
                id='price'
                name='price'
                onChange={handleUnitChange}
                value={unit}
              />
            </div>
            {/*{showError===true ? (*/}
            {/*<label*/}
            {/*className="ml-4 mb-4 mt-4  w-full px-2 py-2 bg-red-100 text-red-900 text-md "*/}
            {/*title="close"*/}
            {/*>*/}
            {/*Input should be positive number*/}
            {/*</label>*/}
            {/*) : (*/}
            {/*<p />*/}
            {/*)}*/}
          </div>
        </div>

        {!loading && gpPrice ? (
          <div>
            <div className='bg-opacity-20 font-medium block border-1 px-4 py-2 text-left w-96 text-base bg-site-theme text-gray-600 rounded-sm my-4'>
              Amount of Coin: {""} {gpPrice ? gpPrice.coinAmount : "0"}
              {""} {selectedCoin}
            </div>

            <div className='bg-opacity-20 font-medium block border-1 px-4 py-2 text-left w-96 text-base bg-site-theme text-gray-600  rounded-sm my-4'>
              Bonus Coin: {""} {gpPrice ? gpPrice.bonusAmount : "0"} {""}{" "}
              {selectedCoin}
            </div>

            <div className='bg-opacity-20 font-medium block border-1 px-4 py-2 text-left w-96 text-base bg-site-theme text-gray-600  rounded-sm my-4'>
              Total Coin: {""} {gpPrice ? gpPrice.totalCoinAmount : "0"} {""}{" "}
              {selectedCoin}
            </div>

            <div className='bg-opacity-20 font-medium block border-1 px-4 py-2 text-left w-96 text-base bg-site-theme text-gray-600  rounded-sm my-4'>
              Gold Point Amount: {""} {gpPrice ? gpPrice.goldPointAmount : "0"}
            </div>

            <div className='text-center my-16 '>
              <button
                onClick={handlePurchase}
                className='focus:outline-none rounded my-8 flex items-center mx-auto hover:font-bold px-6 py-3  w-auto px-12  text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold'
              >
                Purchase
              </button>
            </div>
          </div>
        ) : (
          <div className='py-64' />
        )}

        {purchaseModal === true && (
          <Modal
            isOpen={true}
            contentLabel='onRequestClose Example'
            onRequestClose={handleModalClose}
            shouldCloseOnOverlayClick={false}
            style={customStylesModal2}
            ariaHideApp={false}
          >
            <div>
              <div className='w-full md:max-w-7xl mx-auto bg-white md:rounded-xl p-0 md:p-4'>
                <div className=' md:border-1  bg-white md:rounded-xl p-0 md:p-6'>
                  <p className='text-xl font-bold py-4'>Confirm Purchase </p>

                  <div className=''>
                    <table className='w-full border-2 border-yellow-400'>
                      <tbody className='border border-black'>
                        <tr className='border-r border-yellow-400 w-full'>
                          <td className='text-gray-600  font-bold border-2 border-yellow-400 w-48 py-2 px-2'>
                            {" "}
                            Coin Details
                          </td>

                          <td className=''>
                            <table className='w-full '>
                              <tbody className=''>
                                <tr className=''>
                                  <td className='px-2 border-r border-black font-bold w-1/2'>
                                    Coin
                                  </td>
                                  <td className='px-2 text-center font-bold w-1/2'>
                                    {selectedCoin}
                                  </td>
                                </tr>
                                <tr>
                                  <td className='px-2 border-r border-black font-bold w-1/2'>
                                    Coin Amount
                                  </td>
                                  <td className='px-2 text-center font-bold w-1/2'>
                                    {gpPrice.coinAmount}
                                  </td>
                                </tr>
                                <tr className='border-b-2 border-black '>
                                  <td className='px-2 border-r border-black font-bold w-1/2'>
                                    Unit
                                  </td>
                                  <td className='px-2 text-center font-bold w-1/2'>
                                    {gpPrice.unit}
                                  </td>
                                </tr>

                                <tr className=' py-2'>
                                  <td className='px-2 border-r border-black font-bold w-1/2'>
                                    Sub Total
                                  </td>
                                  <td className='px-2 text-center font-bold w-1/2'>
                                    {gpPrice.coinAmount}
                                  </td>
                                </tr>

                                <tr className=''>
                                  <td className='px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Bonus Coin
                                  </td>
                                  <td className='px-2 text-center font-bold w-1/2'>
                                    {gpPrice.bonusAmount}
                                  </td>
                                </tr>

                                <tr className='border-t-2 border-black'>
                                  <td className='px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Total Coin Amount
                                  </td>
                                  <td className='px-2 text-center font-bold w-1/2'>
                                    {gpPrice.totalCoinAmount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        <tr>
                          <td className='text-gray-600  font-bold  border-2 border-yellow-400 w-48 py-2 px-2'>
                            Gold Point Details
                          </td>

                          <td>
                            <table className='w-full '>
                              <tbody className=''>
                                <tr className='border-t-2 border-yellow-400'>
                                  <td className='break-all  px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Gold Point Available
                                  </td>
                                  <td className='break-all px-2 text-center font-bold w-1/2'>
                                    {goldPoint}
                                  </td>
                                </tr>

                                <tr className=''>
                                  <td className='break-all px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Gold Point Spent
                                  </td>
                                  <td className='break-all px-2 text-center font-bold w-1/2'>
                                    {gpPrice.goldPointAmount}
                                  </td>
                                </tr>

                                <tr className='border-t-2 border-black'>
                                  <td className='break-all px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Gold Point Remaining
                                  </td>
                                  <td className='break-all px-2 text-center font-bold w-1/2'>
                                    {goldPoint - gpPrice.goldPointAmount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-gray-600  font-bold  border-2 border-yellow-400 w-48 py-2 px-2'>
                            Fee
                          </td>

                          <td>
                            <table className='w-full '>
                              <tbody className=''>
                                <tr className='border-t-2 border-yellow-400'>
                                  <td className='break-all  px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    transaction Fee
                                  </td>

                                  {cartFee.result && (
                                    <td className='break-all px-2 text-center font-bold w-1/2'>
                                      {transacFee
                                        ? transacFee
                                        : cartFee.result.medium}
                                      {selectedCoin === "WOLF" ||
                                      selectedCoin === "EAGLE" ||
                                      selectedCoin === "SNOW" ||
                                      selectedCoin === "ETH"
                                        ? "ETH"
                                        : "BTC"}
                                    </td>
                                  )}
                                </tr>

                                {/* <tr className=''>
                                  <td className='break-all px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Gold Point Spent
                                  </td>
                                  <td className='break-all px-2 text-center font-bold w-1/2'>
                                    {gpPrice.goldPointAmount}
                                  </td>
                                </tr>

                                <tr className='border-t-2 border-black'>
                                  <td className='break-all px-2 py-2 border-r border-black text-black font-bold w-1/2'>
                                    Gold Point Remaining
                                  </td>
                                  <td className='break-all px-2 text-center font-bold w-1/2'>
                                    {goldPoint - gpPrice.goldPointAmount}
                                  </td>
                                </tr> */}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {cartFee.result && (
                      <div className='mt-4 mx-auto text-center'>
                        <span className='text-gray-700'>Transaction Fee</span>
                        <div class='md:flex md:items-center'>
                          <div class='md:w-1/3 ml-16'></div>
                          <div class='md:w-1/5'>
                            <input
                              class='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                              type='text'
                              onChange={(e) => setTransacFee(e.target.value)}
                              value={transacFee}
                            />
                          </div>
                        </div>
                        <div className='mt-2'>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              className='form-radio'
                              name='accountType'
                              onChange={(e) => setTransacFee(e.target.value)}
                              value={cartFee.result.low}
                            />
                            <span className='ml-2'>Low</span>
                          </label>
                          <label className='inline-flex items-center ml-6'>
                            <input
                              type='radio'
                              className='form-radio'
                              name='accountType'
                              onChange={(e) => setTransacFee(e.target.value)}
                              value={cartFee.result.medium}
                            />
                            <span className='ml-2'>Medium</span>
                          </label>
                          <label className='inline-flex items-center ml-6'>
                            <input
                              type='radio'
                              className='form-radio'
                              name='accountType'
                              checked
                              onChange={(e) => setTransacFee(e.target.value)}
                              value={cartFee.result.high}
                            />
                            <span className='ml-2'>High</span>
                          </label>
                        </div>
                        {/* {!transacFee && <Warning message='Please Select One' />} */}
                      </div>
                    )}

                    <button
                      onClick={() => setPurchaseModal(!purchaseModal)}
                      className='my-3 hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-gray-400 font-semibold'
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSubmitCart}
                      className='focus:outline-none hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold'
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* {createAccount && createAccount !== "" && (
          <CreateBtcModal
            open={true}
            createAccount={createAccount}
            cbCreate={() => setCreateAccount(null)}
          />
        )} */}
      </div>
    </main>
  )
}
