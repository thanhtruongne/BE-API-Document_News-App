import KeyModel from "../models/keytoken.model.js";


class KeyTokenService {

    static createKeyTokenMappingModel = async({userId,publicKey,privateKey}) => {
        try {
            console.log(publicKey,privateKey);
            const tokens = await KeyModel.create({
                user : userId,
                publicKey, 
                privateKey ,
            })
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default KeyTokenService;