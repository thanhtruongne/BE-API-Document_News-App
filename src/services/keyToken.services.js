import KeyModel from "../models/keytoken.model.js";
import { createTokenAccessData } from "../utils/auth.utils.js";
import crypto from "crypto"

class KeyTokenService {

    static createKeyTokenMappingModel = async({userId,publicKey,refreshToken}) => {
        try {
            const tokens = await KeyModel.findOneAndUpdate({user: userId}, {
                publicKey, refreshTokensUsed: [], refreshToken
            },{upsert : true, new : true});

            return tokens ? tokens.publicKey : null
        } catch (error) {
            throw new Error(error);
        }
    }

    static getTokenKeys = async(userInfo) => {
        const { publicKey, privateKey  } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding:  { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        })
        const tokens = await createTokenAccessData(
            {userID : userInfo?._id,email : userInfo?.email,role: userInfo?.role},
            publicKey,
            privateKey
        );

        if(!tokens) {
            throw new Api403Error(i18n.translate('error.not_found.data'))
        }
        // tạo trong keytoken
        const userID = userInfo?._id.toString();
        await this.createKeyTokenMappingModel({ userId: userID, publicKey,refreshToken :tokens?.refresh_token  })
        return tokens;
        
    }


    static findByUserId = async (userId) => {
        return await KeyModel.findOne({user : userId})
    }

    static removeKeyById = async (id) => {
        return await KeyModel.remove(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyModel.findOne({ refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await KeyModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await KeyModel.findByIdAndDelete({userId: userId})
    }
}
export default KeyTokenService;