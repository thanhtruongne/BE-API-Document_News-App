
const authServiceApp = (authService) => {

    const hashPassword = async(password) => await authService.hashPassword(password)

    const comparePassword = async(password,currentPassword) => await authService.comparePassword(password,currentPassword)

    const vertifyToken = async(token) => await authService.vertify(token)

    return {
        hashPassword,comparePassword,vertifyToken
    }
}



export default authServiceApp