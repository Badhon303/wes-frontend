import React from "react";
import {isLoggedIn} from "../../../libs/AuthManager";
import {useHistory} from 'react-router-dom';
import Layout from "../../../components/Layout/Layout";
import AdminExchangeRatePage from "./GpAdminExchangeRatePage";
// import AdminExchangeRatePage from "./GpAdminExchangeRatePage";


export default function AdminExchangeRate() {
    const history = useHistory();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    return (

        <Layout>

            {isUserLoggedIn && <AdminExchangeRatePage /> }


       </Layout>
    )
}
