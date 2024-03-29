import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import BchAddressIcon from "../../image/icons/bchAddress.png";
import MoneyIcon from "../../image/icons/money.svg";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import idVerify from "../../image/idverify.png";
import Cookies from "js-cookie";
import { BASE_URL } from "../../constants";
import UserManager from "../../libs/UserManager";
import Warning from "../../components/Message/warning";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";
import * as FetchApi from "../../libs/FetchApi";
import Loader from "react-loader-spinner";
import {
  getBtcBalance,
  getEagleBalance,
  getEtherBalance,
  getSnowBalance,
  getWolfBalance,
} from "../../apis/balance";
import { encryptIpAddress } from "../../utils/EncryptDecrypt";

const TYPE_WOLF = "WOLF";
const TYPE_EAGLE = "EAGLE";
const TYPE_SNOW = "SNOW";
const TYPE_ETH = "ETH";
const TYPE_BTC = "BTC";
export default function SellPage() {
  let history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [currencyError, setCurrencyError] = useState(false);
  const [btcInfo, setBtcInfo] = useState(null);

  const userInfo = UserManager.getLoggedInUser();

  const getUserApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );
      const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const response = await data.json();

      if (response) {
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          console.log("Whoops..", "No user data found", "error");
        else {
          setUser(response.user);
          setBtcInfo({
            ether: response.ethAccount ? response.ethAccount.address : "",
            bitcoin: response.btcAccount ? response.btcAccount.address : "",
          });
        }
      } else console.log("Whoops..", "No user data found", "error");
    }
  };

  useEffect(() => {
    getUserApi();
  }, []);

  function updateSelectValue(value) {
    setTokens(value.value);
    setCurrencyError(false);
  }

  const formik = useFormik({
    initialValues: {
      address: "",
      money: "",
      privateKey: "",
    },
    validateOnChange: true,
    validate: async (values) => {
      setLoading(true);
      const errors = {};
      const { address, money, privateKey } = values;

      let srcAddress =
        userInfo && tokens === "BTC" ? btcInfo.bitcoin : btcInfo.ether;

      if (!money) {
        errors.money = "Required";
      } else if (tokens === TYPE_WOLF) {
        let regex = new RegExp(/^\d+(\.\d{1,8})?$|\.\d{1,8}?$/);
        if (!regex.test(money)) {
          errors.money = "WOLF can take maximum 8 digits after decimel.";
        }
        if (money < 0.000001) {
          errors.money = "Must be greater than or equals to 0.00000100";
        }
        let balance = await getWolfBalance(srcAddress);
        if (balance < money) {
          errors.money =
            "Can not send more than your balance. Current balance " + balance;
        }
      } else if (tokens === TYPE_EAGLE) {
        let regex = new RegExp(/^\d+$/);
        if (!regex.test(money)) {
          errors.money = "EAGLE does not take any decimel number.";
        }
        if (money < 0.0) {
          errors.money = "Must be greater than 0.0";
        }
        let balance = await getEagleBalance(srcAddress);
        console.log(balance);
        if (balance < money) {
          errors.money =
            "Can not send more than your balance. Current balance " + balance;
        }
      } else if (tokens === TYPE_SNOW) {
        let regex = new RegExp(/^\d+$/);
        if (!regex.test(money)) {
          errors.money = "SNOW does not take any decimel number.";
        }
        if (money < 0.0) {
          errors.money = "Must be greater than 0.0";
        }
        let balance = await getSnowBalance(srcAddress);

        if (balance < money) {
          errors.money =
            "Cannnot send more than your balance. Current balance " + balance;
        }
      } else if (tokens === TYPE_ETH) {
        let regex = new RegExp(/^\d+(\.\d{1,8})?$|\.\d{1,8}?$/);
        if (!regex.test(money)) {
          errors.money = "ETHEREUM can take maximum 8 digits after decimel.";
        }
        if (money < 0.000001) {
          errors.money = "Must be greater than or equals to 0.00000100";
        }
        let balance = await getEtherBalance(srcAddress);
        if (balance < money) {
          errors.money =
            "Can not send more than your balance. Current balance " + balance;
        }
      } else if (tokens === TYPE_BTC) {
        let regex = new RegExp(/^\d+(\.\d{1,8})?$|\.\d{1,8}?$/);
        if (!regex.test(money)) {
          errors.money = "BITCOIN can take maximum 8 digits after decimel.";
        }
        if (money < 0.000001) {
          errors.money = "Must be greater than or equals to 0.00000100";
        }
        let balance = await getBtcBalance(srcAddress);
        console.log(balance, "b");
        if (balance < money) {
          errors.money =
            "Can not send more than your balance. Current balance " + balance;
        }
      }

      if (!address) {
        errors.address = "Required";
      }

      if (user && user.role === "user" && !privateKey) {
        errors.privateKey = "Required";
      }
      // else if (!isValidEmail(address)) {
      //     errors.address = 'Invalid bch address';
      // }

      console.log("error", errors);
      setLoading(false);
      return errors;
    },
    onSubmit: (values) => {
      console.log("s", values);
      if (tokens) {
        let data = {};
        if (user.role === "user") {
          data = {
            currency: tokens,
            type: "coin",
            fromAddress:
              tokens === TYPE_BTC && btcInfo ? btcInfo.bitcoin : btcInfo.ether,
            toAddress: values.address,
            amount: `${values.money}`,
            pkey: encryptIpAddress(values.privateKey),
            from_type: "normal",
          };
        }

        if (user.role === "admin") {
          data = {
            currency: tokens,
            type: tokens === "ETH" || tokens === "BTC" ? "coin" : "erc20",
            toAddress: values.address,
            amount: `${values.money}`,
            from_type: "admin",
          };
        }

        if (
          user &&
          (user.approvalStatus === "approved" ||
            user.role === "admin" ||
            user.role === "user")
        ) {
          setLoading(true);
          FetchApi.sendPostRequest("/account/transfer", data, {
            credential: true,
          })
            .then((res) => {
              if (res.ok) {
                // console.log("response", res);
                // success
                Swal.fire(
                  res.data.result.message,
                  `Tx Id: ${res.data.result.txId}`,
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
        } else {
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
                  history.push("/profile/verify");
              } else if (result.isDenied) {
                  Swal.fire("Changes are not saved", "", "info");
              }
          });
        }
      } else setCurrencyError(true);
    },
  });

  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="relative md:border-1 md:border-black  hover:bg-white md:shadow md:rounded w-full md:w-70 md:border-t-1  mt-12 items-center justify-center md:mx-auto ">
          <div className="md:px-16 md:my-12  px-4  my-6 w-full  items-center justify-center  ">
            <div className="mx-auto   ">
              <h2 className="pt-4  font-title text-black  text-xl lg:text-3xl uppercase text-center font-bold ">
                SEND TOKEN
              </h2>

              <div className="w-100 m-4 ">
                <div className="py-6 flex">
                  <p className=" font-title  text-left  text-base md:text-xl ">
                    Token :{" "}
                  </p>
                  <div className="ml-6 w-48 md:w-64">
                    <DropDownMenuWithIcon
                      className={"w-64 text-black"}
                      options={
                          userInfo && userInfo.role === "user"
                          ? [
                              {
                                label: "ETHEREUM",
                                value: TYPE_ETH,
                              },
                              {
                                label: "BITCOIN",
                                value: TYPE_BTC,
                              },
                            ]
                          : [
                              {
                                label: "ETHEREUM",
                                value: TYPE_ETH,
                              },
                              {
                                label: "BITCOIN",
                                value: TYPE_BTC,
                              },
                              {
                                label: "WOLF",
                                value: TYPE_WOLF,
                              },
                              {
                                label: "EAGLE",
                                value: TYPE_EAGLE,
                              },
                              {
                                label: "SNOW",
                                value: TYPE_SNOW,
                              },
                            ]
                      }
                      selectCallback={updateSelectValue}
                      placeholder={"Select Token"}
                    />
                  </div>
                  <br />
                </div>
                {currencyError && <Warning message={"Select a token"} />}

                <br />

                <label
                  htmlFor="address"
                  className="text-title font-gibson block text-sm  text-gray-700 py-2"
                >
                  {" "}
                  To Address{" "}
                </label>

                <div className="bg-gray-200 relative text-gray-600 focus-within:text-gray-400">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <div className="p-1 focus:outline-none focus:shadow-outline">
                      <img src={BchAddressIcon} className="w-6  h-6 " />
                    </div>
                  </span>
                  <input
                    type="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                    name="address"
                    id="address"
                    aria-describedby="address"
                    placeholder="Recipient’s wallet address"
                    autoComplete="off"
                  />
                </div>

                {formik.touched.address && formik.errors.address && (
                  <Warning message={formik.errors.address} />
                )}
              </div>

              <div className="m-3 pt-2">
                <label
                  htmlFor="address"
                  className="text-title font-gibson block text-sm  text-gray-700 pb-2"
                >
                  {" "}
                  Amount
                </label>

                <div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <div className="p-1 focus:outline-none focus:shadow-outline">
                      <img src={MoneyIcon} className="w-6  h-6 " />
                    </div>
                  </span>

                  <input
                    type="number"
                    onChange={formik.handleChange}
                    //    onBlur={formik.handleBlur}
                    value={formik.values.money}
                    className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                    name="money"
                    id="money"
                    aria-describedby="money"
                    placeholder="Amount"
                    autoComplete="off"
                  />
                </div>

                {formik.touched.money && formik.errors.money && (
                  <Warning message={formik.errors.money} />
                )}
              </div>
              {user && user.role === "user" && (
                <div className="m-3 pt-2">
                  <label
                    htmlFor="address"
                    className="text-title font-gibson block text-sm  text-gray-700 pb-2"
                  >
                    {" "}
                    Private Key
                  </label>

                  <div className="relative  bg-gray-200 text-gray-600 focus-within:text-gray-400">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <div className="p-1 focus:outline-none focus:shadow-outline">
                        <img src={BchAddressIcon} className="w-6  h-6 " />
                      </div>
                    </span>

                    <input
                      type="text"
                      onChange={formik.handleChange}
                      //    onBlur={formik.handleBlur}
                      value={formik.values.privateKey}
                      className="border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900"
                      name="privateKey"
                      id="privateKey"
                      aria-describedby="privateKey"
                      placeholder="Private Key"
                      autoComplete="off"
                    />
                  </div>

                  {formik.touched.privateKey && formik.errors.privateKey && (
                    <Warning message={formik.errors.privateKey} />
                  )}
                </div>
              )}
            </div>
            <div className="relative flex flex-col items-center justify-center cursor-pointer">
              {loading && (
                <Loader
                  type="Circles"
                  color="#ff8c00"
                  height={100}
                  width={100}
                  timeout={7000} //7 secs
                  className=" inline-block align-middle absolute  z-50  "
                />
              )}

              <div className="text-center items-center justify-center mt-6">
                <button
                  type="submit"
                  // disabled={loading}

                  className="w-auto px-24 py-2  uppercase bg-site-theme text-white text-lg hover:shadow-xl shadow-md outline-none focus:outline-none"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
}
