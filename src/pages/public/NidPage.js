import Layout from "../../components/Layout/Layout";
import React from "react";
import NID from "../verify/NID";

export default function
    NidPage() {

    return(
        <Layout>

            <div className="md:px-16 lg:px-24 px-4">
                <NID/>

            </div>


        </Layout>
    )
}
