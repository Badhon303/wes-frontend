import Layout from "../../components/Layout/Layout";
import React, {useEffect,useState} from "react";
import UserManager from "../../libs/UserManager";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {coinData} from "../../utils/staticTexts";
import { Doughnut, Line } from 'react-chartjs-2'
import ChartCard from "../../components/Chart/ChartCard";
import ChartLegend from "../../components/Chart/ChartLegend";
import {doughnutLegends, doughnutOptions, lineLegends, lineOptions} from "../../utils/demo/chartsData";

export default function Dashboard() {
    const userInfo = UserManager.getLoggedInUser();

    const [copier, setCopier]= useState(false);

    let address = userInfo && userInfo.bcAccount.address;


    useEffect(() => {
        if (userInfo && userInfo.role !== "admin") {
            history.push('/')
            return '<></>';
        }
    }, [])


    return(
        <Layout>
            <div className="bg-theme-bg-color">
                <div className=" md:pt-6 md:pb-6 p-6  ">
                    <p className="font-bold text-2xl font-title text-title">Dashboard </p>

                    <div className="mt-4 bg-white shadow  flex rounded-l-lg  rounded-r-0 w-full flex justify-between">
                        <p className="text-gradians text-xl px-10  font-bold py-6 word-break"> {address} </p>
                        <CopyToClipboard text={address}
                                         onCopy={() => setCopier(true)}>
                            <button className="flex items-center px-6 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                {copier ?   <p className="text-white font-semibold text-sm text-left">Copied</p> : <> </>}
                        </button>
                        </CopyToClipboard>
                    </div>


                    <div className="my-8">

                            <div className="grid grid-cols-12 md:gap-8 gap-2 ">

                                {
                                    coinData.map((obj)=>

                                        <div className="col-span-4  bg-white rounded shadow hover:shadow-xl cursor-pointer">
                                            <div className="p-4 md:p-10">
                                                <p className="text-title text-base  md:text-2xl  text-left ">{obj.name}</p>

                                                <p className="text-title  text-lg md:text-3xl text-center py-2 md:py-8 word-break"> {obj.value}</p>
                                            </div>


                                        </div>
                                    )}
                            </div>

                    </div>

                    <div className="my-8">

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <ChartCard title="Total Users">
                            <Doughnut {...doughnutOptions} />
                            <ChartLegend legends={doughnutLegends} />
                        </ChartCard>

                            <ChartCard title="Email ">
                            <Line {...lineOptions} />
                            <ChartLegend legends={lineLegends} />
                        </ChartCard>
                    </div>
                    </div>


                </div>
        </div>
        </Layout>
    )
}
