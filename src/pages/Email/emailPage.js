import React, {useEffect, useState} from "react";
import UserManager from "../../libs/UserManager";
import {useHistory} from 'react-router-dom';
import Cookies from "js-cookie";
import {BASE_URL} from "../../constants";
import Swal from "sweetalert2";
import EmailsViewEditModal from "../../components/Modal/EmailsViewEditModal";
import CustomLoader from "../../components/CustomLoader/CustomLoader";

//
// const swalWithBootstrapButtons = Swal.mixin({
//     customClass: {
//         confirmButton: 'green',
//         cancelButton: 'red'
//     },
//     buttonsStyling: false
// })

export default function EmailPage() {

    const history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const [messages, setMessages] = useState(null);
    const [modal,setModal] = useState(false);
    const [emailId,setEmailId]= useState(null)
    const [type,setType] = useState(null);
    const [loading,setLoading] = useState(false);


    useEffect(() => {
        let point = getEmails();
    }, []);

    const getEmails = async () => {


        if (userInfo && Cookies.get("access-token")) {
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append(
                "Authorization",
                "Bearer " + Cookies.get("access-token")
            );

            const data = await fetch(`${BASE_URL}/email-template`, {
                method: "GET",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                setLoading(false)
                if (response.code === 401) history.push("/signin");
                else if (response.code === 400 || response.code === 404 || response.code===500){
                    Swal.fire("Whoops..", response.message, "error");
                }
                else {
                    setMessages(response);
                }
            } else Swal.fire("Whoops..", "No data found", "error");
        }
    };


    function handleView(id){

        setEmailId(id)
        setModal(true)
        setType('view')
    }

    function handleEdit(id){
        setEmailId(id)
        setModal(true)
        setType('edit')
    }

    function handleDelete(id) {

       Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {

                let res=callDeleteApi(id)
                if(res) {
                    Swal.fire(
                        'Deleted!',
                        'Email Template has been deleted.',
                        'success'
                    )
                    let res=  getEmails();

                }
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    'Cancelled',
                    'Your email template file is safe :)',
                    'success'
                )
            }
        })




    }

    const callDeleteApi = async (id) => {

        // http://localhost:3000/v1/email-template/60e6d401536a7920af9a2b79

        if (userInfo && Cookies.get("access-token")) {
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append(
                "Authorization",
                "Bearer " + Cookies.get("access-token")
            );

            const data = await fetch(`${BASE_URL}/email-template/${id}`, {
                method: "DELETE",
                headers: myHeaders,
            });
            const response = await data.json();

            if (response) {
                setLoading(false)
                if (response.code === 401) history.push("/signin");
                else if (response.code === 400 || response.code === 404 || response.code===500){
                    Swal.fire("Whoops..", response.message, "error");
                }
                else {
                    console.log(response);
                }
            } else Swal.fire("Whoops..", "No data found", "error");
        }


    }

    function callbackHandle(data){
        setModal(!modal)
        setEmailId(null)
        setType(null)

        if(data){
            let res=  getEmails();
        }

    }


    return (
        <main className="m-6">
            <p className="text-center text-site-theme font-bold my-6"> Emails </p>
            {loading && <CustomLoader/>}


            {messages && messages.map((obj,index)=>(


            <div key={obj._id} className="my-3  p-4 flex justify-between break-words items-center text-base   border  rounded text-gray-800">

                <p>{index+1} Subject:{obj.title} </p>

                <div className="flex items-center">

                    <div className="mx-3 cursor-pointer" onClick={()=>handleView(obj._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    </div>

                    <div className="mx-3 cursor-pointer" onClick={()=>handleEdit(obj._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M3,10h11v2H3V10z M3,8h11V6H3V8z M3,16h7v-2H3V16z M18.01,12.87l0.71-0.71c0.39-0.39,1.02-0.39,1.41,0l0.71,0.71 c0.39,0.39,0.39,1.02,0,1.41l-0.71,0.71L18.01,12.87z M17.3,13.58l-5.3,5.3V21h2.12l5.3-5.3L17.3,13.58z"/></svg>
                    </div>

                    <div className="mx-3 cursor-pointer" onClick={()=>handleDelete(obj._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>

                    </div>

                </div>

            </div>
            ))}

            {modal && emailId && (
                <EmailsViewEditModal
                    id={emailId}
                    type={type}
                    hideButton={false}
                    onClose={callbackHandle}
                />
            )}


        </main>
    )
}
