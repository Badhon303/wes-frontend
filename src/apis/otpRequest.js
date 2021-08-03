export default (phone,email) => {
    return {query:"{  createNewAccountWithOtpRequestApi(phone: \""+phone+"\", email: \""+email+"\") {    result  }}"};
}


