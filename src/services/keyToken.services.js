import keyToken from "../models/keyToken.model";


class KeyTokenService {

    static createKeyTokenMappingModel = async({userId,publicKey,privateKey}) => {
        try {
            const tokens = await keyToken.create({
                user : userId,
                publicKey : publicKey.toString(),
                privateKey : privateKey.toString()
            })
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default KeyTokenService;