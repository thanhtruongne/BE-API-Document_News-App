
const authServiceApp = (authService) => {

    const hashPassword = async(password) => await authService.hashPassword(password)

    const comparePassword = async(password,currentPassword) => await authService.comparePassword(password,currentPassword)

    const vertifyToken = async(token) => await authService.vertify(token)

    const uploadAvatarImage = async(public_id,file) => authService.uploadAvatarImage(public_id,file)

    return {
        hashPassword,comparePassword,vertifyToken,uploadAvatarImage
    }
}



export default authServiceApp