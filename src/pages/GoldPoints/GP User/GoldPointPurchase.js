import Layout from "../../../components/Layout/Layout";
import React from "react";
import {useHistory} from 'react-router-dom';
import {isLoggedIn} from "../../../libs/AuthManager";
import GoldPointPurchasePage from "./GoldPointPurchasePage";


export default function GoldPointPurchase() {
    const history = useHistory();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    return (
        <Layout>
            {isUserLoggedIn  &&   <GoldPointPurchasePage/> }

        </Layout>
    )
}
