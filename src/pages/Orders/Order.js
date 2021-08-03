import Layout from "../../components/Layout/Layout";
import React, {useState} from "react";
import UserManager from "../../libs/UserManager";
import {useHistory} from 'react-router-dom';
import {isLoggedIn} from "../../libs/AuthManager";
import AdminOrdersPage from "./AdminOrdersPage";
import UserOrderPage from "./UserOrdersPage";

export default function Orders() {
    const history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    return (
        <Layout>
            {userInfo && userInfo.role==="admin" ?

            <AdminOrdersPage/> : <UserOrderPage/>
            }

        </Layout>
    )
}
