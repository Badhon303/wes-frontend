import UserManager from "../../libs/UserManager";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import React from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";


export default function BcAddressData({userInfo}) {

    const [eagleBalance, setEagleBalance] = useState(null);
    const [snowBalance, setSnowBalance] = useState(null);
    const [wolfBalance, setWolfBalance] = useState(null);
    const [copier, setCopier] = useState(false);

    // let address = userInfo && userInfo.bcAccount.address;
    let address="";

    const getEagleBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/bc-account/get-balance?address=${address}&currency=EAGLE&type=erc20`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            if(response.code===401)  history.push('/signin');
            else if (response.code === 404 || response.code===500) console.log('Whoops..', "No balance found", 'error');
            else setEagleBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }
    const getWolfBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/bc-account/get-balance?address=${address}&currency=WOLF&type=erc20`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            if(response.code===401)  history.push('/signin');
            else if (response.code === 404 || response.code===500) console.log('Whoops..', "No balance found", 'error');
            else setWolfBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }
    const getSnowBalance = async () => {

        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/bc-account/get-balance?address=${address}&currency=SNOW&type=erc20`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            if(response.code===401)  history.push('/signin');
            else if (response.code === 404 || response.code===500) console.log('Whoops..', "No balance found", 'error');
            else setSnowBalance(response && response.result && response.result.balance ? response.result.balance : "0");
        }
        else console.log('Whoops..', "No user data found", 'error');

    }


    useEffect(() => {
        getEagleBalance()
        getWolfBalance()
        getSnowBalance()
    }, [])



    return(
        <div>
            <div className="">
                <p className="mt-2 text-base font-semibold text-title font-gibson">Address </p>
                <div className=" mt-2 bg-white shadow  flex rounded-l-lg  rounded-r-0 w-full flex justify-between">
                    <p className="text-gradians text-xl px-6  font-bold py-2 word-break"> {address} </p>
                    <CopyToClipboard text={address}
                                     onCopy={() => setCopier(true)}>
                        <button className="flex items-center px-6 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                            {copier ?   <p className="text-white font-semibold text-sm text-left">Copied</p> : <> </>}
                        </button>
                    </CopyToClipboard>
                </div>
            </div>

            <div className="grid grid-cols-12 md:gap-8 gap-2 ">

                <div className="col-span-4  bg-white rounded shadow mt-1">
                    <div className="p-2 md:p-2">
                        <p className="text-title text-base font-semibold text-left pt-2">Wolf</p>

                        <p className="text-title  text-base  text-center py-2 md:py-2 word-break overflow-hidden"> {wolfBalance ? wolfBalance : "0.0"}</p>
                    </div>


                </div>
                <div className="col-span-4  bg-white rounded shadow mt-1">
                    <div className="p-2 md:p-2">
                        <p className="text-title text-base  font-semibold text-left pt-2">Eagle</p>

                        <p className="text-title  text-base text-center py-2 md:py-2 word-break overflow-hidden"> {eagleBalance ? eagleBalance : "0.0"}</p>
                    </div>


                </div>
                <div className="col-span-4  bg-white rounded shadow mt-1">
                    <div className="p-2 md:p-2">
                        <p className="text-title text-base   font-semibold text-left pt-2">Snow</p>

                        <p className="text-title  text-base text-center py-2 md:py-2 word-break overflow-hidden"> {snowBalance ? snowBalance : "0.0"}</p>
                    </div>


                </div>
            </div>
        </div>
    )
}
