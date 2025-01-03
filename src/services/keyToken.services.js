import KeyModel from "../models/keytoken.model.js";


class KeyTokenService {

    static createKeyTokenMappingModel = async({userId,publicKey,privateKey,refreshToken}) => {
        try {
            const tokens = await keyTokenModel.findOneAndUpdate({user: userId}, {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            },{upsert : true, new : true});

            return tokens ? tokens.publicKey : null
        } catch (error) {
            throw new Error(error);
        }
    }


    static findByUserId = async (userId) => {
        return await KeyModel.findOne({user: Types.ObjectId(userId)})
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