export default (email, password) => {
    return { query: `{  login(emailOrPhone: "${email}", password: "${password}"){id firstName lastName loginKey roleId homePage}}`};
}