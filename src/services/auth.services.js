import i18n from "../configs/i18n.config";
import { Api403Error,Api401Error } from "../core/error.response";
import user from "../models/user";
import { createTokenAccessData } from "../utils/auth.utils";
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import keyTokenServices from "./keyToken.services";
import { getSelectData } from "../utils/index.utils";
class AuthService {
    async login({email,password}) {
         
    }



    async signup({email,password,full_name,phone}){
        const payload_used = await user.findOne({email}).lean();
        if(payload_used) {
            throw new Api403Error(i18n.translate('error.already_exists_user'));
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const uses_create = await user.create({
           email, password: passwordHash,full_name,phone
        })
        if(!uses_create) {
            throw new Api401Error(i18n.translate('error.relogin'))
        }

        const {
            publicKey,
            privateKey,
        } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });

        //create key token model
        const publicKeyString = await keyTokenServices.createKeyTokenMappingModel(uses_create?._id,publicKey,privateKey)

        if (!publicKeyString) {
            throw new BusinessLogicError(i18n.translate('error.invalid.publicKey"'))
        }

        const publicKeyObject = await crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenAccessData(
            {userID : uses_create?._id , emali : uses_create?.email, phone : uses_create?.phone},
            publicKeyObject,
            privateKey
        )

        return {
            tokens,
            data : getSelectData({
                fields : ['_id','full_name','email'],
                obj : uses_create
            })
        }
    }
}


export default new AuthService();