import React, {useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "../../components/Toast/toast";
import {DownloadIcon} from "../../components/IconsSvg/svgIcons";


function BTCAccountCreate({btc,ether,privateKey,address}) {

    const [copier, setCopier] = useState(false);

    function downloadOption() {
        if(btc){
            downloadBitcoin()
        }
        if(ether){
            downloadEther()
        }
    }
   const  downloadBitcoin = () => {
        const element = document.createElement("a");
        const file = new Blob([privateKey],
            {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "Bitcoin_privatekey.txt";
        document.body.appendChild(element);
        element.click();
    }

    const  downloadEther= () => {
        const element = document.createElement("a");
        const file = new Blob([privateKey],
            {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "Ethereum_privatekey.txt";
        document.body.appendChild(element);
        element.click();
    }



    return (
        <div
            className="bg-white rounded-t-xl  w-full  md:border-t-1  items-center justify-center md:mx-auto ">
            <div
                className="py-2 md:py-6 md:px-3 md:px-0 lg:px-0 xl:px-0 w-full items-center justify-center md:mx-auto  ">
                <div className="mx-auto md:p-4  mt-12 bg-white  md:border-1  border-gray-400 rounded-2xl">

                    <div className="p-2 md:p-8">

                        <p className="text-title text-center  text-xl font-medium font-gibson">{btc ? "Bitcoin" : "Ether"} account information</p>

                        <div className="h-0 md:h-auto invisible md:visible  flex flex-cols md:flex-row mt-6 items-center">
                            <p className="w-24">Private Key: </p>


                                <div
                            className="ml-2 bg-white shadow border-1 flex rounded-l-lg  rounded-r-0 w-full flex  flex-row">
                            <div
                                className="text-gradians md:text-base text-sm px-6  font-bold py-2 justify-self-start break-all"> {privateKey} </div>
                            <div onClick={downloadOption}
                                className="ml-auto   flex  items-center px-3 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl hover:shadow cursor-pointer ">
                                <DownloadIcon/></div>
                            <CopyToClipboard text={privateKey}
                                             onCopy={() => setCopier(true)}>
                                <button onClick={() => toast.success('Copied', 'bottomLeft', 1000)}
                                        className="flex items-center px-3 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl ">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                                         width="24px" fill="#000000">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path
                                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                    </svg>
                                </button>
                            </CopyToClipboard>
                        </div>
                        </div>
                        <div className="mt-6 md:invisible visible h-auto md:h-0">
                            <p className="w-24">Private Key: </p>
                            <br/>
                            <div
                                className=" ml-2 bg-white shadow flex rounded-l-lg  rounded-r-0 w-full flex  flex-row">
                                <div
                                    className="text-gradians md:text-base text-sm px-6  font-bold py-2 break-all justify-self-start break-all"> {privateKey} </div>

                            </div>
                            <br/>

                               <div onClick={downloadOption}
                                 className="ml-auto   flex  items-center px-3 outline-none focus:outline-none shadow focus:shadow-xl hover:shadow cursor-pointer ">
                                <DownloadIcon/>
                            <br/>
                            <CopyToClipboard text={privateKey}
                                             onCopy={() => setCopier(true)}>
                                <button onClick={() => toast.success('Copied', 'bottomLeft', 1000)}
                                        className="flex items-center px-3  outline-none focus:outline-none shadow focus:shadow-xl ">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                                         width="24px" fill="#000000">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path
                                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                    </svg>
                                </button>
                            </CopyToClipboard>
                           </div>

                        </div>


                        <div className="flex flex-cols md:flex-row mt-6 items-center">
                            <p className="w-24">Address: </p>
                            <div
                                className=" ml-2 bg-white shadow border-1 flex rounded-l-lg  rounded-r-0 w-full flex  flex-row">
                                <div
                                    className="text-gradians md:text-base text-sm px-6  font-bold py-2 break-all justify-self-start break-all "> {address} </div>

                            </div>
                        </div>


                        <p className="pt-6 text-red-600 text-center text-base">
                            This is an only one time ,you will be seeing the private key.
                            <br/>
                            Copy and save the key.
                        </p>


                    </div>
                </div>
            </div>

        </div>
    )
}

export default BTCAccountCreate;


