import Layout from "../../components/Layout/Layout";
import React from "react";
import {useHistory} from 'react-router-dom';
import {isLoggedIn} from "../../libs/AuthManager";
import ReferralPurchaseUserPage from "./ReferralPurchaseUserPage";

export default function ReferralPurchase() {
    const history = useHistory();

    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    return (
        <Layout>
            <ReferralPurchaseUserPage/>
        </Layout>
    )
}
