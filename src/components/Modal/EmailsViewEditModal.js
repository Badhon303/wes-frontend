import React, {useEffect, useState} from "react";
import {func} from "prop-types";
import Modal from "react-modal";
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import UserManager from "../../libs/UserManager";
import CustomLoader from "../CustomLoader/CustomLoader";
import {customStylesModal} from "../../utils/styleFunctions";
import * as PurchaseAPI from "../../apis/purchase";


export default function EmailViewEditModal({id, type: viewType, hideButton, onClose}) {

    const [loading, setLoading] = useState(false);
    const userInfo = UserManager.getLoggedInUser();
    const [email, setEmail] = useState(null);
    const [newEmail, setNewEmail] = useState({
        title: '',
        body: ''
    })


    useEffect(() => {

        if (id) {
            let res = callEmailDetailsApi()
        }

    }, [id])

    const callEmailDetailsApi = async () => {

        if (userInfo && Cookies.get('access-token')) {
            setLoading(true)
            setTimeout(()=>{
                setLoading(false)
            },12000)

            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));

            const data = await fetch(`${BASE_URL}/email-template/${id}`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();


            if (response) {
                setLoading(false)
                if (response.code === 401) history.push('/signin');
                else if (response.code === 404 || response.code === 500) {
                    Swal.fire("Whoops..", response.message, "error");
                } else {

                    setEmail(response);



                }
            }
            else Swal.fire('Whoops..', "No  data found", 'error');
        }
    }

    function handleModalCallback() {
        onClose && onClose();
    }

    function handleEmail(e) {
        let em = e.target.value;
        setEmail(prev => ({
            ...prev,
            title: em
        }))
    }
    function handleGreetings(e) {
        let gr= e.target.value;
        setEmail(prev => ({
            ...prev,
            greetings: gr
        }))
    }



    function handleBody(e) {
        let body = e.target.value;
        setEmail(prev => ({
            ...prev,
            body: body
        }))
    }

    function handleSubmit() {

        let data= {
            greetings: email.greetings,
            body: email.body,
            title: email.title,
        }
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
        },12000)
        PurchaseAPI.updateEmail(data, id)
            .then((res) => {

                setLoading(false);
                if (res.ok) {
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        text: "Successfully email template updated",
                    });
                    onClose && onClose(true);

                }
                else {

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

    console.log(email,'em')

    return (
        <Modal
            isOpen={true}
            contentLabel="onRequestClose Example"
            onRequestClose={handleModalCallback}
            shouldCloseOnOverlayClick={false}
            style={customStylesModal}
        >
            <div>
                {loading && <CustomLoader/>}

                <div>
                <div
                    className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-2xl font-semibold text-site-theme w-full">
                        Email Template
                    </h3>
                    <div
                        className="px-6 py-2 ml-auto cursor-pointer "
                        onClick={handleModalCallback}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path
                                d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>

                    </div>
                </div>
                <div className="my-6">
                    {email && viewType === "view" ?
                        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-auto">

                            <div className="my-4">

                                <p> Subject </p>
                                <div className="w-full bg-gray-50 text-black font-medium p-4 rounded break-words">

                                    {email && email.title}
                                </div>

                            </div>


                            <div className="my-4">

                                <p> Body </p>
                                <div className="w-full bg-gray-50 text-black font-medium p-4 rounded break-all">
                                    {email && email.body}
                                </div>


                            </div>
                            {!loading &&   <button onClick={handleModalCallback}
                                                   className="mt-12   flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-red-400 text-white shadow hover:shadow-xl text-base font-bold"> Close
                            </button> }

                        </div>
                        : <div/>}


                    {email && viewType === "edit" ?

                        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-auto">

                            {/*<div className="my-4">*/}

                                {/*<p> Greetings </p>*/}

                                {/*<textarea*/}
                                    {/*rows="2"*/}
                                    {/*cols="24"*/}
                                    {/*className="w-full resize  border  text-black font-medium p-4 rounded break-words"*/}
                                    {/*onChange={handleGreetings}*/}
                                    {/*value={email && email.greetings}/>*/}


                            {/*</div>*/}


                            <div className="my-4">

                                <p> Subject </p>

                                   <textarea
                                       rows="3"
                                       cols="24"
                                       className="w-full resize  border  text-black font-medium p-4 rounded break-words"
                                       onChange={handleEmail}
                                       value={email && email.title}/>


                            </div>


                            <div className="my-4">

                                <p> Body </p>
                                <textarea
                                    rows="6"
                                    cols="24"
                                    className="w-full resize   border  text-black font-medium p-4 rounded "
                                    onChange={handleBody}
                                    value={email && email.body}/>


                            </div>


                            <div className="mb-40 mt-12  flex items-center mx-32">
                            {!loading &&   <button onClick={handleModalCallback}
                                                   className="flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-red-400 text-white shadow hover:shadow-xl text-base font-bold"> Close
                            </button> }
                            <button onClick={handleSubmit}
                                    className=" ml-8 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold">
                                Update
                            </button>
                            </div>


                        </div>
                        : <div/>}


                </div>


                </div>
            </div>


        </Modal>

    )
}

