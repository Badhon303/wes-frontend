import Layout from "../components/Layout/Layout";
import React from "react";
import UserManager from "../libs/UserManager";
import AdminDashboard from "./Dashboard/adminDashboard";
import UserDashboard from "./Dashboard/userDashboard";

export default function Dashboard() {
    const userInfo = UserManager.getLoggedInUser();

    return(
        <Layout>
            {userInfo && userInfo.role === "admin" ?    <AdminDashboard/> : <UserDashboard/> }
        </Layout>
    )
}
