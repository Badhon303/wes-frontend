import React from "react";
import UserManager from "../../../libs/UserManager";
import {isLoggedIn} from "../../../libs/AuthManager";
import {useHistory} from 'react-router-dom';
import Layout from "../../../components/Layout/Layout";
import GPAAdminHistoryPage from "./GPAdminHistoryPage";

export default function AdminExchangeHistory() {
    const history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }

    return (

        <Layout>
            {userInfo && isUserLoggedIn &&   <GPAAdminHistoryPage/> }
        </Layout>
    )
}
