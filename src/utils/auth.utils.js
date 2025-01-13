import JWT from "jsonwebtoken"
import catchingAsyncAwait from "../helpers/catchingAsyncAwait.aysnc.js"
import i18n from "../configs/i18n.config.js"
import KeyTokenService from "../services/keyToken.services.js"
import { Api403Error,Api404Error,Api401Error } from "../core/error.response.js"
import crypto from "crypto"
const HEADER = {
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token',
    X_CLIENT_ID: 'x-client-id',
    BEARER: 'Bearer'
}

const createTokenAccessData = async(payload,publicKey,privateKey) => {
  try {
    const access_token = JWT.sign(payload,privateKey,{
        algorithm: 'RS256',
        expiresIn : '2d'
    })
    
    const refresh_token = JWT.sign(payload,privateKey,{
        algorithm: 'RS256',
        expiresIn : '7d'
    })

    JWT.verify(access_token, publicKey,(err,decoded) => {
        if(err) {
            console.log(err)
        }
        console.log('decode',decoded);
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
    return tokenHeader.split(' ')[1]
}

const convertPublicKeyObecjt = async(publicKey) => {
    return await crypto.createPublicKey(publicKey);
}

const verifyJWT = (token, keySecret) => {
    return  JWT.verify(token, keySecret);
}

const parseJWT = (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const authencation = catchingAsyncAwait(async(req,res,next) => {
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const refreshToken = extractToken(req.headers[HEADER.REFRESH_TOKEN])
    const accessToken = extractToken(req.headers[HEADER.AUTHORIZATION])

    // check user id
    const obj = parseJWT(accessToken || refreshToken)
    if (!obj.userID) return next(new Api403Error(i18n.translate('error.not_found.data')))
      
    const userId = clientId 
    if (!userId) return next(new Api403Error(i18n.translate('error.not_found.data')))
    // check trong key token với userId
    const store = await KeyTokenService.findByUserId(userId)
    if (!store) return next(new Api404Error(i18n.translate('error.user_id.not_found')))
    //  refreshToken nếu có refreshToken
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, convertPublicKeyObecjt(store.publicKey),[{algorithms : 'RS256'}]);
            if (userId !== decodeUser.userId) return next(new Api401Error(i18n.translate('error.user_id.not_found')))

            req.user = decodeUser
            req.store = store
            req.refreshToken = refreshToken

            return next()
        }  catch (error) {
            throw error
        }
    }
     // get token
    if (!accessToken) return next(new Api403Error(i18n.translate('error.invalid.request')))
    try { 
        const decodeUser = JWT.verify(accessToken, store.publicKey);
        if (userId !== decodeUser.userID) return next(new Api401Error(i18n.translate('error.user_id.not_found')))

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