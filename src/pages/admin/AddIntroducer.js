import React, {useEffect, useState} from 'react';
import Swal from "sweetalert2";
import * as FetchApi from "../../libs/FetchApi";
import {BASE_URL} from "../../constants";
import Cookies from "js-cookie";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import Loader from "react-loader-spinner";


export default function AddIntroducer(props) {
    const userId = props.userId;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [introducerEmail, setIntroducerEmail] = useState('');
    const [introducer, setIntroduer] = useState('');



    useEffect(() => {
        if (userId && !user)
            getUserInfo(userId);

    }, []);


    const getUserInfo = async (userId) => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
        const data = await fetch(`${BASE_URL}/users/${userId}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        setLoading(false)

        if (response) {
            if (response.code === 401) history.push('/signin');
            else if (response.code === 404) console.log('Whoops..', "No user data found", 'error');
            else {
                setUser(response.user);
                setIntroduer(response.introducer && response.introducer || '');
            }
        }
        else console.log('Whoops..', "No user data found", 'error');
    }

    function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (introducerEmail) {
            const data = {referrerEmail: introducerEmail};
            FetchApi.sendPutRequest(`/mlm/${user.id}/referrer`, data, {credential: true})
                .then(res => {
                    if (res.ok) {
                        // success
                        Swal.fire('Introducer name  updated', 'User data has been updated successfully', 'success');

                    } else {
                        // handle err
                        Swal.fire('Error', res.data.message, 'error');
                    }
                }).finally(() => {
                setLoading(false);
            })
        }
    }
    ;


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

                                    <p className="font-bold text-2xl text-left"> Present Introducer Info </p>

                                    <div className="ml-3 text-base mt-2">
                                        <p>Email: <span className="ml-1">{introducer.email} </span></p>
                                        <p>Name: <span className="ml-1">{introducer.fullName}</span></p>
                                        <p>Nick Name: <span className="ml-1">{introducer.nickName} </span></p>

                                    </div>


                                </div>

                            </div>


                            <form onSubmit={onSubmit}>
                                <div className=" my-4 bg-gray-50 px-4 py-4 border-1 overflow-hidden sm:rounded-md">

                                    <div className=" my-4 mx-2">
                                        <p className="font-bold text-2xl text-left mb-2">Update
                                            Introducer</p>

                                        <input
                                            onChange={e => setIntroducerEmail(e.target.value)}
                                            type="email" name="introducerEmail" id="introducerEmail"
                                            value={introducerEmail}
                                            placeholder="Introducer email"
                                            className="border-2 py-2 px-2 w-full text-sm text-black bg-white rounded-md  focus:outline-none focus:bg-white focus:text-gray-900"
                                        />
                                    </div>
                                    <div className="px-6 py-3 bg-gray-50 text-center sm:px-6">
                                        <button type="submit"
                                                className="inline-flex justify-center py-2 px-12 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-site-theme hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-theme">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else return (<CustomLoader/>)
}
