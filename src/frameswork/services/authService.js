import bcrypt from 'bcrypt';
import { destroyCloudinaryURL, uploadResourceSingle } from "../../config/cloudinary/uploadResource.js";
import { extractToken, verifyJWT } from '../../utils/auth.utils.js';
import { BusinessLogicError } from '../web/plugins/error.response.js';
const authServicesFrame = () => {
    const hashPassword = async(password) =>  {
        const salt =  bcrypt.genSaltSync(10);
        return  bcrypt.hashSync(password, salt);
    }

    const comparePassword = (password,currentPassword) => bcrypt.compareSync(password, currentPassword);

    const vertifyToken = async(tokens,keySecret) => {
        const tokensExtract = await extractToken(tokens);
        return  verifyJWT(tokensExtract,keySecret)
    }

    const uploadAvatarImage = async(public_id = null,file) => {
        try {
            //xoa publicID
            if(public_id) {
                await destroyCloudinaryURL(public_id);
            }
            //generate publicID
            const response = await uploadResourceSingle(file);
            return response;
        } catch (error) {   
            console.log(error);
            throw new BusinessLogicError(error?.message || "Some thing went wrong")
        }
    }


    return {
        hashPassword,comparePassword,vertifyToken,uploadAvatarImage
    }
}

export default authServicesFrame