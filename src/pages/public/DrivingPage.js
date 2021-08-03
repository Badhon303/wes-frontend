import Layout from "../../components/Layout/Layout";
import React from "react";
import DrivingLicense from "../verify/DrivingLicense";

export default function DrivingPage() {

    return(
        <Layout>

            <div className="md:px-16 lg:px-24 px-4">
                <DrivingLicense/>

            </div>


        </Layout>
    )
}
