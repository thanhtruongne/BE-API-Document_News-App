import jwt from "jsonwebtoken"
import catchingAsyncAwait from "../helpers/catchingAsyncAwait.aysnc.js"
import i18n from "../configs/i18n.config.js"

const HEADER = {
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token',
    X_CLIENT_ID: 'x-client-id',
    BEARER: 'Bearer'
}

const createTokenAccessData = async(payload,publicKey,privateKey) => {
  try {
    const access_token = jwt.sign(payload,privateKey,{
        algorithm : 'RS256',
        expiresIn : '2 days'
    })
    
    const refresh_token = jwt.sign(payload,privateKey,{
        algorithm : 'RS256',
        expiresIn : '7 days'
    })

    verifyJwt(access_token,publicKey,(err,decode) => {
        if(err) {
            throw new Error(err);
        }
    })

    return {
        access_token,
        refresh_token
    }
    

  } catch (error) {
        console.log('error for create key token')
        throw new Error(error);
  }
}
const extractToken = (tokenHeader) => {
    if (!tokenHeader) return "";
    return tokenHeader.replace(HEADER.BEARER, '')
}

const verifyJwt = (token, keySecret) => {
    return jwt.verify(token, keySecret);
}

const parseJwt = (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

// vertify accessToken với public key
// refreshToken với privateKey


const authencation = catchingAsyncAwait(async(req,res,next)=> {
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const refreshToken = extractToken(req.headers[HEADER.REFRESH_TOKEN])
    const accessToken = extractToken(req.headers[HEADER.AUTHORIZATION])


    // check user id
    const obj = parseJwt(accessToken || refreshToken)
    if (!obj.userId) return next(new Api403Error(i18n.translate('error.not_found.data')))

    const userId = clientId || obj.userId
    if (!userId) return next(new Api403Error(i18n.translate('error.not_found.data')))

    // check trong key token với userId
    const store = await KeyTokenService.findByUserId(userId)
    if (!store) return next(new Api404Error(i18n.translate('error.user_id.not_found')))


    //  refreshToken nếu có refreshToken
    if (refreshToken) {
        try {
            const decodeUser = verifyJwt(refreshToken, store.privateKey);
            if (userId !== decodeUser.userId) return next(new Api401Error(i18n.translate('error.user_id.not_found')))

            req.user = decodeUser
            req.store = store
            req.refreshToken = refreshToken

            return next()
        }  catch (error) {
            throw error
        }
    }
     // 3. get auth token
     if (!accessToken) return next(new Api403Error(i18n.translate('error.invalid.request')))

    // 4.
    try {
        const decodeUser = verifyJwt(accessToken, store.publicKey);
        if (userId !== decodeUser.userId) return next(new Api401Error(i18n.translate('error.user_id.not_found')))

        req.user = decodeUser
        req.store = store
        return next()
    } catch (error) {
        throw error
    }
}) 

export {
    createTokenAccessData,
    authencation
}