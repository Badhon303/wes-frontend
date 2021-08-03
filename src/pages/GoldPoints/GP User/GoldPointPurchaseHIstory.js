import Layout from "../../../components/Layout/Layout";
import React from "react";
import UserManager from "../../../libs/UserManager";
import {useHistory} from 'react-router-dom';
import {isLoggedIn} from "../../../libs/AuthManager";
import GPPurchaseHistoryPage from "./GoldPointPurchaseHistoryPage";


export default function GoldPointPurchaseHistory() {
    const history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    return (
        <Layout>
            {userInfo && isUserLoggedIn &&  <GPPurchaseHistoryPage/> }

        </Layout>
    )
}
