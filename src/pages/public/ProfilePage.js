import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout/Layout";
import UserManager from "../../libs/UserManager";
import AvatarLogo from "../../image/avatar.png";
import {VerifyPageSubTitle1, VerifyPageSubTitle2, VerifyPageTitle} from "../../utils/staticTexts";
import ShareIcon from "../../image/icons/shareIcon.svg";
import CustomModal from "../../components/Modal/customModal";
import ProfilePictureUploader from "./profilePictureUploader";
import {BASE_URL, PHOTO_URL} from "../../constants";
import Cookies from "js-cookie";
import QRCode from 'qrcode.react';
import emailShare from "../../image/icons/emailShare.svg";
import copyIcon from "../../image/icons/copyIcon.svg";
import {useHistory} from 'react-router-dom';
import CopierModal from "../../components/Modal/CopierModal";
import {coinData} from "../../utils/staticTexts";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Swal from "sweetalert2";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";


function Profile(props) {

    let history = useHistory();

    const userInfo = UserManager.getLoggedInUser();
    useEffect(() => {
        if (!userInfo) history.push('/')
    },)

    const [identityModal, setIdentityModal] = useState(false);
    const [identityModal2, setIdentityModal2] = useState(false);
    const [edit, setEdit] = useState(false);
    const [profilePictureModal, setProfilePictureModal] = useState(false);
    const [user, setUser] = useState(userInfo);
    const photoUrl = user && userInfo.photo !== "no-photo.jpg" ? PHOTO_URL + userInfo.photo : AvatarLogo;
    const [qRCode, setQRCode] = useState(null);
    const [linkCode, setLinkCode] = useState(null);
    const [emailCode, setEmailCode] = useState(null);
    const [copied, setCopied] = useState(false);
    const [copyValue, setCopyValue] = useState(null);
    const [title, setTitle] = useState("Identity Verification");
    const [eagleBalance, setEagleBalance] = useState(null);
    const [snowBalance, setSnowBalance] = useState(null);
    const [wolfBalance, setWolfBalance] = useState(null);

    const [etherBalance, setEtherBalance] = useState(null);
    const [bitcoinBalance, setBitcoinBalance] = useState(null);
    const [copier, setCopier] = useState(false);
    const [btcInfo, setBtcInfo] = useState(null);
    const [bchType, setBchType] = useState(null);
    const [address, setAddress] =useState(null);
    const [createAccount, setCreateAccount] = useState(null);



    useEffect(() => {
        if (props.location.pathname === "/profile/verify") {
            setTitle("Identity Verification")
            setIdentityModal(true)
        }

    }, [])

    useEffect(() => {
        if (props.location.pathname === "/profile/edit") {
            setTitle("Profile Edit")
            setIdentityModal2(true)
        }

    }, [])



    const getUserApi = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404) console.log('Whoops..', "No user data found", 'error');
            else {
                setUser(response.user)
                setBtcInfo(
                    {
                        ether: response.ethAccount ? response.ethAccount.address : "",
                        bitcoin: response.btcAccount ? response.btcAccount.address : "",
                    })
            }
            ;
        }
        else console.log('Whoops..', "No user data found", 'error');
    }



    const getEagleBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=EAGLE&type=erc20`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            // console.log('eagle',response.result.balance)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 500) console.log('Whoops..', "No balance found", 'error');
            else setEagleBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }
    const getWolfBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/account/get-balance?address=${ btcInfo.ether}&currency=WOLF&type=erc20`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            // console.log('wolf',response.result.balance)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 500) console.log('Whoops..', "No balance found", 'error');
            else setWolfBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }
    const getSnowBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/account/get-balance?address=${ btcInfo.ether}&currency=SNOW&type=erc20`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            // console.log('snow',response.result.balance)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 500) console.log('Whoops..', "No balance found", 'error');
            else setSnowBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }


    const getEtherBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/account/get-balance?address=${btcInfo.ether}&currency=ETH&type=coin`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            // console.log('eth',response.result.balance)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 500) console.log('Whoops..', "No balance found", 'error');
            else setEtherBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }

    const getBitcoinBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/account/get-balance?address=${btcInfo.bitcoin}&currency=BTC&type=coin`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            // console.log('btc',response.result.balance)
            if (response.code === 401) history.push('/sign02in');
            else if (response.code === 404 || response.code === 500) console.log('Whoops..', "No balance found", 'error');
            else setBitcoinBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }



    const getShareQrLink = async (value) => {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

        const data = await fetch(`${BASE_URL}/users/${userInfo.id}/share?medium=${value}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {

            if (response.code === 401) history.push('/signin');
            else if (response.code === 404 || response.code === 500 || response.code === 400) {
                setQRCode(null)
                setEmailCode(null)
            }
            else {
                if (value === "QR") setQRCode(response);
                if (value === "LINK") setLinkCode(response);
                if (value === "EMAIL") setEmailCode(response)
            }
        }
        else console.log('Whoops..', "No Qr code found", 'error');
    }

    useEffect(() => {
        getUserApi()
        getShareQrLink("QR")
        getShareQrLink("LINK")
        getShareQrLink("EMAIL")
    }, [])

    useEffect(() => {

        if (btcInfo) {
            if (btcInfo.ether) {
                getEagleBalance()
                getWolfBalance()
                getSnowBalance()
                getEtherBalance()

            }
            if (btcInfo.bitcoin) {
                getBitcoinBalance()
            }
        }


    }, [btcInfo])


    async function shareLinkHandler(value) {
        // let link= await  getShareQrLink(value)
        //
        if (value === "LINK" && linkCode) {
            setCopied(true)
        }
        else {

            let email = userInfo.email;
            let subject = "Referral link";
            let emailBody = 'Please sign up using my link ' + (emailCode ? emailCode : linkCode) + 'by' + userInfo.nickName;
            document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBody;
            // window.open('mailto:email@example.com?subject=Refer&body=`${emailCode}`')
        }
    }


    function handleCopier(value) {
        setCopyValue(value)

    }

    function handleCopyModal(value) {
        setCopied(false)
    }

    function setModalCallback(value) {
        setEdit(false)
    }

    function handleVerify() {
        setTitle("Identity Verification")
        setIdentityModal(!identityModal);
    }

    function handleVerify2() {
        setTitle("Profile Edit")
        setIdentityModal2(!identityModal2);
    }

    function handleProfilePictureUploadCallback(value) {
        setProfilePictureModal(false)
        document.location.href = '/dashboard'
    }

    const downloadQR = () => {
        const canvas = document.getElementById("qrCode");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrCode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };


    function updateBchType(cb) {
        setBchType(cb.value)

        if((!btcInfo.bitcoin || btcInfo.bitcoin==="" || !btcInfo  ) && cb.value==="Bitcoin"){
            Swal.fire({
                title: '<p class="text-2xl text-site-theme"> You do not have a Bitcoin account. </p>',
                text:'Create a bitcoin account',
                confirmButtonColor: '#ff8c00',
                confirmButtonText: 'Create Account',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        setCreateAccount("Bitcoin");
                    }
                })

        }
        if((!btcInfo || btcInfo.ether==="" || !btcInfo.ether) && cb.value==="Ether"){
            Swal.fire({
                title: '<p class="text-2xl text-site-theme"> You do not have a Ether account. </p>',
                text:'Create a ether account',
                confirmButtonColor: '#ff8c00',
                confirmButtonText: 'Create Account',
            }) .then((result) => {
                if (result.isConfirmed) {
                    setCreateAccount("Ether");
                }
            })
        }

        if(btcInfo && btcInfo.bitcoin && cb.value === "Bitcoin"){
            setAddress(btcInfo.bitcoin)
        }
        if(btcInfo && btcInfo.ether && cb.value === "Ether"){
            setAddress(btcInfo.ether)
        }


    }


    let userStatusAction;


    if (user && (user.approvalStatus === "pending" &&
        (user.firstName && ((user.nidBack !== "nid_back.jpg" &&
            user.nidFront !== "nid_front.jpg") ||
            user.passportBiodata !== "passport_biodata.jpg" ||
            (user.drivingBack !== "driving_back.jpg" && user.drivingFront !== "driving_front.jpg")))))
        userStatusAction = (<div
            className="ml-auto rounded bg-site-theme px-8  py-2 text-white  border-none
                                                                               focus:border-none
                                                                                hover:border-none ">
            Pending
        </div>)
    else if (user && (user.approvalStatus === "pending" &&
        (!user.firstName && ((user.nidBack === "nid_back.jpg" &&
            user.nidFront === "nid_front.jpg") ||
            user.passportBiodata === "passport_biodata.jpg" ||
            (user.drivingBack === "driving_back.jpg" && user.drivingFront === "driving_front.jpg")))))
        userStatusAction = (<button onClick={handleVerify}
                                    className="ml-auto rounded bg-site-theme px-8  py-2 text-white shadow border-none
                                                                                 focus:shadow-xl hover:shadow-xl
                                                                                   focus:border-none
                                                                                hover:border-none ">
            Verify
        </button>)
    else if (user && (user.approvalStatus === "approved"))
        userStatusAction = (
            <div
                className="ml-auto rounded bg-green-600 px-8  py-2 text-white  border-none   ">Verified
            </div>)
    else if (user && (user.approvalStatus === "rejected"))
        userStatusAction = (
            <div data-tip="Submit again"
                 className="ml-auto c rounded bg-red-600 px-8  py-2 text-white  border-none  ">Rejected
            </div>)

    return (
        <Layout>
            <div className="bg-white">
                {/*<div className=" md:pt-6 md:pb-6 p-6 shadow bg-white">*/}

                    {/*<div className="grid grid-cols-12 gap-4 ">*/}
                        {/*<div className="col-span-12 md:col-span-6 order-1 md:order-1 ">*/}

                            {/*<div className="flex inline-flex">*/}

                                {/*<p className=" text-xl font-black  text-gray-900 md:text-3xl sm:truncate">*/}
                                    {/*Basic Info*/}
                                {/*</p>*/}

                            {/*</div>*/}

                            {/*/!*personal info section *!/*/}

                            {/*<div className="flex md:pt-6  md:pb-2 py-2 items-center justify-content-center word-break ">*/}
                                {/*<div*/}
                                    {/*className="rounded-full px-4 py-3 border-1 shadow text-base text-bold"> {userInfo.nickName.slice(0, 2)}</div>*/}
                                {/*<div className="ml-2 xl:ml-6 text-base text-gray-600 word-break">*/}
                                    {/*<p>{userInfo.email}</p>*/}
                                    {/*<p> {userInfo.nickName}</p>*/}
                                {/*</div>*/}

                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div*/}
                            {/*className="order-2 md:order-3 col-span-12 md:col-span-6 md:mr-12 mr-2  justify-content-left md:justify-content-end ">*/}

                            {/*<div className="flex flex-col items-center md:items-end  ">*/}

                                {/*<img src={userInfo && photoUrl ? photoUrl : AvatarLogo}*/}
                                     {/*className="h-32 w-32 text-center mx-4 border-1 group " alt="Profile Picture "/>*/}
                                {/*<div*/}
                                    {/*className="cursor-pointer group-hover:text-blue-400 group-hover:text-2xl text-sm ">*/}
                                    {/*<p onClick={() => setProfilePictureModal(true)}*/}
                                       {/*className='text-gray-400 hover:text-site-theme  pt-2 text-center font-normal transform hover:scale-125 '>*/}
                                        {/*Update Profile Picture </p>*/}
                                {/*</div>*/}

                            {/*</div>*/}

                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className="px-4 xl:px-16">*/}

                        {/*<div className="w-64 ">*/}
                            {/*<DropDownMenuWithIcon*/}
                                {/*defaultValue="Select Coin"*/}
                                {/*className={"rounded text-black"}*/}
                                {/*options={[*/}
                                    {/*{*/}
                                        {/*label: "Bitcoin",*/}
                                        {/*value: "Bitcoin"*/}
                                    {/*},*/}
                                    {/*{*/}
                                        {/*label: "Ether",*/}
                                        {/*value: "Ether",*/}
                                    {/*}]*/}
                                {/*}*/}

                                {/*selectCallback={updateBchType}*/}
                                {/*placeholder={"Select Coin"}*/}

                            {/*/>*/}
                        {/*</div>*/}

                        {/*{btcInfo && bchType && address ? <div*/}
                                {/*className=" h-12 mt-6 bg-white shadow  flex rounded-l-lg  rounded-r-0 w-auto flex justify-between">*/}


                                {/*<p className="flex items-center text-gradians text-xl px-6  font-bold  break-all">*/}
                                    {/*{address}*/}
                                {/*</p>*/}
                                {/*<CopyToClipboard text={address}*/}
                                                 {/*onCopy={() => setCopier(true)}>*/}
                                    {/*<button*/}
                                        {/*className="flex items-center px-6 bg-white hover:bg-site-theme outline-none focus:outline-none  ">*/}
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"*/}
                                             {/*width="24px" fill="#000000">*/}
                                            {/*<path d="M0 0h24v24H0z" fill="none"/>*/}
                                            {/*<path*/}
                                                {/*d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>*/}
                                        {/*</svg>*/}

                                    {/*</button>*/}
                                {/*</CopyToClipboard>*/}

                            {/*</div> :*/}
                            {/*<div*/}
                                {/*className=" mt-6 bg-white shadow h-12 flex rounded-l-lg  rounded-r-0 w-auto flex justify-between"/>*/}


                        {/*}*/}
                    {/*</div>*/}


                    {/*<div className="ml-4 col-span-12 md:col-span-6 mt-4  order-3 md:order-2">*/}
                        {/*<div className="grid grid-cols-10 lg:gap-8 gap-2 ">*/}


                            {/*<div className="col-span-2  bg-site-bg rounded shadow mt-4">*/}
                                {/*<div className="p-2 md:p-4">*/}
                                    {/*<p className="text-title text-base  xl:text-xl font-semibold text-left pt-2">Wolf</p>*/}

                                    {/*<p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden"> {wolfBalance ? wolfBalance : ""}</p>*/}
                                {/*</div>*/}


                            {/*</div>*/}
                            {/*<div className="col-span-2  bg-site-bg rounded shadow mt-4">*/}
                                {/*<div className="p-2 md:p-4">*/}
                                    {/*<p className="text-title text-base  xl:text-xl font-semibold text-left pt-2">Eagle</p>*/}

                                    {/*<p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden"> {eagleBalance ? eagleBalance : ""}</p>*/}
                                {/*</div>*/}


                            {/*</div>*/}
                            {/*<div className="col-span-2  bg-site-bg rounded shadow mt-4">*/}
                                {/*<div className="p-2 md:p-4">*/}
                                    {/*<p className="text-title text-base  xl:text-xl font-semibold text-left pt-2">Snow</p>*/}

                                    {/*<p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden"> {snowBalance ? snowBalance : ""}</p>*/}
                                {/*</div>*/}


                            {/*</div>*/}
                            {/*<div className="col-span-2  bg-site-bg rounded shadow mt-4">*/}
                                {/*<div className="p-2 md:p-4">*/}
                                    {/*<p className="text-title text-base  xl:text-xl font-semibold text-left pt-2">ETH</p>*/}

                                    {/*<p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden"> {etherBalance ? etherBalance : ""}</p>*/}
                                {/*</div>*/}


                            {/*</div>*/}
                            {/*<div className="col-span-2  bg-site-bg rounded shadow mt-4">*/}
                                {/*<div className="p-2 md:p-4">*/}
                                    {/*<p className="text-title text-base  xl:text-xl font-semibold text-left pt-2">BTC</p>*/}

                                    {/*<p className="text-title  text-base xl:text-xl text-center py-2 md:py-4 word-break overflow-hidden"> {bitcoinBalance ? bitcoinBalance : ""}</p>*/}
                                {/*</div>*/}


                            {/*</div>*/}

                        {/*</div>*/}
                    {/*</div>*/}


                {/*</div>*/}

                {/*<div className=" md:m-6 m-4 ">*/}

                    {/*<div className="bg-white shadow ">*/}
                        {/*<div className="md:px-8  md:py-6 px-4  py-4 text-black  font-bold border-b-2   "> Identity*/}
                            {/*Verification*/}
                        {/*</div>*/}

                        {/*<div className="md:py-4 md:px-8 px-4  py-4 flex justify-between ">*/}

                            {/*<div className="items-center flex ">*/}
                                {/*<img src={AvatarLogo} align="avatar logo " className="w-8 h-8 "/> <p*/}
                                {/*className="pl-4 text-base font-normal">Personal Details</p>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center ">*/}
                                {/*{userStatusAction}*/}
                            {/*</div>*/}

                        {/*</div>*/}
                        {/*<div className="md:px-8 px-4  py-2 ">*/}
                            {/*<p className="text-gray-500 text-base  font-medium"> {VerifyPageTitle} </p>*/}
                            {/*<ul className="md:px-4 px-2 py-4 text-sm text-gray-400 list-disc">*/}
                                {/*<li>{VerifyPageSubTitle1} </li>*/}
                                {/*<li> {VerifyPageSubTitle2} </li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                {/*</div>*/}

                {/*<div className=" md:m-6 pb-12 m-4 ">*/}

                    {/*<div className="bg-white shadow ">*/}
                        {/*<div className="md:px-8  md:py-6 px-4  py-4 text-black  font-bold border-b-2   ">Share your*/}
                            {/*Profile*/}
                        {/*</div>*/}

                        {/*<div className="md:py-4 md:px-8 px-4  py-4 flex justify-between ">*/}

                            {/*<div className="items-center flex flex-col ">*/}
                                {/*<div className='flex flex-row items-center'><img src={ShareIcon} align="avatar logo "*/}
                                                                                 {/*className="w-8 h-8 "/> <p*/}
                                    {/*className="pl-4 text-base font-normal">Share Medium</p></div>*/}
                                {/*<div className="md:px-4 px-2 py-4 text-sm text-base list-none">*/}
                                    {/*<div onClick={() => shareLinkHandler("EMAIL")} className="cursor-pointer  group">*/}
                                        {/*<span className="flex flex-row"> <div*/}
                                            {/*className="mr-6 rounded-full p-2 group-hover:bg-site-theme  border-1 w-8 cursor-pointer"> <img*/}
                                            {/*src={emailShare} alt="email share icon" className="h-4 w-6"/> </div>Share by Email</span>*/}
                                    {/*</div>*/}

                                    {/*<div onClick={() => shareLinkHandler("LINK")} className="pt-4 cursor-pointer group">*/}
                                        {/*<span className="flex flex-row"> <div*/}
                                            {/*className="mr-6 rounded-full p-2 group-hover:bg-site-theme  border-1 w-8 cursor-pointer"> <img*/}
                                            {/*src={copyIcon} alt="email share icon" className="h-4 w-6"/> </div>Share by Link</span>*/}
                                    {/*</div>*/}

                                {/*</div>*/}

                            {/*</div>*/}
                            {/*<div className="flex items-center ">*/}
                                {/*{qRCode && <div>*/}
                                    {/*<QRCode*/}
                                        {/*id="qrCode"*/}
                                        {/*level={"H"}*/}
                                        {/*includeMargin={true}*/}
                                        {/*value={qRCode}/>*/}
                                    {/*<a className="ml-4 text-center text-site-theme cursor-pointer"*/}
                                       {/*onClick={downloadQR}> Download QR </a>*/}
                                {/*</div>}*/}
                            {/*</div>*/}

                        {/*</div>*/}
                        {/*/!*<div className="md:px-8 px-4  py-2 ">*!/*/}

                        {/*/!*<p className="text-gray-500 text-base  font-medium">  </p>*!/*/}
                        {/*/!*<ul className="md:px-4 px-2 py-4 text-sm text-base list-none">*!/*/}
                        {/*/!*<li className="cursor-pointer  group" > <span className="flex flex-row"> <div className="mr-6 rounded-full p-2 group-hover:bg-site-theme  border-1 w-8 cursor-pointer"> <img src={emailShare} alt="email share icon" className="h-4 w-6"/> </div>Share by Email</span></li>*!/*/}
                        {/*/!*<br/>*!/*/}
                        {/*/!*<li className="cursor-pointer group" > <span className="flex flex-row"> <div className="mr-6 rounded-full p-2 group-hover:bg-site-theme  border-1 w-8 cursor-pointer"> <img src={copyIcon} alt="email share icon" className="h-4 w-6"/> </div>Share by Link</span></li>*!/*/}

                        {/*/!*</ul>*!/*/}
                        {/*/!*</div>*!/*/}
                    {/*</div>*/}

                {/*</div>*/}

                {identityModal && <CustomModal
                    userInfo={user}
                    showModal={identityModal}
                    title="Identity Verification"
                    setModalCallback={handleVerify}
                />}

                {identityModal2 && <CustomModal
                    userInfo={user}
                    title="Profile Edit"
                    showModal={identityModal2}
                    setModalCallback={handleVerify2}
                />}


                {/* {edit === true && user && <ProfileEdit
                    showModal={edit}
                    edit={true}
                    modalShow={setModalCallback}
                    userData={userInfo}/>}*/}

                {
                    profilePictureModal === true && <ProfilePictureUploader
                        showModal={profilePictureModal}
                        user={userInfo}
                        profilePictureCallback={handleProfilePictureUploadCallback}/>
                }

                {/*{*/}
                {/*shareLink && shareModal && <ShareLinkModal value={shareLink} />*/}
                {/*}*/}
            </div>

            {copied && linkCode && <CopierModal
                linkCode={linkCode}
                showModal={copied}
                setCopier={handleCopier}
                setModalCallback={handleCopyModal}
            />}

        </Layout>

    )
}

export default Profile;
