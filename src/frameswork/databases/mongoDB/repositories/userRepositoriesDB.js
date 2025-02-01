    import crypto from 'crypto';
import { createTokenAccessData } from '../../../../utils/auth.utils.js';
import { omit } from "../../../../utils/index.utils.js";
import { Api403Error } from '../../../web/plugins/error.response.js';
import keyToken from "../models/keyToken.js";
import userModel from "../models/user.js";
const userRepositoryDB = () => {

    const findAll = async(params) => {
        return await userModel.find(omit(params,'page','perPage','select'))
        .select(params.select)
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage)
    }

    const findByQuery = async(query,select = {
         email : 1,phone : 2, role : 3, full_name : 4, avatar : 5, address : 6, posts : 7 ,gender : 8, dateOfBirth : 9 ,status : 10,updatedAt : 11,
         password : 12,_id: 13
    }) => {
        return await userModel.findOne(query).select(select).lean()
    }
    
    const createData = async(payloadEntities) => await userModel.create({
        full_name : payloadEntities.getFullName(),
        email : payloadEntities.getEmail(),
        password : payloadEntities.getPassword(),
        phone : payloadEntities.getPhone()
    })

    const countData = async(params) => await userModel.countDocuments(omit(params,'page','perPage','select'));
    
    // for authRepo  && Keytoken
    const createKeyTokens = async(keyTokenEntities) => {
        try {
            const { publicKey, privateKey  } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding:  { type: 'pkcs1', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
            })
            const tokens = await createTokenAccessData(
                {   userID : keyTokenEntities.getUserID(),
                    email : keyTokenEntities.getEmail(),
                    role: keyTokenEntities.getRole(),
                },
                publicKey,
                privateKey
            );
    
            if(!tokens) {
                throw new Api403Error(i18n.translate('error.not_found.data'))
            }
            //tạo key Token trong db
            await keyToken.findOneAndUpdate({user: keyTokenEntities.getUserID()}, {
                publicKey,
                refreshTokensUsed : [],
                refreshToken : tokens?.refresh_token
            },{upsert : true, new : true});

           
            return tokens;

        } catch (error) {
            throw new Error(error);
        }
    }

    const findUserKeyTokenID = async(id) => await keyToken.findOne({user : id}).lean()
    const deleteKeyTokenID = async(id) => await keyToken.deleteOne({user : id})
    const updateRefreshTokenUsed = async(refreshTokens,tokens,keyStore) => {
        return await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshTokens
            }
        })
    }
    
    return {
        findAll,findByQuery,createData,countData,createKeyTokens,findUserKeyTokenID,deleteKeyTokenID,updateRefreshTokenUsed
    }

}


export default userRepositoryDB