import React from 'react'
import {Link, useHistory} from 'react-router-dom';
import Layout from "../components/Layout/Layout";
import {isLoggedIn} from '../libs/AuthManager';
import UserManager from '../libs/UserManager';

const HomePage = () => {
    const history = useHistory();

    const isUserLoggedIn = isLoggedIn();
    const user = UserManager.getLoggedInUser();

    if (isUserLoggedIn && user) {
        history.push('/dashboard');
    } else {
        history.push('/signin');
    }

    return (
        <Layout>
            <div className="flex justify-center items-center">
                <div className="text-center  pt-24">
                    <h1 className="text-3xl">Welcome</h1>
                    <Link to="/signin" className="mt-4">Signin</Link>
                </div>
            </div>
        </Layout>
    )
}
export default HomePage;
