import React, {useState} from 'react';
import Layout from '../../components/Layout/Layout';
import EditUserBasicInfo from "./EditBasicInfos";
import AddIntroducer from "./AddIntroducer";
import {useHistory} from "react-router-dom";
import UserStatusChange from "./UserStatusChange";

export default function EditUserTab(props) {
    const userId = props.match.params.id;

    //
    // const userId = props.match.params.id &&  props.match.params.id.slice(1)
    //
    // const routeType = props.match.params.id &&  props.match.params.id.substring(0,2)
    // console.log(routeType,'afdsf')
    //

    let history = useHistory();

    const [tab,setTab]= useState(1);

    return (
            <>
                <Layout>

                    <div className="flex flex-row  m-4 justify-between container ">
                        <div className="flex flex-row ">
                        <div className={(tab===1 ? 'bg-yellow-400 text-white border-1 cursor-pointer p-3 font-semibold' : 'bg-white  text-black border-1 cursor-pointer p-3 font-semibold')} onClick={()=> setTab(1)}>
                             Basic Info
                        </div>
                        <div className={(tab===2 ? 'bg-yellow-400 text-white border-1 cursor-pointer p-3 font-semibold ml-4' : 'bg-white  text-black border-1 cursor-pointer p-3 font-semibold ml-4')} onClick={()=> setTab(2)}>
                            Introducer
                        </div>

                            <div className={(tab===3 ? 'bg-yellow-400 text-white border-1 cursor-pointer p-3 font-semibold ml-4' : 'bg-white  text-black border-1 cursor-pointer p-3 font-semibold ml-4')} onClick={()=> setTab(3)}>
                                User Status
                            </div>
                        </div>


                        <button  onClick={() => history.goBack()}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                        </button>


                    </div>

                    <div className="container my-6 mx-4">
                        {tab===1 &&   <div>
                            <EditUserBasicInfo
                            userId={userId}
                            />

                        </div> }

                        {tab===2 &&   <div>
                            <AddIntroducer
                                userId={userId}/>
                        </div> }


                        {tab===3 &&   <div>
                            <UserStatusChange
                                userId={userId}
                                userStatusOptions={[
                                    {
                                        label: "Approve",
                                        value: "approved",
                                    },
                                    {
                                        label: "Pending",
                                        value: "pending",
                                    },

                                    {
                                        label: "Reject",
                                        value: "rejected",
                                    },
                                    {
                                        label: "Un Applied",
                                        value: "unapplied",
                                    },
                                ]}

                            />
                        </div> }

                    </div>

                </Layout>
            </>
        )
}
