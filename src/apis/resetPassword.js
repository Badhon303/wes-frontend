// {"query":"{  resetPasswordOfUser(pin:\"988822\", newPassword: \"123\"){ result }}"}

export default (pin,newPassword) => {
    return {
        query:"{   resetPasswordOfUser(pin: \""+pin+"\", newPassword: \""+newPassword+"\") {    result }}"
    };
}



