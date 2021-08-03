import React, {useEffect, useState} from 'react';
import Swal from "sweetalert2";
import * as FetchApi from "../../libs/FetchApi";
import {BASE_URL} from "../../constants";
import Cookies from "js-cookie";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Loader from "react-loader-spinner";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";


export default function UserStatusChange(props) {
    const userId = props.userId;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [approveStatus,setApproveStatus]  = useState(null)
    const [statusChange,setStatusChange]  = useState(null)

    useEffect(() => {
        if (userId && !user)
            getUserInfo(userId);

    }, []);


    const approveUser = async ( status) => {
        setLoading(true);
        const myHeaders = new Headers();

        // let formData = approvalStatus=true
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        myHeaders.append("Content-Type", "application/json");

        const data = await fetch(`${BASE_URL}/users/${userId}/change-approval-status`, {
            method: "PUT",
            body: JSON.stringify({
                approvalStatus: status,
            }),
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            console.log(response.approved, response,'adffasfdfj')
            setLoading(false);
            if (response.code === 401) history.push("/signin");
            if (response.code === 404) console.log("Whoops..", "No user data found", "error");

            else if (response.approved) {
                Swal.fire("Updated", "User status Updated", "success");
                setApproveStatus(status.charAt(0).toUpperCase() +  status.slice(1))
            }


        }
        else console.log("Whoops..", "No user data found", "error");
    };



    const getUserInfo = async (userId) => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/users/${userId}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();


        if (response) {
            setLoading(false)
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404) console.log('Whoops..', "No user data found", 'error');
            else {
                setUser(response.user);
                setApproveStatus(response.user.approvalStatus && response.user.approvalStatus.charAt(0).toUpperCase() +  response.user.approvalStatus.slice(1))
            }
        }
        else console.log('Whoops..', "No user data found", 'error');
    }

    function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (statusChange) {
           let status=  approveUser(statusChange);
           if(status) setStatusChange(null)
        }
    } ;

    function updateUserStatus(e) {

        setStatusChange(e.value)


    }

    if (user) {
        return (
            <>
                <div className="mt-10 sm:mt-0 w-full px-6 ">
                    {loading && <div className="flex justify-center items-center">
                        <Loader
                            type="Circles"
                            color="#ff8c00"
                            height={100}
                            width={100}
                            timeout={7000}//3 secs
                            className=" inline-block align-middle absolute  z-50  "
                        />
                    </div>}


                    <div className="md:grid md:grid-cols-1 md:gap-6">
                        <div className="">

                            <div className="my-4 bg-gray-50 px-4 py-4 border-1 overflow-hidden sm:rounded-md">
                                <div className=" my-4 mx-2 ">

                                    <p className="text-xl text-left w-64"> Present Status
                                        <span
                                            className={
                                                (user && approveStatus === "Approved"
                                                    ? "bg-green-600"
                                                    : (approveStatus && approveStatus=== "Rejected" ? "bg-red-600" : "bg-yellow-600") )+
                                                " text-white font-bold  ml-8 px-4 py-2 rounded-full text-xs"
                                            }
                                        >
                          {approveStatus}
                        </span>
                                    </p>


                                </div>

                            </div>

                                <div className=" my-4 bg-gray-50 px-4 py-4 border-1 overflow-hidden sm:rounded-md h-64" >

                                    <div className=" my-4 mx-2 flex  w-full">
                                        <p className=" text-xl text-left w-64">Change Status</p>

                                      <div className="w-full md:w-1/3">
                                          <DropDownMenuWithIcon
                                            className={"rounded text-black"}
                                            options={props.userStatusOptions}
                                            defaultValue={
                                                user && approveStatus ? approveStatus  : null
                                            }
                                            selectCallback={updateUserStatus}
                                            placeholder={"Change Status"}

                                        />
                                      </div>


                                    </div>



                                    <div className="px-6 mt-12  py-3 bg-gray-50 text-center sm:px-6">
                                        <button onClick={onSubmit}
                                                className="inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme">
                                            Update
                                        </button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else return (<CustomLoader/>)
}
