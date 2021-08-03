import React, { useEffect, useState } from "react";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";
import Swal from "sweetalert2";
import * as PurchaseAPI from "../../../apis/purchase";
import DropDownMenuWithIcon from "../../../components/Dropdown/DropDownWithMenu";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../constants";
import { useHistory } from "react-router-dom";

const validate = (values) => {
  const errors = {};
  const { price } = values;

  if (!price) {
    errors.price = "Price should not be 0";
  } else if (price === 0) {
    errors.price = "Price should be larger than 0";
  }

  return errors;
};

const initialExchangeRate = [
  {
    coin: "WOLF",
    bonus: 0,
    unit: 1000,
    status: "Disabled",
  },
  {
    coin: "EAGLE",
    bonus: 0,
    unit: 40,
    status: "Enabled",
  },
  {
    coin: "SNOW",
    bonus: 20,
    unit: 10,
    status: "Enabled",
  },
  {
    coin: "ETH",
    bonus: 0,
    unit: 0.1,
    status: "Disabled",
  },
  {
    coin: "BTC",
    bonus: 0,
    unit: 0.01,
    status: "Disabled",
  },
];

export default function AdminExchangeRatePage() {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [wolf, setWolf] = useState(null);
  const [eagle, setEagle] = useState(null);
  const [snow, setSnow] = useState(null);
  const [bitcoin, setBitcoin] = useState(null);
  const [ether, setEther] = useState(null);

  useEffect(() => {
    let res = getGPRates();
  }, []);

  const getGPRates = async () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
    const data = await fetch(`${BASE_URL}/gold-point/exchange/exchange-rates`, {
      method: "GET",
      headers: myHeaders,
    });
    const response = await data.json();

    if (response) {
      setLoading(false);

      if (response.code === 401) history.push("/signin");
      else if (response.code === 404 || response.code === 500)
        console.log("Whoops..", "No data found", "error");
      else {
        setWolf(response.rates.filter((obj) => obj.coin === "WOLF")[0]);
        setEagle(response.rates.filter((obj) => obj.coin === "EAGLE")[0]);
        setSnow(response.rates.filter((obj) => obj.coin === "SNOW")[0]);
        setBitcoin(response.rates.filter((obj) => obj.coin === "BTC")[0]);
        setEther(response.rates.filter((obj) => obj.coin === "ETH")[0]);
      }
    } else console.log("Whoops..", "No user data found", "error");
  };

  function handleChange(e, coin, type) {
    if (coin === "wolf") {
      setWolf((prev) => ({
        ...prev,
        [type]: e.target.value,
      }));
    }

    if (coin === "eagle") {
      setEagle((prev) => ({
        ...prev,
        [type]: e.target.value,
      }));
    }

    if (coin === "snow") {
      setSnow((prev) => ({
        ...prev,
        [type]: e.target.value,
      }));
    }

    if (coin === "bitcoin") {
      setBitcoin((prev) => ({
        ...prev,
        [type]: e.target.value,
      }));
    }

    if (coin === "ether") {
      setEther((prev) => ({
        ...prev,
        [type]: e.target.value,
      }));
    }
  }

  function updateStatusWolf(cb) {
    setWolf((prev) => ({
      ...prev,
      status: cb.value,
    }));
  }

  function updateStatusEagle(cb) {
    setEagle((prev) => ({
      ...prev,
      status: cb.value,
    }));
  }

  function updateStatusSnow(cb) {
    setSnow((prev) => ({
      ...prev,
      status: cb.value,
    }));
  }

  function updateStatusEth(cb) {
    setEther((prev) => ({
      ...prev,
      status: cb.value,
    }));
  }

  function updateStatusBtc(cb) {
    setBitcoin((prev) => ({
      ...prev,
      status: cb.value,
    }));
  }

  function handleSubmit() {
    let wolfs = wolf;
    let eagles = eagle;
    let snows = snow;
    let eth = ether;
    let btc = bitcoin;

    delete wolfs.id;
    delete eagles.id;
    delete snows.id;
    delete btc.id;
    delete eth.id;

    let data = [wolfs, eagles, snows, btc, eth];

    setLoading(true);
    PurchaseAPI.exchangeGoldCoinRates(data)
      .then((res) => {
        setLoading(false);

        if (res.ok) {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Successfully Rates Updated",
          });
          window.location.reload(true);
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: res.data.message,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire("Error", err.message, "error");
      });
  }

  return (
    <main className="flex justify-center ">
      {loading && <CustomLoader />}
      {wolf && eagle && snow && bitcoin && ether ? (
        <div className="w-full md:max-w-7xl bg-white rounded-xl p-2 md:p-6  ">
          <div className=" rounded-xl border-1  bg-white rounded-xl p-2 md:p-6">
            <p className="text-xl font-semibold py-4 ">
              Gold Points Exchange Rate
            </p>
            <div className="mt-2 mb-6">
              <div className="md:flex  md:items-center my-8">
                <p className="md:w-16 font-bold text-gray-600">Wolf</p>
                <div className=" ">
                  <input
                    className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                    type="number"
                    defaultValue={wolf.bonus}
                    min="0"
                    id="bonus"
                    name="bonus"
                    onChange={(e) => handleChange(e, "wolf", "bonus")}
                    // value={wolf.bonus}
                  />{" "}
                  <strong className="text-xl"> % </strong>
                </div>

                <p className="md:w-16 mt-4 md:mt-0">Unit</p>
                <div className=" ">
                  <input
                    className="w-2/3 border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 focus:outline-none"
                    type="number"
                    defaultValue={wolf.unit}
                    min="0"
                    id="unit"
                    name="unit"
                    onChange={(e) => handleChange(e, "wolf", "unit")}
                    // value={wolf.bonus}
                  />
                </div>

                <div className=" md:mt-0  mt-4">
                  <p className="md:w-0 mt-4 md:mt-0 md:hidden visible w-16">
                    Status
                  </p>

                  <div className="w-64 ">
                    <DropDownMenuWithIcon
                      defaultValue={wolf.status}
                      className={"rounded text-black"}
                      options={[
                        {
                          label: "Enabled",
                          value: "Enabled",
                        },
                        {
                          label: "Disabled",
                          value: "Disabled",
                        },
                      ]}
                      selectCallback={updateStatusWolf}
                      placeholder={wolf.status}
                    />
                  </div>
                </div>
              </div>

              <div className="md:flex  md:items-center my-8">
                <p className="md:w-16 font-bold text-gray-600">Eagle</p>
                <div className=" ">
                  <input
                    className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                    type="number"
                    defaultValue={eagle.bonus}
                    min="0"
                    id="bonus"
                    name="bonus"
                    onChange={(e) => handleChange(e, "eagle", "bonus")}
                    // value={wolf.bonus}
                  />{" "}
                  <strong className="text-xl"> % </strong>
                </div>

                <p className="md:w-16 mt-4 md:mt-0">Unit</p>
                <div className=" ">
                  <input
                    className="w-2/3 border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 focus:outline-none"
                    type="number"
                    defaultValue={eagle.unit}
                    min="0"
                    id="unit"
                    name="unit"
                    onChange={(e) => handleChange(e, "eagle", "unit")}
                    // value={wolf.bonus}
                  />
                </div>

                <div className=" md:mt-0  mt-4">
                  <p className="md:w-0 mt-4 md:mt-0 md:hidden visible w-16">
                    Status
                  </p>

                  <div className="w-64 ">
                    <DropDownMenuWithIcon
                      defaultValue={eagle.status}
                      className={"rounded text-black"}
                      options={[
                        {
                          label: "Enabled",
                          value: "Enabled",
                        },
                        {
                          label: "Disabled",
                          value: "Disabled",
                        },
                      ]}
                      selectCallback={updateStatusEagle}
                      placeholder={eagle.status}
                    />
                  </div>
                </div>
              </div>

              <div className="md:flex  md:items-center my-8">
                <p className="md:w-16 font-bold text-gray-600">Snow</p>
                <div className=" ">
                  <input
                    className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                    type="number"
                    defaultValue={snow.bonus}
                    min="0"
                    id="bonus"
                    name="bonus"
                    onChange={(e) => handleChange(e, "snow", "bonus")}
                    // value={wolf.bonus}
                  />{" "}
                  <strong className="text-xl"> % </strong>
                </div>

                <p className="md:w-16 mt-4 md:mt-0">Unit</p>
                <div className=" ">
                  <input
                    className="w-2/3 border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 focus:outline-none"
                    type="number"
                    defaultValue={snow.unit}
                    min="0"
                    id="unit"
                    name="unit"
                    onChange={(e) => handleChange(e, "snow", "unit")}
                    // value={wolf.bonus}
                  />
                </div>

                <div className=" md:mt-0  mt-4">
                  <p className="md:w-0 mt-4 md:mt-0 md:hidden visible w-16">
                    Status
                  </p>

                  <div className="w-64 ">
                    <DropDownMenuWithIcon
                      defaultValue={snow.status}
                      className={"rounded text-black"}
                      options={[
                        {
                          label: "Enabled",
                          value: "Enabled",
                        },
                        {
                          label: "Disabled",
                          value: "Disabled",
                        },
                      ]}
                      selectCallback={updateStatusSnow}
                      placeholder={snow.status}
                    />
                  </div>
                </div>
              </div>

              <div className="md:flex  md:items-center my-8">
                <p className="md:w-16 font-bold text-gray-600">Ether</p>
                <div className=" ">
                  <input
                    className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                    type="number"
                    defaultValue={ether.bonus}
                    min="0"
                    id="bonus"
                    name="bonus"
                    onChange={(e) => handleChange(e, "ether", "bonus")}
                    // value={wolf.bonus}
                  />{" "}
                  <strong className="text-xl"> % </strong>
                </div>

                <p className="md:w-16 mt-4 md:mt-0">Unit</p>
                <div className=" ">
                  <input
                    className="w-2/3 border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 focus:outline-none"
                    type="number"
                    defaultValue={ether.unit}
                    min="0"
                    id="unit"
                    name="unit"
                    onChange={(e) => handleChange(e, "ether", "unit")}
                    // value={wolf.bonus}
                  />
                </div>

                <div className=" md:mt-0  mt-4">
                  <p className="md:w-0 mt-4 md:mt-0 md:hidden visible w-16">
                    Status
                  </p>

                  <div className="w-64 ">
                    <DropDownMenuWithIcon
                      defaultValue={ether.status}
                      className={"rounded text-black"}
                      options={[
                        {
                          label: "Enabled",
                          value: "Enabled",
                        },
                        {
                          label: "Disabled",
                          value: "Disabled",
                        },
                      ]}
                      selectCallback={updateStatusEth}
                      placeholder={ether.status}
                    />
                  </div>
                </div>
              </div>

              <div className="md:flex  md:items-center my-8">
                <p className="md:w-16 font-bold text-gray-600">Bitcoin</p>
                <div className=" ">
                  <input
                    className="border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 w-half focus:outline-none"
                    type="number"
                    defaultValue={bitcoin.bonus}
                    min="0"
                    id="bonus"
                    name="bonus"
                    onChange={(e) => handleChange(e, "bitcoin", "bonus")}
                    // value={wolf.bonus}
                  />{" "}
                  <strong className="text-xl"> % </strong>
                </div>

                <p className="md:w-16 mt-4 md:mt-0">Unit</p>
                <div className=" ">
                  <input
                    className="w-2/3 border hover:shadow-xl border-gray-200 shadow bg-gray-50  px-3 py-2 focus:outline-none"
                    type="number"
                    defaultValue={bitcoin.unit}
                    min="0"
                    id="unit"
                    name="unit"
                    onChange={(e) => handleChange(e, "bitcoin", "unit")}
                    // value={wolf.bonus}
                  />
                </div>

                <div className=" md:mt-0  mt-4">
                  <p className="md:w-0 mt-4 md:mt-0 md:hidden visible w-16">
                    Status
                  </p>

                  <div className="w-64 ">
                    <DropDownMenuWithIcon
                      defaultValue={bitcoin.status}
                      className={"rounded text-black"}
                      options={[
                        {
                          label: "Enabled",
                          value: "Enabled",
                        },
                        {
                          label: "Disabled",
                          value: "Disabled",
                        },
                      ]}
                      selectCallback={updateStatusBtc}
                      placeholder={bitcoin.status}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="my-12 focus:outline-none w-56  hover:font-bold px-6 py-3 flex mx-auto justify-center  text-sm text-white bg-site-theme font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
    </main>
  );
}
