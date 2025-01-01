import i18n from "../configs/i18n.config.js";
import { Api403Error,Api401Error, Api404Error,BusinessLogicError } from "../core/error.response.js";
import user from "../models/user.js";
import { createTokenAccessData } from "../utils/auth.utils.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import keyTokenServices from "./keyToken.services.js";
import { getSelectData } from "../utils/index.utils.js";
import mongoose from 'mongoose';


class AuthService {
    async login({email,password}) {
         
    }



    async signup({email,password,full_name,phone}){
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
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
            const publicKeyString = await keyTokenServices.createKeyTokenMappingModel({
                userId : uses_create?._id,
                publicKey : publicKey.toString(),
                privateKey : privateKey.toString(),
            })

            if (!publicKeyString) {
                throw new BusinessLogicError(i18n.translate('error.invalid.publicKey'))
            }
        
            const publicKeyObject = crypto.createPublicKey(publicKeyString);
          
            const tokens = await createTokenAccessData(
                {userID : uses_create?._id , emali : uses_create?.email, phone : uses_create?.phone},
                publicKeyObject,
                privateKey
            )
            //commit dữ liệu
            await session.commitTransaction();
            session.endSession();
            return {
                tokens,
                data : getSelectData({
                    fields : ['_id','full_name','email'],
                    obj : uses_create
                })
            }
        } catch (error) {
            await session.abortTransaction();
            throw new Api404Error(error)
        } finally {
            session.endSession();
        }
       
    }
}


export default new AuthService();