import  CryptoJS  from "crypto-js";



export  const encryptIpAddress = (privateKey) => {
    const ciphertext = CryptoJS.AES.encrypt(
        privateKey,
        process.env.REACT_APP_CRYPTO
    ).toString();
    console.log(privateKey)
    return ciphertext;
};
