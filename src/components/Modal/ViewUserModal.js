import React, {useEffect, useState} from "react";
import {BASE_URL, PHOTO_URL} from "../../constants";
import {func} from "prop-types";
import Carousel from "react-multi-carousel";
import Days from "dayjs";
import Modal from "react-modal";
import Cookies from "js-cookie";
import CustomLoader from "../CustomLoader/CustomLoader";


const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 1
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 1
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 1
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 1
    }
};

const tableData = {
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    gender: 'Gender',
    nationality: 'Nationality',
    dob: 'Date of birth',
    email: 'Email',
    phone: 'Phone',
    state: 'State',
    city: 'City',
    street: 'Street',
    zipcode: 'Zip code',
}

export default function UserInfoForm(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [introducerEmail, setIntroducerEmail] = useState("");
    const [introducerName, setIntroducerName] = useState("");
    const [country, setCountry] = useState(
        user && user.nationality ? user.nationality : ""
    );

    useEffect(() => {
        if (props.user && props.user) getUserInfo(props.user);
    }, []);


    const getUserInfo = async (userId) => {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
        const data = await fetch(`${BASE_URL}/users/${props.user}`, {
            method: "GET",
            headers: myHeaders,
        });
        const response = await data.json();

        if (response) {
            setLoading(false);

            if (response.code === 401) history.push("/signin");
            else if (response.code === 404)
                console.log("Whoops..", "No user data found", "error");
            else {
                setUser(response.user);
                setCountry(response.user.nationality);
                setIntroducerName(response.introducerName);
            }
        } else console.log("Whoops..", "No user data found", "error");
    };

    function handleModalCallback() {
        props.onClose && props.onClose();
    }

    function handleAccept() {
        props.handleAccept && props.handleAccept(user.id);
    }

    function handleReject() {

        props.handleReject && props.handleReject(user.id);
    }


    return (
        <Modal
            isOpen={true}
            contentLabel="onRequestClose Example"
            onRequestClose={handleModalCallback}
            shouldCloseOnOverlayClick={false}
        >
            {loading && ( <CustomLoader/>
                ) }
             <div className=" ">
                <div
                    className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-2xl font-semibold">
                        {props.title}
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


                 { user && <div className="bg-white shadow overflow-hidden sm:rounded-lg">

                    <div className="border-t border-gray-200 grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.firstName ? user.firstName : ""} {user.middleName ? user.middleName : ""} {user.lastName ? user.lastName : ""}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Date of Birth
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.dob ? Days(user.dob).format('YYYY-MM-DD') : ""}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.email ? user.email : ""}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Phone
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.phone ? user.phone : ""}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Spouse Name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.spouseName ? user.spouseName : ""}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        National Id
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.nationalId ? user.nationalId : ""}
                                    </dd>
                                </div>


                            </dl>
                        </div>
                        <div className="col-span-1">
                            <dl>


                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Gender
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.gender ? user.gender : ""}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Nationality
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.nationality ? user.nationality : ""}
                                    </dd>
                                </div>
                                <div className="bg-gray-50  px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        State
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.state ? user.state : ""}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        City
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.city ? user.city : ""}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Street
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.street ? user.street : ""}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Zip Code
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.zipcode ? user.zipcode : ""}
                                    </dd>
                                </div>

                            </dl>
                        </div>
                    </div>
                </div>  }

                {/*<div>*/}

                    {/*{user &&   <BcAddressData*/}
                    {/*userInfo={user}*/}
                    {/*/> }*/}
                {/*</div>*/}


                 { user && tableData && Object.entries(tableData) && <Carousel
                    swipeable={true}
                    draggable={false}
                    showDots={true}
                    ssr={false} // means to render carousel on server-side.
                    infinite={true}
                    responsive={responsive}>
                    <div className="pt-2 flex justify-center">
                        <div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="md:col-span-1 col-span-2">

                                    <div className="w-full pb-2">
                                        <label className="font-bold">NID Front</label>
                                        {/*PHOTO_URL+user.nidFront*/}
                                        <img src={PHOTO_URL + user.nidFront} className="w-full h-64 "/>
                                    </div>

                                </div>
                                <div className="md:col-span-1 col-span-2">
                                    <div className="w-full pb-2">
                                        <label className="font-bold">NID Back</label>
                                        {/*PHOTO_URL+user.nidBack*/}
                                        <img src={PHOTO_URL + user.nidBack} className="w-full h-64 "/>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="pt-2 flex justify-center">
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="md:col-span-1 col-span-2">

                                    <div className="w-full pb-2">
                                        <label className="font-bold">Driving License Front</label>
                                        {/*<img src={ PHOTO_URLTEST} className="w-full h-64 "/>*/}
                                        <img src={PHOTO_URL + user.drivingFront} className="w-96 h-64"/>
                                    </div>
                                </div>
                                <div className="md:col-span-1 col-span-2">
                                    <div className="w-full pb-2">
                                        <label className="font-bold">Driving License Back</label>
                                        {/*<img src={ PHOTO_URLTEST} className="w-full h-64 "/>*/}
                                        <img src={PHOTO_URL + user.drivingBack} className="w-96 h-64"/>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="pt-2 flex justify-center">

                        <div>
                            <div className="w-full  pb-2">
                                <label className="font-bold text-left">Passport</label>
                                {/*<img src={ PHOTO_URLTEST} className="w-full h-64 "/>*/}
                                <img src={PHOTO_URL + user.passportBiodata} className="w-96 h-64"/>
                            </div>

                        </div>

                    </div>


                </Carousel>}

            </div>

            {
              !loading && user && props && props.hideButton === false &&
                <div className="w-full flex pt-4 justify-center">
                    <hr/>
                    <button onClick={handleAccept}
                            className="px-6 py-3 text-white hover:shadow-xl mr-4 bg-green-600 rounded shadow ">Accept
                    </button>
                    <button onClick={handleReject}
                            className="px-6 py-3 text-white hover:shadow-xl  bg-red-600 rounded shadow">Reject
                    </button>
                </div>
            }
        </Modal>

    )
}

