import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Layout, message, PageHeader, Typography} from 'antd';
import {CloudUploadOutlined} from "@ant-design/icons";
import {getLoginStatus, UserInfo} from "../../auth/authContainer";
import decode from "jwt-decode";
import {PROFILE_UPDATE_API} from "../../gql/user";
import {useMutation} from "@apollo/client";

const {Content,} = Layout;

const {Title} = Typography;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const user = UserInfo();
const token = getLoginStatus();

export default function AccountBody(props) {
    const [form] = Form.useForm();
    const info = decode(token);
    let apiVariable = {}
    const [name, setName] = useState(user && user.name ? user.name : "")
    const [oldPass, setOldPass] = useState(null);
    const [newPass, setNewPass] = useState(null);

    const [updateCMSProfile, {data, error, loading}] = useMutation(PROFILE_UPDATE_API, {
        onError(error) {
            message.error("Invalid Password!")
        }
    },)

    const onFinish =(values) => {

        let password=undefined;

        if(values.confirm && values.password  && values.confirm === values.password && values.confirm !=="" && values.password !==""){
            password= values.password
        }
        console.log(name,values);

        if(name) apiVariable.name= name;
        if(password) apiVariable.new_pass= password;
        if(values.OldPassword) apiVariable.old_pass= values.OldPassword;

        if((password ===undefined || password ==="") && (values.OldPassword===undefined || values.OldPassword==="")  && name ) {
            if(name!==user.name){

                updateCMSProfile({
                    variables:apiVariable
                })
            }
            else {
                message.warning("Nothing to update!")
            }

        }
        else {
            if(
                password===undefined ||
                    (values.OldPassword !== undefined && password ===undefined) ||
                (values.OldPassword !== undefined && password ==="") ||
                (values.OldPassword===undefined && password !==undefined) ||
                (values.OldPassword==="" && password !==undefined)  ||
                (values.OldPassword==="" && password ==="")
            ){
                message.warning("Please Put Your  Old Password & New Password")
            }
            else {
                updateCMSProfile({
                    variables:apiVariable
                })
            }

        }


        //
        //
        // if(password ===undefined && values.OldPassword===undefined  && name ) {
        //     updateCMSProfile({
        //         variables:apiVariable
        //     })
        // }
        // else if((values.OldPassword!==undefined && values.password===undefined ) || (values.OldPassword===undefined && values.password!==undefined )){
        //     message.warning("Please put your password,it should be not empty!")
        // }
        // else if(values.OldPassword!==undefined && values.password!==undefined ){
        //     updateCMSProfile({
        //         variables:apiVariable
        //     })
        // }

    };


    // const onFinish = (values) => {
    //
    //     let oldPassword;
    //     let newPassword;
    //     let confirmPassword;
    //
    //     if (name) apiVariable.name = name;
    //     if (oldPass === undefined || oldPass === null || oldPass === "") oldPassword = null;
    //     if (newPass === undefined || newPass === null || newPass === "") newPassword = null;
    //     if (values.confirm === undefined || values.confirm === null || values.confirm === "") confirmPassword = null;
    //
    //     if (confirmPassword  && newPass && confirmPassword === newPass ) {
    //         if (oldPass && oldPass !== "") {
    //             oldPassword = oldPass;
    //             apiVariable.old_pass = oldPassword;
    //         }
    //
    //         if (newPass && newPass !== "") {
    //             newPassword = newPass;
    //
    //             apiVariable.new_pass = newPassword;
    //         }
    //
    //
    //     }
    //     else if(confirmPassword !== newPass){
    //         message.warning("No password match")
    //     }

        // updateCMSProfile({
        //     variables: apiVariable
        // })


        // if(name) apiVariable.name = name;

        // if ((newPass === null || newPass === undefined || newPass === "") && (oldPass === null || oldPass === undefined || oldPass === "")){
        //     // send only name

        //
        // //jodi sob input field undefined or null or "" hoy taile  nothingsto send
        //
        //
        //
        // let password = undefined;
        // if (values.confirm && values.password && values.confirm === values.password && values.confirm !== "" && values.password !== "") {
        //     let password = values.password
        // }
        // console.log(name, values);

    // }

    useEffect(() => {
        if (data && data.updateCMSProfile !== null) {
            let user = {
                name: name,
                email: data.updateCMSProfile.email
            }
            localStorage.setItem("profile", JSON.stringify(user));
            message.success("Successfully Profile Updated")
            apiVariable = {}

        }

    }, [data])

    function handleName(e) {
        setName(e.target.value)
    }


    function handleOldPass(e) {

        setOldPass(e.target.value)
    }

    function handleNewPass(e) {

        setNewPass(e.target.value)
    }

    return (
        <Layout style={{backgroundColor: "white", height: "100vh", paddingLeft: 10, paddingRight: 20}}>
            <Form
                {...formItemLayout}
                layout="vertical"
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >

                <PageHeader
                    title={<span>
                        <Title level={3}> Profile Settings </Title>
                        </span>}
                    extra={[

                        <Form.Item  {...tailFormItemLayout}>
                            <Button size={'large'} icon={<CloudUploadOutlined/>}
                                    type="primary" htmlType="submit">Update</Button>
                        </Form.Item>
                    ]}

                    style={{height: 80, borderBottom: "1px solid rgb(235, 237, 240)"}}
                />
                <Content style={{paddingTop: 30, paddingBottom: 30, paddingLeft: 25, paddingRight: 20}}>


                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                message: 'Please enter your name!',
                            },
                        ]}
                    >
                        <Input defaultValue={user ? user.name : null} onChange={handleName}/>
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                    >
                        <Input disabled defaultValue={info ? info.role : ''}/>
                    </Form.Item>
                    <br/>
                    <Title level={3}>Change Password</Title>
                    <br/>

                    <Form.Item name="OldPassword" label="Old password"
                               dependencies={['password','confirm']}
                               hasFeedback
                               rules={[
                                   {

                                       message: 'Please input your old password!',
                                   },
                               ]}>
                        <Input type="textarea" defaultValue={undefined} onChange={handleOldPass}/>
                    </Form.Item>
                    <br/>
                    <Form.Item
                        name="password"
                        label="New Password"
                        dependencies={['OldPassword','confirm']}
                        rules={[
                            {

                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password onChange={handleNewPass}/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"

                        label="Confirm Password"
                        dependencies={['password','OldPassword']}
                        hasFeedback
                        rules={[
                            {

                                message: 'Please confirm your password!',
                            },
                            ({getFieldValue}) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                </Content>
            </Form>
        </Layout>
    )


}


