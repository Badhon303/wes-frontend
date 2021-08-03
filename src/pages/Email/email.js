import Layout from "../../components/Layout/Layout";
import React, {useEffect} from "react";
import UserManager from "../../libs/UserManager";
import {isLoggedIn} from "../../libs/AuthManager";
import {useHistory} from 'react-router-dom';
import EmailPage from "./emailPage";

export default function EmailJs() {

    const history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }

    useEffect(() => {
        if (userInfo && userInfo.role !== "admin") {
            history.push('/signin');
        }
    }, [userInfo])


    return (
        <Layout>
            {userInfo && isUserLoggedIn &&  <EmailPage /> }
        </Layout>
    )
}
