import Layout from "../../components/Layout/Layout";
import React from "react";
import Passport from "../verify/Passport";

export default function PassportPage() {

    return(
        <Layout>

            <div className="md:px-16 lg:px-24 px-4">
                <Passport/>

            </div>


        </Layout>
    )
}
