export default (phoneOrEmail) => {
    return {
        query: "{ forgotPasswordPinRequest (phoneOrEmail: \""+phoneOrEmail+"\" ) {  result } }"
    };
}


