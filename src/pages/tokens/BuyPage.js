import React, { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { useFormik } from "formik"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"
import idVerify from "../../image/idverify.png"
import Cookies from "js-cookie"
import { BASE_URL } from "../../constants"
import UserManager from "../../libs/UserManager"
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu"
import Warning from "../../components/Message/warning"
import * as PurchaseAPI from "../../apis/purchase"
import CreateBtcModal from "../../components/Modal/CreateBtcAccount"
import Modal from "react-modal"
import CustomLoader from "../../components/CustomLoader/CustomLoader"
import SnowIcon from "../../image/snow.png"
import WolfIcon from "../../image/wolf.png"
import EagleIcon from "../../image/eagle.png"
import { encryptIpAddress } from "../../utils/EncryptDecrypt"
import { customStylesModal2 } from "../../utils/styleFunctions"
import { createBlockChainAccount } from "../../apis/createAccount"

const STEP_PRICE_LIST = "step-price-list"
const STEP_CART_CHECKOUT = "step-cart-checkout"

const CURRENCY_BTC = "BTC"
const CURRENCY_ETH = "ETH"

const validate = (values) => {
  const errors = {}
  const { items, payment_currency } = values

  if (!items.length) {
    errors.items = "Select at least one item to puchase"
  }

  if (!payment_currency) {
    errors.payment_currency = "Select payment currency"
  }

  return errors
}

function LogoOfTokens({ type }) {
  let imageSrc
  if (type === "WOLF") imageSrc = WolfIcon
  if (type === "SNOW") imageSrc = SnowIcon
  if (type === "EAGLE") imageSrc = EagleIcon

  if (type === "WOLF" || type === "SNOW" || type === "EAGLE") {
    return (
      <img
        src={imageSrc}
        alt='logo of bitcoin'
        className='w-8 h-8 rounded-full mr-3'
      />
    )
  } else return ""
}
const exampleOrder = {
  payment_currency: "ETH",
  amount_usd: 3000,
  payment_amount: "1.10620285",
  transaction_fee: "0.000021",
  payment_from_address: "0x7b70e83cda0124db77bfeb0555c9d002ae26f58c",
  order_tokens: [
    {
      quantity: 1000,
      unit: 1,
      bonus: 200,
      token: "WOLF",
    },
    {
      quantity: 40,
      unit: 1,
      bonus: 8,
      token: "EAGLE",
    },
    {
      quantity: 10,
      unit: 1,
      bonus: 2,
      token: "SNOW",
    },
  ],
}

export default function BuyPage() {
  let history = useHistory()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(STEP_PRICE_LIST)
  const [user, setUser] = useState(null)
  const [addresses, setAddresses] = useState({})
  const userInfo = UserManager.getLoggedInUser()
  const [tokenPrices, setTokenPrices] = useState([])
  const [createAccount, setCreateAccount] = useState(null)
  const [cartItems, setCartItems] = useState({ order_tokens: [] })
  const [privateKey, setPrivateKey] = useState("")

  const [etherBalance, setEtherBalance] = useState(null)
  const [bitcoinBalance, setBitcoinBalance] = useState(null)
  const [btcInfo, setBtcInfo] = useState(null)

  const [transacFee, setTransacFee] = useState("")
  // const [otp, setOtp] = useState("")

  const getUserApi = async () => {
    const myHeaders = new Headers()
    // myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
      method: "GET",
      headers: myHeaders,
    })
    const response = await data.json()

    if (response) {
      if (response.code === 401) history.push("/signin")
      else if (response.code === 404)
        Swal.fire("Whoops..", "No user data found", "error")
      else {
        setUser(response.user)
        setAddresses({
          btc: response.btcAccount,
          inputAttributes: {
            autocapitalize: "off",
          },
          eth: response.ethAccount,
        })
        setBtcInfo({
          ether: response.ethAccount ? response.ethAccount.address : "",
          bitcoin: response.btcAccount ? response.btcAccount.address : "",
        })
      }
    } else Swal.fire("Whoops..", "No user data found", "error")
  }

  const getEtherBalance = async () => {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
    const data = await fetch(
      `${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=ETH&type=coin`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    const response = await data.json()

    if (response) {
      // console.log('eth',response.result.balance)
      if (response.code === 401) history.push("/signin")
      else if (response.code === 404 || response.code === 500)
        console.log("Whoops..", "No balance found", "error")
      else
        setEtherBalance(
          response && response.result && response.result.balance
            ? response.result.balance
            : "0"
        )
    } else console.log("Whoops..", "No user data found", "error")
  }

  const getBitcoinBalance = async () => {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
    const data = await fetch(
      `${BASE_URL}/account/get-balance?address=${btcInfo.bitcoin}&currency=BTC&type=coin`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    const response = await data.json()

    if (response) {
      // console.log('btc',response.result.balance)
      if (response.code === 401) history.push("/sign02in")
      else if (response.code === 404 || response.code === 500)
        console.log("Whoops..", "No balance found", "error")
      else
        setBitcoinBalance(
          response && response.result && response.result.balance
            ? response.result.balance
            : "0"
        )
    } else console.log("Whoops..", "No user data found", "error")
  }

  useEffect(() => {
    getUserApi()
    // console.log("user_email: ", user.email)
  }, [])

  useEffect(() => {
    setLoading(true)
    PurchaseAPI.getTokenPriceList()
      .then((res) => {
        if (res.ok) {
          setTokenPrices(res.data)
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: res.data.message,
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const callOrderApi = async () => {
    const myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const data = await fetch(
      `${BASE_URL}/purchase/orders?sortBy=createdAt:desc`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    const response = await data.json()

    if (response) {
      if (response.code === 401) history.push("/signin")
      else if (response.code === 404) {
        Swal.fire("Whoops..", "No orders found", "error")
      } else if (response.code === 540) {
        Swal.fire("Whoops..", "Wrong Private Key", "error")
      } else {
        let result =
          response &&
          response.orders.length &&
          response.orders
            .sort((abc) => abc.length > 0)
            .filter(
              (result) =>
                (result[0] &&
                  result[0].status === "CONFIRMED_PAYMENT_RECEIVED") ||
                (result[0] &&
                  result[0].status === "UNCONFIRMED_PAYMENT_RECEIVED")
            )
        // console.log("res result", result)
        if (result && result.length > 0) {
          return true
        } else if (result === 0 || result.length < 1) return false
      }
    } else return false
  }

  // console.log("check", cartItems)
  function handleSubmitCart() {
    let data = {}
    data.items = formik.values.items.map((item) => ({
      item_id: item.item_id,
      unit_quantity: item.unit_quantity,
    }))
    if (cartItems.result)
      data.payment_currency = cartItems.result.payment_currency
    if (cartItems.result)
      data.payment_from_address = cartItems.result.payment_from_address
    // data.payment_from_pkey = privateKey
    if (user) data.payment_from_user = user.email
    data.token_received_address = addresses.eth.address
    data.transaction_fee = transacFee
      ? transacFee
      : cartItems.result.transaction_fee.medium

    // if (transacFee === "") return
    // formik.values.payment_currency === "BTC" ? "BTC" : "ETH"

    if (
      (formik.values.payment_currency === "ETH" &&
        calcTotal() < etherBalance) ||
      (formik.values.payment_currency === "BTC" && calcTotal() < bitcoinBalance)
    ) {
      // console.log(etherBalance+'ether bal'+ calcTotal()+ bitcoinBalance)
      //check api
      // console.log("cartItems :", cartItems)
      let pendingStatus = callOrderApi().then((pendingStatus) => {
        if (pendingStatus === true) {
          Swal.fire({
            title:
              '<p className="text-2xl text-site-theme"> Sorry! you cannot perform purchase while you have pending order </p>',
            text: "Would you like to see orders list",
            confirmButtonColor: "#ff8c00",
            confirmButtonText: "Confirm",
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              history.push("/orders")
            }
          })
        } else {
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
                  title:
                    "An OTP has been sent to your email addres, Please submit",
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
                  PurchaseAPI.submitOrder(data)
                    .then((res) => {
                      // console.log("submit order: ", res)
                      // console.log(`Order Id is: ${res.data.result.order_id}`)
                      if (res.ok && cartItems.result) {
                        PurchaseAPI.rewardReferralPoint(
                          userInfo.id,
                          res.data.result.order_id,
                          cartItems.result.amount_usd
                        )
                          .then((response) => {
                            setLoading(false)
                            if (response.ok) {
                              setLoading(false)
                              Swal.fire({
                                title: "Success",
                                icon: "success",
                                text: "Order submitted successfully",
                              }).then((res) => {
                                // setOtp("")
                                history.push("/orders")
                              })
                            } else {
                              setLoading(false)
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
                      } else {
                        setLoading(false)
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
      })
      // console.log("denied", pendingStatus)
    } else {
      Swal.fire({
        title: "You do not have sufficient Balance",
        icon: "error",
        text: "Please make sure you have sufficient balance ",
      })
    }
  }

  const formik = useFormik({
    initialValues: {
      items: [],
      payment_currency: "",
    },
    validate,
    onSubmit: (values) => {
      if (values.payment_currency === CURRENCY_BTC) {
        if (!addresses || !addresses.btc) {
          Swal.fire({
            title:
              '<p className="text-2xl text-site-theme"> You do not have any Blockchain account. </p>',
            text: "Create bitcoin accounts",
            confirmButtonColor: "#ff8c00",
            confirmButtonText: "Create Account",
          }).then((result) => {
            if (result.isConfirmed) {
              setLoading(true)
              // hot wallet start
              createBlockChainAccount()
                .then((response) => {
                  setLoading(false)

                  if (response.ok) {
                    // console.log(response,'ether create response');
                    //   setAccountInfo(response.data);
                    // } else {

                    Swal.fire({
                      title: "success",
                      text: "BlockChain Accounts Created successfully",
                      icon: "success",
                      confirmButtonColor: "#ff8c00",
                      confirmButtonText: "Ok",
                    }).then((res) => {
                      if (res.isConfirmed) {
                        window.location.reload()
                      }
                    })
                  }
                })
                .catch((err) => {
                  setLoading(false)
                  Swal.fire("Error", err.message, "error")
                })
              // hot wallet end
              // setCreateAccount("Ether");
            }
          })

          // return;
        }
        values.payment_from_address = addresses.btc.address
        values.payment_from_user = user.email
      } else if (values.payment_currency === CURRENCY_ETH) {
        if (!addresses || !addresses.eth) {
          Swal.fire({
            title:
              '<p className="text-2xl text-site-theme"> You do not have any BlockChain account. </p>',
            text: "Create Blockchain accounts",
            confirmButtonColor: "#ff8c00",
            confirmButtonText: "Create Account",
          }).then((result) => {
            if (result.isConfirmed) {
              setLoading(true)
              // hot wallet start
              createBlockChainAccount()
                .then((response) => {
                  setLoading(false)

                  if (response.ok) {
                    // console.log(response,'btc create response');
                    //   setAccountInfo(response.data);
                    // } else {

                    Swal.fire({
                      title: "success",
                      text: "Blockchain Accounts Created successfully",
                      icon: "success",
                      confirmButtonColor: "#ff8c00",
                      confirmButtonText: "Ok",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        window.location.reload()
                      }
                    })
                  }
                })
                .catch((err) => {
                  setLoading(false)
                  Swal.fire("Error", err.message, "error")
                })
              // hot wallet end
              // setCreateAccount("Bitcoin");
            }
          })

          // return;
        }
        values.payment_from_address = addresses.eth.address
        values.payment_from_user = user.email
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
        let data = JSON.parse(JSON.stringify(values))
        data.items = data.items.map((item) => ({
          item_id: item.item_id,
          unit_quantity: item.unit_quantity,
        }))
        setLoading(true)
        PurchaseAPI.postCartItems(data).then((res) => {
          // console.log("cart calculation api: ", res)
          setLoading(false)
          if (res.ok) {
            setStep(STEP_CART_CHECKOUT)
            // setTransacFee("")
            setCartItems(res.data)
            if (btcInfo) {
              if (btcInfo.ether) {
                getEtherBalance()
              }
              if (btcInfo.bitcoin) {
                getBitcoinBalance()
              }
            }
          } else Swal.fire("Error", res.data.message, "error")
        })
      }
    },
  })

  formik.getTokenQuantity = function (token_id) {
    let item = formik.values.items.find((i) => i.item_id === token_id)
    return item ? item.unit_quantity : 0
  }

  function handlePurchaseUnitChange(tokenItem, e) {
    let token_id = tokenItem.item_id
    let unit = parseFloat(e.target.value)
    let items = formik.values.items || []
    let itemIndex = items.findIndex((i) => i.item_id === token_id)

    if (unit > 0) {
      if (itemIndex > -1) {
        items[itemIndex].unit_quantity = unit
      } else {
        items.push({ tokenItem, item_id: token_id, unit_quantity: unit })
      }
    } else {
      if (itemIndex > -1) items.splice(itemIndex, 1)
    }

    formik.setFieldValue("items", items)
  }

  function getPrice(item) {
    return item.reduce((p, token) => p + parseFloat(token.price.usd), 0)
  }

  function calcSubTotal() {
    return formik.values.items.reduce((p, orderItem) => {
      return p + getBTCAmount(orderItem.tokenItem, orderItem.unit_quantity)
    }, 0)
  }

  function calcTotal() {
    if (cartItems.result) {
      return (
        calcSubTotal() +
        parseFloat(
          transacFee ? transacFee : cartItems.result.transaction_fee.medium
        )
      )
    }
  }

  function getBTCAmount(item, unitQuantity) {
    // let item = tokenExchangeRates.find(tokenItem => tokenItem.token === orderItem.token);
    let paymentCurrency = formik.values.payment_currency.toLowerCase()
    return item.token_info.reduce((p, tokenInfo) => {
      return (
        p +
        parseFloat(tokenInfo.price[paymentCurrency]) * parseFloat(unitQuantity)
      )
    }, 0)

    // return item ? parseFloat(item.price[paymentCurrency]) * parseFloat(orderItem.unit) : 0;

    // let value1= new  BigNumber(p);
    // let value2=  new BigNumber(unitQuantity);
    // let value3= new BigNumber(tokenInfo.price[paymentCurrency]);
    //
    // // let value4= value3.multipliedBy(value2);
    // const  amounts= value1.plus(value4);
    // return p + parseFloat(tokenInfo.price[paymentCurrency]) * parseFloat(unitQuantity);
    // return amounts;
    // if(formik.values.payment_currency==="BTC") {
    //     let item = tokenExchangeRates.find(tokenItem => tokenItem.token === orderItem.token);
    //     return item ? parseFloat(item.price.btc) * parseFloat(orderItem.unit) : 0;
    // }
    // else {
    //     let item = tokenExchangeRates.find(tokenItem => tokenItem.token === orderItem.token);
    //     return item ? parseFloat(item.price.eth) * parseFloat(orderItem.unit) : 0;
    // }
  }

  function getBonusInfo(orderItem) {
    // if (!orderItem.hasBonus) return '';

    let { bonus, token_quantity_per_unit } = orderItem.token_info[0]
    let bonusPercent = (bonus * 100) / token_quantity_per_unit
    return (bonusPercent = Math.round(bonusPercent * 100) / 100)
  }

  function handleModalClose() {
    setStep(STEP_PRICE_LIST)
    // formik.setFieldValue('items', []);
  }

  // console.log(formik.values.payment_currency, "adfsfaf")

  return (
    <Layout>
      <main className='flex justify-center '>
        {loading && <CustomLoader />}
        {!loading && (
          <div className='max-w-3xl bg-white rounded-xl p-2 md:p-6'>
            <div className='rounded-xl border-1  bg-white rounded-xl p-2 md:p-6'>
              <p className='text-xl font-bold pb-4'> Buy </p>
              <form onSubmit={formik.handleSubmit}>
                <div className='w-full bg-gray-100 p-2 md:p-4'>
                  <p className='text-md text-gray-700 text-left py-3'>
                    {" "}
                    Amount{" "}
                  </p>
                  {tokenPrices.map((tokenPrice) => (
                    <div
                      key={tokenPrice.item_id}
                      className='flex w-full border border-black rounded mb-4'
                    >
                      <div className='pr-3 w-3/4 border-r border-black p-2'>
                        <div className='flex justify-between'>
                          <span>
                            {" "}
                            <span className='flex items-center flex-row '>
                              {" "}
                              <LogoOfTokens type={tokenPrice.item_id} />{" "}
                              {tokenPrice.item_id}
                              <span className='text-site-theme ml-3'>
                                {tokenPrice.has_bonus
                                  ? `${getBonusInfo(tokenPrice)}% Bonus`
                                  : ""}{" "}
                              </span>
                            </span>{" "}
                          </span>
                          <a>$ {getPrice(tokenPrice.token_info)}</a>
                        </div>
                        <ul className='px-4'>
                          {tokenPrice.token_info.map((token_info) => (
                            <li className='font-light' key={token_info.token}>
                              {`${token_info.token} 1 unit = ${
                                token_info.token_quantity_per_unit +
                                token_info.bonus
                              } ${token_info.token}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='w-2/4 inline-block p-2'>
                        <input
                          className='border rounded px-3 py-2 w-half'
                          type='number'
                          defaultValue={formik.getTokenQuantity(
                            tokenPrice.item_id
                          )}
                          min='0'
                          onChange={(e) =>
                            handlePurchaseUnitChange(tokenPrice, e)
                          }
                        />{" "}
                        Unit
                      </div>
                    </div>
                  ))}
                  {formik.touched.items && formik.errors.items && (
                    <Warning message={formik.errors.items} />
                  )}
                </div>
                <div className='w-full justify-between mb-2'>
                  {formik.touched.payment_currency &&
                    formik.errors.payment_currency && (
                      <Warning message={formik.errors.payment_currency} />
                    )}
                  <div className='mt-4'>
                    <DropDownMenuWithIcon
                      defaultValue={
                        formik.values.payment_currency
                          ? formik.values.payment_currency === "ETH"
                            ? "Ether"
                            : "Bitcoin"
                          : "Select Original Currency"
                      }
                      className={"rounded text-black"}
                      options={[
                        {
                          label: "Bitcoin",
                          value: CURRENCY_BTC,
                        },
                        {
                          label: "Ether",
                          value: CURRENCY_ETH,
                        },
                      ]}
                      selectCallback={(e) =>
                        formik.setFieldValue("payment_currency", e.value)
                      }
                      placeholder={
                        formik.values.payment_currency
                          ? formik.values.payment_currency
                          : "Select Original Currency"
                      }
                    />
                  </div>
                </div>
                <button
                  type='submit'
                  className='hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold'
                >
                  Add to Cart
                </button>
              </form>
            </div>
          </div>
        )}
        {step === STEP_CART_CHECKOUT && (
          <Modal
            isOpen={true}
            contentLabel='onRequestClose Example'
            onRequestClose={handleModalClose}
            shouldCloseOnOverlayClick={false}
            style={customStylesModal2}
            ariaHideApp={false}
          >
            <div>
              <div className='w-full md:max-w-7xl mx-auto bg-white rounded-xl p-2 md:p-4'>
                <div className='rounded-xl border-1  bg-white rounded-xl p-2 md:p-6'>
                  <p className='text-xl font-bold py-4'> Buy </p>

                  <div className=''>
                    <p className='text-md px-2 py-3'>Cart </p>
                    <table className='w-full border border-black'>
                      <thead className='border border-black'>
                        <tr>
                          <th className='border-r border-black'>Token</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody className='border border-black'>
                        {formik.values.items.map(
                          ({ tokenItem, item_id, unit_quantity }, index) => (
                            <tr key={index}>
                              <td className='px-2 border-r border-black'>
                                {item_id}{" "}
                                {tokenItem.has_bonus
                                  ? `${getBonusInfo(tokenItem)}% Bonus`
                                  : ""}
                              </td>
                              <td>
                                <div className='px-2 flex justify-between'>
                                  <a>{unit_quantity} Unit</a>
                                  <a>
                                    {getBTCAmount(tokenItem, unit_quantity)}{" "}
                                    {formik.values.payment_currency === "BTC"
                                      ? "BTC"
                                      : "ETH"}
                                  </a>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                        <tr className='border-t border-black'>
                          <td className='px-2 border-r border-black'>
                            Sub total
                          </td>
                          <td className='px-2 text-right'>
                            {calcSubTotal()}{" "}
                            {formik.values.payment_currency === "BTC"
                              ? "BTC"
                              : "ETH"}
                          </td>
                        </tr>
                        {cartItems.result && (
                          <tr>
                            <td className='px-2 border-r border-black'>
                              Transaction Fee
                            </td>
                            <td className='px-2 text-right'>
                              {transacFee
                                ? transacFee
                                : cartItems.result.transaction_fee.medium}{" "}
                              {formik.values.payment_currency === "BTC"
                                ? "BTC"
                                : "ETH"}
                            </td>
                          </tr>
                        )}
                        <tr className='border-t border-black'>
                          <td className='px-2 border-r border-black'>Total</td>
                          <td className='px-2 text-right'>
                            {calcTotal()}{" "}
                            {formik.values.payment_currency === "BTC"
                              ? "BTC"
                              : "ETH"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/* <div className='flex w-full pt-6 pb-4 items-center '>
                      <label className='w-24'>Private Key</label>
                      <input
                        name='pKey'
                        className='border-2 py-2 w-full text-sm text-black bg-white rounded-md px-2 focus:outline-none focus:bg-white focus:text-gray-900'
                        onChange={(e) => setPrivateKey(e.target.value)}
                      />
                    </div>
                    {!privateKey && <Warning message='This is required' />} */}

                    {cartItems.result && (
                      <div className='mt-4 mx-auto text-center'>
                        <span className='text-gray-700'>Transection Fee</span>
                        <div className='md:flex md:items-center'>
                          <div className='md:w-1/3 ml-16'></div>
                          <div className='md:w-1/5'>
                            <input
                              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
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
                              value={cartItems.result.transaction_fee.low}
                            />
                            <span className='ml-2'>Low</span>
                          </label>
                          <label className='inline-flex items-center ml-6'>
                            <input
                              type='radio'
                              className='form-radio'
                              name='accountType'
                              checked
                              onChange={(e) => {
                                setTransacFee(e.target.value)
                              }}
                              value={cartItems.result.transaction_fee.medium}
                            />
                            <span className='ml-2'>Medium</span>
                          </label>
                          <label className='inline-flex items-center ml-6'>
                            <input
                              type='radio'
                              className='form-radio'
                              name='accountType'
                              onChange={(e) => setTransacFee(e.target.value)}
                              value={cartItems.result.transaction_fee.high}
                            />
                            <span className='ml-2'>High</span>
                          </label>
                        </div>
                        {/* {!transacFee && <Warning message='Please Select One' />} */}
                      </div>
                    )}

                    <button
                      onClick={() => setStep(STEP_PRICE_LIST)}
                      className='my-3 hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-gray-400 font-semibold'
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmitCart}
                      className='hover:font-bold px-6 py-3 inline-flex justify-center w-full text-sm transition-colors duration-150 dark:hover:text-gray-200 text-white bg-site-theme font-semibold'
                    >
                      Submit Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </main>

      {/* {createAccount && createAccount !== "" && (
        <CreateBtcModal
          // open={true}
          createAccount={createAccount}
          // cbCreate={() => setCreateAccount(null)}
        />
      )} */}

      {/*<form onSubmit={formik.handleSubmit}>*/}
      {/*<div*/}
      {/*className="border-1 border-black  hover:bg-white md:shadow rounded w-full md:w-70 md:border-t-1  mt-12 items-center justify-center md:mx-auto ">*/}
      {/*<div*/}
      {/*className="py-6 md:px-12 md:px-0 lg:px-0 xl:px-0 w-full  items-center justify-center md:mx-auto  ">*/}
      {/*<div className="mx-auto p-4  mt-12 mb-2 ">*/}
      {/*<h2 className="pt-8 pb-4  text-black  text-xl lg:text-2xl  text-center ">Buy/Sell*/}
      {/*</h2>*/}

      {/*<div className="w-100 m-3">*/}

      {/*<div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">*/}
      {/*<span className="absolute inset-y-0 left-0 flex items-center pl-2">*/}
      {/*<div  className="p-1 focus:outline-none focus:shadow-outline">*/}
      {/*<img src={emailIcon} className="w-6  h-6 " />*/}
      {/*</div>*/}
      {/*</span>*/}
      {/*<input type="email"*/}
      {/*onChange={formik.handleChange}*/}
      {/*//    onBlur={formik.handleBlur}*/}
      {/*value={formik.values.email}*/}
      {/*className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"*/}
      {/*name="email"*/}
      {/*id="email"*/}
      {/*aria-describedby="sign-in-email"*/}
      {/*placeholder="Enter your email"*/}
      {/*autoComplete="off" />*/}
      {/*</div>*/}

      {/*{formik.touched.email && formik.errors.email && (*/}
      {/*<div className="bg-red-100 my-2 py-2 text-red-700">{formik.errors.email}</div>)}*/}
      {/*</div>*/}
      {/*<div className="m-3 pt-4">*/}

      {/*<div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">*/}
      {/*<span className="absolute inset-y-0 left-0 flex items-center pl-2">*/}
      {/*<div  className="p-1 focus:outline-none focus:shadow-outline">*/}
      {/*<img src={passwordIcon} className="w-6  h-6 " />*/}
      {/*</div>*/}
      {/*</span>*/}

      {/*<input type="text"*/}
      {/*onChange={formik.handleChange}*/}
      {/*//    onBlur={formik.handleBlur}*/}
      {/*value={formik.values.money}*/}
      {/*className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"*/}
      {/*name="cash"*/}
      {/*id="cash"*/}
      {/*aria-describedby="sign-in-email"*/}
      {/*placeholder="Enter cash address"*/}
      {/*autoComplete="off" />*/}
      {/*</div>*/}

      {/*{formik.touched.money && formik.errors.money && (*/}
      {/*<div className="my-2 bg-red-100 py-2 text-red-700">{formik.errors.money}</div>)}*/}
      {/*</div>*/}

      {/*</div>*/}

      {/*<div className="text-center items-center justify-center mt-6">*/}
      {/*<button*/}
      {/*type="submit"*/}
      {/*className="w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md">*/}
      {/*Buy*/}
      {/*</button>*/}
      {/*</div>*/}
      {/*</div>*/}

      {/*</div>*/}
      {/*</form>*/}
    </Layout>
  )
}
