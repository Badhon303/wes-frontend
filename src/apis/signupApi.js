export default (firstName,lastName, email, password,phone, address, userType,otp) => {
    return {query:"{  signUpApi(firstName: \""+firstName+"\", lastName: \""+lastName+"\", email:\""+email+"\", password:\""+password+"\", phone:\""+phone+"\", address:\""+address+"\", userType: \""+userType+"\", isActive:true,createdBy:1, otp:\""+otp+"\",) {    id    firstName    lastName    email    password    phone    address    loginKey  }}"};
}
