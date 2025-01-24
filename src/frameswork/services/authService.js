import bcrypt from 'bcrypt';
import { extractToken, verifyJWT } from '../../utils/auth.utils.js';


const authServicesFrame = () => {
    const hashPassword = async(password) =>  {
        const salt =  bcrypt.genSaltSync(10);
        return  bcrypt.hashSync(password, salt);
    }

    const comparePassword = (password,currentPassword) => bcrypt.compare(password, currentPassword);

    const vertifyToken = async(tokens,keySecret) => {
        const tokensExtract = await extractToken(tokens);
        return  verifyJWT(tokensExtract,keySecret)
    }
    return {
        hashPassword,comparePassword,vertifyToken
    }
}

export default authServicesFrame