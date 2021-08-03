import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import BTCAccountCreate from "../../pages/auth/btcAccountCreate";
import CustomLoader from "../CustomLoader/CustomLoader";
import {createBitcoinAccount, createEtherAccount} from "../../apis/createAccount";
import Swal from "sweetalert2";

export default function CreateBtcModal({createAccount,open,cbCreate}) {
    const [showModal, setShowModal] = useState(open);
    const [accountInfo, setAccountInfo] =useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
           createBtcAccount()

    }, [createAccount])

    function createBtcAccount() {
        setLoading(true)



        if(createAccount==="Bitcoin") {
            createBitcoinAccount()
                .then(response => {
                    setLoading(false)

                    if (response.ok) {
                        console.log(response,'btc create response');
                        setAccountInfo(response.data)


                    } else {
                        Swal.fire({
                            title: response.err.statusText,
                            text: response.data.message,
                            confirmButtonColor: '#ff8c00',
                            confirmButtonText: 'Back',
                        })
                    }
                })
                .catch(err => {
                    setLoading(false)
                    Swal.fire('Error', err.message, 'error');
                });
        }
        else if(createAccount==="Ether"){
            createEtherAccount()
                .then(response => {
                    setLoading(false)

                    if (response.ok) {
                        console.log(response,'ether create response');
                        setAccountInfo(response.data)


                    } else {
                        Swal.fire({
                            title: response.err.statusText,
                            text: response.data.message,
                            confirmButtonColor: '#ff8c00',
                            confirmButtonText: 'Back',
                        })
                    }
                })
                .catch(err => {
                    setLoading(false)
                    Swal.fire('Error', err.message, 'error');
                });
        }


    }

    function handleModalCallback() {
        // props.closeModal();
        setShowModal(false)
    }


   function handleCloseModal () {
       setShowModal(false)
       cbCreate(false)
       window.location.reload(true)
    }


    return (
        <Modal
            isOpen={true}
            contentLabel="onRequestClose Example"
            onRequestClose={handleModalCallback}
            shouldCloseOnOverlayClick={false}
        >
            <div className=" ">
                <button onClick={handleCloseModal}>Close </button>

                {loading===false &&  accountInfo &&  createAccount==="Bitcoin" &&
                    <BTCAccountCreate
                btc={true}
                address={accountInfo.address}
                privateKey={accountInfo.privateKey.bn}
                /> }
                {loading===false &&  accountInfo &&  createAccount==="Ether" &&
                <BTCAccountCreate
                    ether={true}
                    address={accountInfo.address}
                    privateKey={accountInfo.privateKey}
                /> }
                {
                    loading && <div>
                        <CustomLoader/>
                    </div>
                }
            </div>

        </Modal>
    );
}


