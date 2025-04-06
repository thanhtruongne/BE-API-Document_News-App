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
        .lean()
        .exec()

    }   

    const findByQuery = async(query,select = {
         email : 1,phone : 2, role : 3, full_name : 4, avatar : 5, address : 6, posts : 7 ,gender : 8, dateOfBirth : 9 ,status : 10,updatedAt : 11,
         password : 12,_id: 13
    },isLean = true) => {
        return await userModel.findOne(query).select(select).lean(isLean).exec();
    }
    
    
    const createData = async(payloadEntities) => await userModel.create({
        full_name : payloadEntities.getFullName(),
        email : payloadEntities.getEmail(),
        password : payloadEntities.getPassword(),
        phone : payloadEntities.getPhone(),
        avatar : payloadEntities.getAvatar(),
        address : payloadEntities.getAddress(),
        status : payloadEntities.getStatus(),
    })

    const updateData = async(payloadEntities,_id) => {
        const response = await userModel.findByIdAndUpdate(_id,
        {
            full_name : payloadEntities.getFullName(),
            email : payloadEntities.getEmail(),
            phone : payloadEntities.getPhone(),
            address : payloadEntities.getAddress(),
            status : payloadEntities.getStatus()
        },{
            lean : true,
            new : true,
        })
        return response;
    }

    const deleteResource = async(_id) => await userModel.findByIdAndDelete(_id)

    const updateDataByQuery = async(id,query) => {
        return await userModel.findByIdAndUpdate(id,query,{
            lean : true,
            new : true,
            select : '-password'
        })
    }

    const findByID = async(id,select = '',islean = false) => await userModel.findById(id)
    .select(select)
    .lean(islean)
    .exec()


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

    const findUserKeyTokenID = async(id) => await keyToken.findOne({user : id})
    const deleteKeyTokenID = async(id) => await keyToken.deleteOne({user : id})
    const updateRefreshTokenUsed = async( refreshTokens, tokens, _id) => {
        return await keyToken.updateOne({_id},{
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshTokens
            }
        })
    }

    const checkExistsField = async(query) => await userModel.exists(query)
    
    return {
        findAll,
        updateData,
        findByQuery,
        updateDataByQuery,
        createData,
        deleteResource,
        countData,
        findByID,
        createKeyTokens,
        findUserKeyTokenID,
        deleteKeyTokenID,
        updateRefreshTokenUsed,
        checkExistsField
    }

}


export default userRepositoryDB