import i18n from "../configs/i18n.config.js";
import { Api403Error,Api401Error, Api404Error,BusinessLogicError } from "../core/error.response.js";
import user from "../models/user.js";
import bcrypt from 'bcrypt';
import keyTokenServices from "./keyToken.services.js";
import { getSelectData } from "../utils/index.utils.js";
import crypto from "crypto"

class AuthService {
    async login(reqData) {
        const { email, password, system } = reqData;
        const user_attemp = await user.findOne({email}).lean()
        if (!user_attemp) {
             throw new Api403Error(i18n.translate('error.user.invalid'))
        }

        const match = bcrypt.compare(password, user_attemp?.password)
        if (!match) throw new BusinessLogicError(i18n.translate('errors.login_fail'))

        if(system && user_attemp?.role != 'Admin') {
            throw new BusinessLogicError(i18n.translate('errors.login_fail'))
        }

        if(user_attemp?.status == 'Block' || user_attemp?.status == 'Deleted') {
            throw new Api401Error(i18n.translate('errors.login_fail'))
        }
        
        const tokens = await keyTokenServices.getTokenKeys(user_attemp)
        return {
            users: getSelectData(
                 ['_id', 'full_name','status', 'email','role'],
                 user_attemp,
            ),
            tokens
        }
    }



    async signup({email,password,full_name,phone}){
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
              
            const tokens = await keyTokenServices.getTokenKeys(uses_create)

            return {
                tokens,
                data : getSelectData({
                    fields : ['_id','full_name','email'],
                    obj : uses_create
                })
            }
        } catch (error) {
            throw new Api404Error(error)
        } 
    }


    async logout(store) {
       try {
            const delete_keyToken = await keyTokenServices.deleteKeyById(store?._id);
            return delete_keyToken;
       } catch (error) {
           throw new Api403Error(i18n.translate('error.message.commit'));
       }
    }

    async refreshToken({refreshToken,user,store}) {

    }
    
    async profile(store){
       try {
            const user_attemp = await user.findOne({_id : store?.userID , email : store?.email }).lean()
            if(!user_attemp) {
                throw new Api403Error(i18n.translate('error.user.invalid'))
            }
            return  getSelectData(
                ['_id', 'full_name','status', 'email','role'],
                user_attemp,
            )
       } catch (error) {
            throw new Api403Error(i18n.translate('error.message.commit'));
       }
    }
}


export default new AuthService();