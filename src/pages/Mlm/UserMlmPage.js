import React, {useEffect, useState} from "react";
import UserManager from "../../libs/UserManager";
import {isLoggedIn} from "../../libs/AuthManager";
import {useHistory} from 'react-router-dom';
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import MlmTree from "../../components/Mlm/MlmTree";
import * as FetchApi from "../../libs/FetchApi";
import {getReadableTime} from "../../utils/times";

export default function UserMlmPage() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();
    const [message, setMessage] = useState(null);
    const [ mlmTree, setMlmTree] =  useState(null);
    const [referrer,setReferrer] = useState(null)

    if (!isUserLoggedIn) {
        history.push('/signin');
    }



    useEffect(() => {

        getReferrer().then((res)=>{
            console.log('')
        })

    }, [])








    const getMlmTree = async () => {
        setLoading(true)

        if (userInfo && Cookies.get('access-token')) {
            const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/mlm/tree?email=${userInfo.email}`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                setLoading(false)
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No  mlm user data found", 'error');
                else {

                    if (response && response.treeObj && response.treeObj.tree) {
                        setMlmTree(response.treeObj);
                    }
                    else {
                        setMlmTree(null)
                        setMessage(response.message)
                        Swal.fire("Whoops..", response.message, "error");
                    }


                }
            }
            else Swal.fire('Whoops..', "No mlm user data found", 'error');
        }
    }


    const getReferrer = async () => {

        if (userInfo && Cookies.get('access-token')) {
            const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/mlm/${userInfo.id}/referrer`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404) Swal.fire('Whoops..', "No  referrer data found", 'error');
                else {

                    setReferrer(response)
                }
            }
            else Swal.fire('Whoops..', "No  referrer data found", 'error');
        }
    }

    const getUpdateRequestMlmTree = async () => {


        let data = {
            email:userInfo.email

        };

        if (userInfo && Cookies.get("access-token")) {
            setLoading(true);
            FetchApi.sendPostRequest("/mlm/tree", data, {
                credential: true,
            })
                .then((res) => {
                    if (res.ok) {
                        Swal.fire("Request Send", `Status: ${res.data.status}`, 'success');
                        // success

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

        }
    };

    function onSubmit() {
        let abc = getMlmTree();
    }

    function onSubmitUpdate() {

        let abc = getUpdateRequestMlmTree();
    }


    return (
        <div>

            <main className=" ">
                {loading && <CustomLoader/>}
                <div className=" w-full bg-white rounded-xl p-2 md:p-6 ">

                    <div className=" my-4 mx-2 flex items-center w-full">
                        <button onClick={onSubmit}
                                className="ml-8 inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme">
                            View Tree
                        </button>

                        <button onClick={onSubmitUpdate}
                                className="ml-12 inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme">
                            Update Tree
                        </button>

                    </div>


                    <div className="rounded-xl border-1  w-full rounded-xl px-2 md:px-16 py-2 md:py-6">
                        {mlmTree ?
                            <div>
                                <p className="text-xl font-bold py-4 text-site-theme">Members</p>
                                <p className="text-sm text-gray-500">Last Updated at: {mlmTree ? getReadableTime(mlmTree.executionTime) : ''} </p>

                                <MlmTree mlmTree={mlmTree.tree} referrer={referrer}/>
                            </div>
                            : <div className="p-8 text-center ">
                                {message}
                            </div>}



                    </div>
                </div>
            </main>


        </div>
    )
}
