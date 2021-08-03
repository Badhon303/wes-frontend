import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'
import UserManager from '../../libs/UserManager';
import DrivingLicense from '../verify/DrivingLicense';
import NID from '../verify/NID';
import Passport from '../verify/Passport';
import BasicInfoForm from './BasicInfoForm';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants';
import ChangePassword from "../auth/ChangePass";

const TAB_BASIC_INFO = 1;
const TAB_NID_VERIFY = 2;
const TAB_PASSPORT_VERIFY = 3;
const TAB_DRIVING_VERIFY = 4;
const PASSWORD_CHANGE=5;

export default function EditProfile(props) {

  const [activeTab, setActiveTab] = useState(TAB_BASIC_INFO)

  let history = useHistory();
  const userInfo = UserManager.getLoggedInUser();
  useEffect(() => {
    if (!userInfo) history.push('/')
  })

  const [user, setUser] = useState(userInfo);

  const getUserApi = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + Cookies.get('access-token'));
    const data = await fetch(`${BASE_URL}/users/${userInfo.id}`, {
      method: "GET",
      headers: myHeaders,
    });
    const response = await data.json();

    if (response) {
        if(response.code===401)  history.push('/signin');
        else  if (response.code === 404) console.log('Whoops..', "No user data found", 'error');
      else setUser({ ...user, ...response.user });
    }
    else console.log('Whoops..', "No user data found", 'error');
  }

  useEffect(() => {
    getUserApi()
  }, [])

  return (<>
    <Layout>
      <div className="grid grid-cols-12">
        <div className="md:col-span-2 col-span-3 bg-white m-1">
          <ul className="pl-8 h-screen">
            <li className="p-2 cursor-pointer hover:underline hover:bg-site-theme" onClick={() => setActiveTab(TAB_BASIC_INFO)} ><a>Edit Basic info</a></li>
            <li className="p-2 cursor-pointer hover:underline hover:bg-site-theme" onClick={() => setActiveTab(TAB_NID_VERIFY)}><a>NID</a></li>
            <li className="p-2 cursor-pointer hover:underline hover:bg-site-theme" onClick={() => setActiveTab(TAB_PASSPORT_VERIFY)}><a>Passport</a></li>
            <li className="p-2 cursor-pointer hover:underline hover:bg-site-theme" onClick={() => setActiveTab(TAB_DRIVING_VERIFY)}><a>Driving license</a></li>
              <li className="p-2 cursor-pointer hover:underline hover:bg-site-theme" onClick={() => setActiveTab(PASSWORD_CHANGE)}><a>Password Change</a></li>
          </ul>
        </div>
        <div className="col-span-9 bg-white m-2 pl-3 pr-3">
          {activeTab === TAB_BASIC_INFO && <BasicInfoForm user={user} />}
          {activeTab === TAB_NID_VERIFY && <NID />}
          {activeTab === TAB_PASSPORT_VERIFY && <Passport />}
          {activeTab === TAB_DRIVING_VERIFY && <DrivingLicense />}
            {activeTab === PASSWORD_CHANGE && <ChangePassword />}


        </div>
      </div>
    </Layout>
  </>)
}
