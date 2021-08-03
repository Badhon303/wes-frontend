import React, {useEffect, useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Doughnut, Line} from "react-chartjs-2";
import ChartCard from "../../components/Chart/ChartCard";
import ChartLegend from "../../components/Chart/ChartLegend";
import {doughnutLegends, lineLegends, lineOptions,} from "../../utils/demo/chartsData";
import UserManager from "../../libs/UserManager";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import {useHistory} from "react-router-dom";
import Swal from "sweetalert2";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";
import CreateBtcModal from "../../components/Modal/CreateBtcAccount";
import {LogoOfTokens} from "../../components/IconsSvg/svgIcons";


export default function AdminDashboard() {
    let history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const [user, setUser] = useState(userInfo);
    const [eagleBalance, setEagleBalance] = useState(null);
    const [snowBalance, setSnowBalance] = useState(null);
    const [wolfBalance, setWolfBalance] = useState(null);
    const [etherBalance, setEtherBalance] = useState(null);
    const [bitcoinBalance, setBitcoinBalance] = useState(null);
    const [copier, setCopier] = useState(false);
    const [btcInfo, setBtcInfo] = useState(null);
    const [bchType, setBchType] = useState(null);
    const [address, setAddress] = useState(null);
    const [createAccount, setCreateAccount] = useState(null);
    const [introducer, setIntroducer] = useState(null);
    const [referralPoint, setReferralPoint] = useState(null);
    const [allUsers, setAllUsers] = useState([0, 0, 0, 0]);
    const [goldPoint, setGoldPoint] = useState(null);
    const [ownedGoldPointPrice, setOwnedGoldPointPrice] = useState(null);


    let doughnutOptions = {
        data: {
            datasets: [
                {
                    data: allUsers,
                    backgroundColor: ["#300771", "#2b7fb2", "green", "red"],
                    label: "Users",
                },
            ],
            labels: ["Rejected", "Pending", "Users", "Unapplied"],
        },
        // width:60,
        // height:40,
        options: {
            // maintainAspectRatio: false,

            responsive: true,
            // height:100,
            cutoutPercentage: 80,
        },
        legend: {
            display: true,
        },
    };


    useEffect(() => {
        let point = getGoldPointApi();
        let userC = getAllUsersCount()
    }, []);


    const getAllUsersCount = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(
            `${BASE_URL}/users/totalUsers`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        const response = await data.json();

        if (response) {

            if (response.code === 401) history.push("/signin");
            else if (response.code === 404 || response.code === 500)
                console.log("Whoops..", response.message, "error");
            else
                console.log(response, 'user')
            let a = response.totalUsers.approved;
            let r = response.totalUsers.rejected;
            let p = response.totalUsers.pending;
            let u = response.totalUsers.unApplied;

            setAllUsers([r, p, a, u]);

        } else console.log("Whoops..", "No user data found", "error");
    };


    const getGoldPointApi = async () => {
        if (userInfo && Cookies.get("access-token")) {
            const myHeaders = new Headers();
            myHeaders.append(
                "Authorization",
                "Bearer " + Cookies.get("access-token")
            );

            const data = await fetch(`${BASE_URL}/gold-point/total-gp`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();
            //   console.log(response);

            if (response) {
                if (response.code === 401) history.push("/signin");
                else if (response.code === 404)
                    Swal.fire("Whoops..", "No  data found", "error");
                else {
                    setGoldPoint(response.totalGP);
                    let result = getGoldPointDollarPriceApi(response.goldPoints);
                }
            } else Swal.fire("Whoops..", "No data found", "error");
        }
    };

    const getGoldPointDollarPriceApi = async (goldPoints) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));

        const data = await fetch(
            `${BASE_URL}/gold-point/dollar-price?goldPointAmount=${1}`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        // console.log("goldpoint price: ", data);
        const response = await data.json();

        if (response) {
            if (response.code === 401) history.push("/signin");
            else if (response.code === 404)
                Swal.fire("Whoops..", "No data found", "error");
            else
                setOwnedGoldPointPrice(response && response.price ? response.price : 0);
        } else Swal.fire("Whoops..", "No  data found", "error");
    };

    //   console.log(goldPoint, ownedGoldPointPrice, "adf");
    const getUserApi = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
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

                setAddress(response.ethAccount ? response.ethAccount.address : "");
                setIntroducer(response.introducer ? response.introducer : "");
            }
        } else console.log("Whoops..", "No user data found", "error");
    };

    const getEagleBalance = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(
            `${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=EAGLE&type=erc20`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        const response = await data.json();

        if (response) {
            // console.log('eagle',response.result.balance)
            if (response.code === 401) history.push("/signin");
            else if (response.code === 404 || response.code === 500)
                console.log("Whoops..", "No balance found", "error");
            else
                setEagleBalance(
                    response && response.result && response.result.balance
                        ? response.result.balance
                        : "0"
                );
        } else console.log("Whoops..", "No user data found", "error");
    };
    const getWolfBalance = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(
            `${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=WOLF&type=erc20`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        const response = await data.json();

        if (response) {
            // console.log('wolf',response.result.balance)
            if (response.code === 401) history.push("/signin");
            else if (response.code === 404 || response.code === 500)
                console.log("Whoops..", "No balance found", "error");
            else
                setWolfBalance(
                    response && response.result && response.result.balance
                        ? response.result.balance
                        : "0"
                );
        } else console.log("Whoops..", "No user data found", "error");
    };
    const getSnowBalance = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(
            `${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=SNOW&type=erc20`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        const response = await data.json();

        if (response) {
            // console.log('snow',response.result.balance)
            if (response.code === 401) history.push("/signin");
            else if (response.code === 404 || response.code === 500)
                console.log("Whoops..", "No balance found", "error");
            else
                setSnowBalance(
                    response && response.result && response.result.balance
                        ? response.result.balance
                        : "0"
                );
        } else console.log("Whoops..", "No user data found", "error");
    };

    const getEtherBalance = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(
            `${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=ETH&type=coin`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        const response = await data.json();

        if (response) {
            // console.log('eth',response.result.balance)
            if (response.code === 401) history.push("/signin");
            else if (response.code === 404 || response.code === 500)
                console.log("Whoops..", "No balance found", "error");
            else
                setEtherBalance(
                    response && response.result && response.result.balance
                        ? response.result.balance
                        : "0"
                );
        } else console.log("Whoops..", "No user data found", "error");
    };

    const getBitcoinBalance = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(
            `${BASE_URL}/account/get-balance?address=${btcInfo.bitcoin}&currency=BTC&type=coin`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        const response = await data.json();

        if (response) {
            // console.log('btc',response.result.balance)
            if (response.code === 401) history.push("/sign02in");
            else if (response.code === 404 || response.code === 500)
                console.log("Whoops..", "No balance found", "error");
            else
                setBitcoinBalance(
                    response && response.result && response.result.balance
                        ? response.result.balance
                        : "0"
                );
        } else console.log("Whoops..", "No user data found", "error");
    };

    function updateBchType(cb) {
        setBchType(cb.value);

        if (
            (!btcInfo.bitcoin || btcInfo.bitcoin === "" || !btcInfo) &&
            cb.value === "Bitcoin"
        ) {
            Swal.fire({
                title:
                    '<p class="text-2xl text-site-theme"> You do not have a Bitcoin account. </p>',
                text: "Create a bitcoin account",
                confirmButtonColor: "#ff8c00",
                confirmButtonText: "Create Account",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCreateAccount("Bitcoin");
                }
            });
        }
        if (
            (!btcInfo || btcInfo.ether === "" || !btcInfo.ether) &&
            cb.value === "Ether"
        ) {
            Swal.fire({
                title:
                    '<p class="text-2xl text-site-theme"> You do not have a Ether account. </p>',
                text: "Create a ether account",
                confirmButtonColor: "#ff8c00",
                confirmButtonText: "Create Account",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCreateAccount("Ether");
                }
            });
        }

        if (btcInfo && btcInfo.bitcoin && cb.value === "Bitcoin") {
            setAddress(btcInfo.bitcoin);
        }
        if (btcInfo && btcInfo.ether && cb.value === "Ether") {
            setAddress(btcInfo.ether);
        }
    }

    const getReferralPointOfUser = async () => {
        if (userInfo && Cookies.get("access-token")) {
            const myHeaders = new Headers();
            myHeaders.append(
                "Authorization",
                "Bearer " + Cookies.get("access-token")
            );

            const data = await fetch(`${BASE_URL}/referral-point`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push("/signin");
                else if (response.code === 404)
                    Swal.fire("Whoops..", "No referral data found", "error");
                else {
                    setReferralPoint(response);
                }
            } else Swal.fire("Whoops..", "No referral data found", "error");
        }
    };

    useEffect(() => {
        getUserApi();
        getReferralPointOfUser();
    }, []);

    useEffect(() => {
        if (btcInfo) {
            if (btcInfo.ether) {
                getEagleBalance();
                getWolfBalance();
                getSnowBalance();
                getEtherBalance();
            }
            if (btcInfo.bitcoin) {
                getBitcoinBalance();
            }
        }
    }, [btcInfo]);




    return (
        <div className=" bg-white">
            <div className=" h-full md:pt-4 md:pb-6 p-6  ">
                <p className="font-bold text-2xl font-title text-title border-b-1">
                    Dashboard{" "}
                </p>
                <div className="pt-3">
                    <div className="px-4 xl:px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div>
                                <p className="mb-1.5 text-md text-gray-500 font-medium">
                                    Select Crypto Currency
                                </p>

                                <div className="w-64 ">
                                    <DropDownMenuWithIcon
                                        disabled={address ? false : true}
                                        defaultValue={
                                            btcInfo && btcInfo.ether ? "Ether" : "Select Coin"
                                        }
                                        className={"rounded text-black"}
                                        options={[
                                            {
                                                label: "Bitcoin",
                                                value: "Bitcoin",
                                            },
                                            {
                                                label: "Ether",
                                                value: "Ether",
                                            },
                                        ]}
                                        selectCallback={updateBchType}
                                        placeholder={
                                            btcInfo && btcInfo.ether ? "Ether" : "Select Coin"
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="py-2 text-md text-gray-500 font-medium">
                                    Introducer Name:
                                    <span className="pl-2">
                    {" "}
                                        {user &&
                                        introducer &&
                                        introducer.nickName &&
                                        introducer.email
                                            ? introducer.email + "(" + introducer.nickName + ")"
                                            : ""}
                  </span>
                                </p>
                            </div>
                        </div>
                        {btcInfo && address ? (
                            <div>
                                <p className="mt-3 text-md text-gray-500 font-medium">
                                    Address
                                </p>

                                <div
                                    className=" h-12 mt-2 bg-white shadow  flex rounded-l-lg  rounded-r-0 w-auto flex justify-between">
                                    <p className="flex items-center block  text-gradians text-sm md:text-xl px-1 md:px-6  font-bold  break-all md:w-full w-64">
                                        {address}
                                    </p>
                                    <CopyToClipboard
                                        text={address}
                                        onCopy={() => setCopier(true)}
                                    >
                                        <button
                                            className="flex items-center px-6 bg-white hover:bg-site-theme outline-none focus:outline-none  ">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24px"
                                                viewBox="0 0 24 24"
                                                width="24px"
                                                fill="#000000"
                                            >
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path
                                                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                            </svg>
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        ) : (
                            <div
                                className=" mt-6 bg-white shadow h-12 flex rounded-l-lg  rounded-r-0 w-auto flex justify-between"/>
                        )}
                    </div>
                </div>

                <div className="my-6 h-1/6">
                    <div className="ml-4 col-span-12 md:col-span-6 mt-4  order-3 md:order-2">
                        <div className="grid grid-cols-2 md:grid-cols-8 lg:gap-4 gap-2 ">
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="WOLF"/>
                                        <p>Wolf</p>
                                    </div>

                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {wolfBalance ? wolfBalance : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="EAGLE"/>
                                        <p>Eagle</p>
                                    </div>
                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {eagleBalance ? eagleBalance : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="SNOW"/>
                                        <p>Snow</p>
                                    </div>

                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {snowBalance ? snowBalance : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="ETH"/>
                                        <p>ETH</p>
                                    </div>
                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {etherBalance ? etherBalance : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="BTC"/>
                                        <p>BTC</p>
                                    </div>
                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {bitcoinBalance ? bitcoinBalance : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="RP"/>
                                        <p>RP Point</p>
                                    </div>
                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {referralPoint ? referralPoint.totalPoint : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="GOLD"/>
                                        <p> Total GP owned by all users </p>
                                    </div>
                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {goldPoint ? goldPoint : 0}
                                    </p>
                                </div>
                            </div>

                            <div className="col-span-2  bg-site-bg rounded shadow mt-4">
                                <div className="p-2 md:p-4">
                                    <div
                                        className="text-title text-base  xl:text-xl font-semibold text-left pt-2 flex items-center">
                                        <LogoOfTokens type="GOLD"/>
                                        <p>Todayʼs dollar price per GP </p>
                                    </div>
                                    <p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden">
                                        {" "}
                                        {ownedGoldPointPrice ? ownedGoldPointPrice : 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-2/4 my-6">
                    <div className="grid gap-4 mb-8 md:grid-cols-2">
                        <ChartCard title="Total Users">
                            <Doughnut {...doughnutOptions} />
                            <ChartLegend legends={doughnutLegends}/>
                        </ChartCard>

                        <ChartCard title="Email sent ">
                            <Line {...lineOptions} />
                            <ChartLegend legends={lineLegends}/>
                        </ChartCard>
                    </div>
                </div>
            </div>

            {createAccount && createAccount !== "" && (
                <CreateBtcModal
                    open={true}
                    createAccount={createAccount}
                    cbCreate={() => setCreateAccount(null)}
                />
            )}
        </div>
    );
}
