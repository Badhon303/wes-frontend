import Layout from "../../components/Layout/Layout";
import React from "react";
import UserManager from "../../libs/UserManager";
import {useHistory} from 'react-router-dom';
import {isLoggedIn} from "../../libs/AuthManager";
import UserMlmPage from "./UserMlmPage";
import AdminMlmPage from "./AdminMlmPage";

export default function MlmPage() {
    const history = useHistory();
    const userInfo = UserManager.getLoggedInUser();
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
        history.push('/signin');
    }


    return (
        <Layout>
            {userInfo && userInfo.role==="admin" ?

                <AdminMlmPage/> : <UserMlmPage/>
            }

        </Layout>
    )
}
