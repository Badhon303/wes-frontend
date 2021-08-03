import React, {useState} from "react";
import UserManager from "../../libs/UserManager";
import {isLoggedIn} from "../../libs/AuthManager";
import {useHistory} from "react-router-dom";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import MlmTree from "../../components/Mlm/MlmTree";
import Loader from "react-loader-spinner";
import DropDownMenuWithIcon from "../../components/Dropdown/DropDownWithMenu";
import * as FetchApi from "../../libs/FetchApi";
import {getReadableTime} from "../../utils/times";

export default function AdminMlmPage() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();

    const [mlmTree, setMlmTree] = useState(null);
    const [referrer, setReferrer] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);
    const [firstData, setFirstData] = useState(null);
    const [treeType, setTreeType] = useState(null)
    const [message, setMessage] = useState(null);


    // useEffect(() => {
    //   let abc = getMlmTree();
    // }, []);

    if (!isUserLoggedIn) {
        history.push("/signin");
    }
    //
    // function searchTree(e) {
    //     e.preventDefault(e);
    //     if (treeType === "single" && searchTerm) getMlmTree();
    // }

    const getMlmTree = async () => {
        setLoading(true);

        if (userInfo && Cookies.get("access-token")) {
            const myHeaders = new Headers();
            let searchQuery = "";

            if (searchTerm && treeType === "single") {
                searchQuery = `?email=${searchTerm}`;
            }

            myHeaders.append(
                "Authorization",
                "Bearer " + Cookies.get("access-token")
            );

            const data = await fetch(`${BASE_URL}/mlm/tree${searchQuery}`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                setLoading(false);
                if (response.code === 401) history.push("/signin");
                else if (response.code === 404)
                    Swal.fire("Whoops..", "No  mlm user data found", "error");
                else {

                    if (response && response.treeObj && response.treeObj.tree) {
                        if (!searchTerm) setFirstData(response.treeObj);
                        setMlmTree(response.treeObj);
                    }
                    else {
                        setMlmTree(null)
                        setMessage(response.message)
                        Swal.fire("Whoops..", response.message, "error");
                    }
                }
            } else Swal.fire("Whoops..", "No mlm user data found", "error");
        }
    };


    const getUpdateRequestMlmTree = async () => {


        let data = {
            email: (treeType && treeType === "all" ? userInfo.email : searchTerm),

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


    const getReferrer = async () => {
        if (userInfo && Cookies.get("access-token")) {
            const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");
            myHeaders.append(
                "Authorization",
                "Bearer " + Cookies.get("access-token")
            );

            const data = await fetch(`${BASE_URL}/mlm/${userInfo.id}/referrer`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                if (response.code === 401) history.push("/signin");
                else if (response.code === 404)
                    Swal.fire("Whoops..", "No  referrer data found", "error");
                else {
                    setReferrer(response);
                }
            } else Swal.fire("Whoops..", "No  referrer data found", "error");
        }
    };

    function handleSearch(e) {

        if (e.target.value) {
            setSearchTerm(e.target.value);
        } else if (!e.target.value) {
            setSearchTerm(null);
            setMlmTree(firstData);
        }
    }

    function handleTreeType(e) {
        setTreeType(e.value)
        setMessage(null)
    }

    function onSubmit() {
        let abc = getMlmTree();
    }

    function onSubmitUpdate() {

        if (treeType && treeType === "single") {
            if (searchTerm) {
                let abc = getUpdateRequestMlmTree();
            }
            else Swal.fire("Warning", "Type an email address or Change Tree Type", 'error')
        }
        else {
            let abc = getUpdateRequestMlmTree();
        }

    }



    return (
        <main className=" ">
            {loading && <div
                className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-transparent flex flex-col items-center justify-center"
            ><Loader
                type="Circles"
                color="#ff8c00"
                height={100}
                width={100}
                timeout={80000}//7 secs
                className=" p-10 z-50  "
            /></div>}
            <div className=" w-full bg-white rounded-xl p-2 md:p-6 ">

                <div className=" my-4 mx-2 flex items-center w-full">
                    <p className=" text-xl text-left w-32 font-semibold">Select Tree</p>

                    <div className="w-full md:w-1/3">
                        <DropDownMenuWithIcon
                            className={"rounded text-black"}
                            options={[
                                {
                                    label: "View Full Tree",
                                    value: "all",
                                },
                                {
                                    label: "View Particular User's Tree",
                                    value: "single",
                                },

                            ]}
                            defaultValue={treeType ? (treeType === "all" ? "View Full Tree" : "View Particular User's Tree") : "Select Tree Type"}
                            selectCallback={handleTreeType}
                            placeholder={"Tree Type"}

                        />
                    </div>
                    {treeType ? <button onClick={onSubmit}
                                        className="ml-8 inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme">
                        View Tree
                    </button> : <div/>}

                    {treeType && treeType.length && <button onClick={onSubmitUpdate}
                                                            className="ml-12 inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme">
                        Update Tree
                    </button>}


                </div>


                {treeType && treeType === "single" ?
                    <div
                        className="md:ml-32 w-full md:w-1/3 pl-2 md:w-116 flex mb-4"
                    >
                        <input

                            value={searchTerm}
                            type={"email"}
                            placeholder="Search by  email"
                            className="w-full inline-flex  border-1 p-3 outline-none focus:outline-none"
                            onChange={handleSearch}
                        />
                    </div>
                    : <div/>}
                <div className="rounded-xl border-1  w-full rounded-xl px-2 md:px-16 py-2 md:py-6 ">
                    {mlmTree ?
                        <div>
                            <p className="text-xl font-bold py-4 text-site-theme">Members</p>
                            <p className="text-sm text-gray-500">Last Updated at: {mlmTree ? getReadableTime(mlmTree.executionTime) : ''} </p>

                            <MlmTree mlmTree={mlmTree.tree}/>
                        </div>
                        : <div className="p-8 text-center ">
                            {message}
                        </div>}
                </div>

            </div>
        </main>
    );
}
